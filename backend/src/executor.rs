use anyhow::anyhow;
use governor::{DefaultDirectRateLimiter, Quota, RateLimiter};
use itertools::Itertools;
use piston_rs::ExecResponse;
use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use std::fmt::{Display, Formatter, Write};
use std::num::NonZeroU32;
use std::sync::OnceLock;
use std::time::Duration;

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Default, sqlx::Type, Eq, PartialEq, Hash)]
#[repr(i32)]
pub enum Language {
    #[default]
    Rust = 0,
    Python = 1,
    TypeScript = 2,
}

impl From<i32> for Language {
    fn from(value: i32) -> Self {
        match value {
            0 => Self::Rust,
            1 => Self::Python,
            _ => Self::TypeScript,
        }
    }
}

impl Language {
    pub fn name(&self) -> &'static str {
        match self {
            Language::Rust => "rust",
            Language::Python => "python",
            Language::TypeScript => "typescript",
        }
    }

    pub fn extension(&self) -> &'static str {
        match self {
            Language::Rust => "rs",
            Language::Python => "py",
            Language::TypeScript => "ts",
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum FuncType {
    Array(Box<FuncType>),
    Int(i32),
    String(String),
}

impl Display for FuncType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            FuncType::Array(_) => Ok(()),
            FuncType::Int(v) => write!(f, "{v}"),
            FuncType::String(s) => write!(f, "{s}"),
        }
    }
}

impl FuncType {
    fn type_name(&self, language: Language) -> String {
        match (self, language) {
            (FuncType::Array(a), Language::Rust) => {
                format!("Vec<{}>", a.type_name(language))
            }
            (FuncType::Array(a), Language::Python) => {
                format!("List[{}]", a.type_name(language))
            }
            (FuncType::Array(a), Language::TypeScript) => {
                format!("{}[]", a.type_name(language))
            }
            (FuncType::Int(_), Language::Rust) => String::from("i32"),
            (FuncType::Int(_), Language::Python) => String::from("int"),
            (FuncType::Int(_), Language::TypeScript) => String::from("number"),
            (FuncType::String(_), Language::Rust) => String::from("String"),
            (FuncType::String(_), Language::Python) => String::from("str"),
            (FuncType::String(_), Language::TypeScript) => String::from("string"),
        }
    }

    fn type_init(&self, language: Language) -> String {
        match (self, language) {
            (FuncType::Int(_), Language::Python) => String::from("int"),
            (FuncType::Int(_), Language::TypeScript) => String::from("parseInt"),
            _ => String::new(),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Function {
    pub name: String,
    pub inputs: Vec<(String, FuncType)>,
    pub output: FuncType,
}

impl From<JsonValue> for Function {
    fn from(value: JsonValue) -> Self {
        serde_json::from_value(value).unwrap()
    }
}

impl Function {
    pub fn generate_inputs(&self, language: Language) -> String {
        self.inputs
            .iter()
            .map(|(n, t)| Self::generate_input(n.as_str(), t, language))
            .join(", ")
    }

    pub fn generate_function(&self, language: Language) -> String {
        let name = self.name.as_str();
        let inputs = self.generate_inputs(language);
        let output = self.output.type_name(language);
        match language {
            Language::Rust => {
                format!("pub fn {name}({inputs}) -> {output} {{\n    \n}}")
            }
            Language::Python => {
                format!("def {name}({inputs}) -> {output}:\n    ")
            }
            Language::TypeScript => {
                format!("function {name}({inputs}): {output} {{\n    \n}};")
            }
        }
    }

    fn generate_input(name: &str, func_type: &FuncType, language: Language) -> String {
        format!("{name}: {}", func_type.type_name(language))
    }

    fn generate_arg_inputs(&self, language: Language) -> String {
        match language {
            Language::Rust => {
                self.inputs
                    .iter()
                    .enumerate()
                    .fold(String::new(), |mut acc, (i, (_n, t))| {
                        let _ = writeln!(
                            acc,
                            "let value{i} = args[{}].parse::<{}>().unwrap();",
                            i + 1,
                            t.type_name(language)
                        );
                        acc
                    })
            }
            Language::Python => {
                self.inputs
                    .iter()
                    .enumerate()
                    .fold(String::new(), |mut acc, (i, (_n, t))| {
                        let _ = writeln!(
                            acc,
                            "value{i} = {}(sys.argv[{}])",
                            t.type_init(language),
                            i + 1
                        );
                        acc
                    })
            }
            Language::TypeScript => {
                self.inputs
                    .iter()
                    .enumerate()
                    .fold(String::new(), |mut acc, (i, (_n, t))| {
                        let _ = writeln!(
                            acc,
                            "// @ts-ignore\nconst value{i} = {}(process.argv[{}])",
                            t.type_init(language),
                            i + 2
                        );
                        acc
                    })
            }
        }
    }

    fn generate_func_call(&self) -> String {
        let name = self.name.as_str();
        let inputs = self
            .inputs
            .iter()
            .enumerate()
            .map(|(i, _)| format!("value{i}"))
            .join(", ");
        format!("{name}({inputs})")
    }

    pub fn main_boilerplate(&self, language: Language, content: &str) -> String {
        let get_inputs = self.generate_arg_inputs(language);
        let func_call = self.generate_func_call();
        match language {
            Language::Rust => {
                format!(
                    "
use std::env;
fn main() {{
    let args: Vec<String> = env::args().collect();
    {get_inputs}
    println!(\"{{}}\", {func_call});
}}
{content}"
                )
            }
            Language::Python => {
                format!(
                    "
import sys
{content}
{get_inputs}
print({func_call})
"
                )
            }
            Language::TypeScript => {
                format!(
                    "
{content}
{get_inputs}
console.log({func_call});
"
                )
            }
        }
    }
}

pub async fn test_language(
    language: Language,
    function: Function,
    content: &str,
) -> anyhow::Result<(bool, ExecResponse)> {
    let client = piston_rs::Client::new();
    let file_content = function.main_boilerplate(language, content);
    let file_name = format!("main.{}", language.extension());
    let inputs = function
        .inputs
        .iter()
        .map(|(_n, t)| t.to_string())
        .collect_vec();

    static LIMITER: OnceLock<DefaultDirectRateLimiter> = OnceLock::new();

    let limiter = LIMITER.get_or_init(|| {
        RateLimiter::direct(
            #[allow(deprecated)]
            Quota::new(NonZeroU32::new(1).unwrap(), Duration::from_millis(300)).unwrap(),
        )
    });

    let executor = piston_rs::Executor::new()
        .set_language(language.name())
        .set_version("*")
        .add_args(inputs.iter().map(|i| i.as_str()).collect_vec())
        .add_file(
            piston_rs::File::default()
                .set_name(file_name.as_str())
                .set_content(file_content.as_str()),
        );

    limiter.until_ready().await;

    let response = client
        .execute(&executor)
        .await
        .map_err(|e| anyhow!("piston error: {e}"))?;

    let correct = response.run.stdout == format!("{}\n", function.output);
    Ok((correct, response))
}

#[cfg(test)]
mod test {
    use crate::executor::{test_language, FuncType, Function, Language};
    use tokio::join;

    async fn future() {
        let res = test_language(
            Language::Rust,
            Function {
                name: "add".to_string(),
                inputs: vec![
                    ("left".to_string(), FuncType::Int(43)),
                    ("right".to_string(), FuncType::Int(21)),
                ],
                output: FuncType::Int(64),
            },
            "pub fn add(left: i32, right: i32) -> i32 {left + right}",
        )
        .await
        .unwrap();
        println!("{res:?}")
    }

    #[tokio::test]
    pub async fn test_all_languages() {
        let res = test_language(
            Language::Rust,
            Function {
                name: "add".to_string(),
                inputs: vec![
                    ("left".to_string(), FuncType::Int(43)),
                    ("right".to_string(), FuncType::Int(21)),
                ],
                output: FuncType::Int(64),
            },
            "pub fn add(left: i32, right: i32) -> i32 {left + right}",
        )
        .await
        .unwrap();
        println!("{res:?}");

        let res = test_language(
            Language::Python,
            Function {
                name: "add".to_string(),
                inputs: vec![
                    ("left".to_string(), FuncType::Int(43)),
                    ("right".to_string(), FuncType::Int(21)),
                ],
                output: FuncType::Int(64),
            },
            "def add(left: int, right: int) -> int:\n    return left + right",
        )
        .await
        .unwrap();
        println!("{res:?}");

        let res = test_language(
            Language::TypeScript,
            Function {
                name: "add".to_string(),
                inputs: vec![
                    ("left".to_string(), FuncType::Int(43)),
                    ("right".to_string(), FuncType::Int(21)),
                ],
                output: FuncType::Int(64),
            },
            "const add = function(left: number, right: number): number \n{return left + right;}",
        )
        .await
        .unwrap();
        println!("{res:?}");
    }

    #[tokio::test]
    pub async fn test_rate_limiting() {
        join!(
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future(),
            future()
        );
    }
}
