"use client";

import Image from "next/image";
import {SignIn} from "@/app/components/SignIn";
import Editor from "@monaco-editor/react";
import {FormEvent, useEffect, useState} from "react";
import {CodeEditorWindow} from "@/app/components/EditorWindow";
import {Countdown} from "@/app/components/Countdown";
import {fetchChallenge, IChallenge} from "@/app/utilities/fetchChallenge";

const data = {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n" +
        "\n" +
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n" +
        "\n" +
        "You can return the answer in any order.\n",
    example_input: "nums = [2,7,11,15], target = 9",
    example_output: "[0,1]",
    lang_boilerplate: {
        python: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass",
        typescript: "var twoSum = function(nums, target) {\n    \n};",
        rust: "fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    \n}",
    },
    default_lang: "typescript"
}

export default function Challenge() {


    const [data, setData] = useState<IChallenge>()
    const [code, setCode] = useState("");

    useEffect(() => {
        fetchChallenge()
            .then((data) => setData(data || undefined))
            .catch((err) => console.error(err))
    }, []);

    if (!data) {
        return null;
    }

    const onChange = (data: string) => {
        setCode(data);
    };

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)

        const submitData = Object.fromEntries(formData);

        const res = await fetch('http://localhost:3001/api/commits', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                title: submitData.commit_message,
                description: submitData.commit_description,
                solution: code,
                language: data.default_language
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            console.error("res commit", res.status, res.statusText)
        }

        if (res.ok) {
            console.log("commit success")
        }

    }

    const now = Date.now();

    const lastGitRealStartTime = new Date(data.date_released).getTime()
    const secondsSinceLastGitReal = (now - lastGitRealStartTime) / 1000;


    const boilerplate = data.boilerplate[data.default_language as keyof typeof data.boilerplate]

    return (
        <div className="max-w-7xl relative flex flex-col">
            <div className='flex justify-center mb-20'>
                <Countdown textSize={"text-9xl"} timeLeft={secondsSinceLastGitReal}/>
            </div>
            <div className="flex flex-col mb-10">
                <h1 className="text-7xl font-bold text-left mb-1">{data.title}</h1>
                <h2 className='text-gray-400'>DAILY CHALLENGE</h2>
            </div>
            <div className='mb-10'>
                <p>{data.description}</p>
            </div>
            <div className='flex flex-col mb-10'>
                <div className='flex flex-row'>
                    <div className='flex flex-col mr-24'>
                        <h4 className={"mb-1"}>Input</h4>
                        <div className='p-3 bg-gray-800 rounded-lg'>
                            <code className={"font-mono"}>{data.example_input}</code>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h4 className={"mb-1"}>Output</h4>
                        <div className='p-3 bg-gray-800 rounded-lg'>
                            <code className={"font-mono"}>{data.example_output}</code>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <div className='mb-10'>
                    <h3>Language</h3>
                    <div className='w-64'>
                        <select
                            onChange={(e) => setData({...data, default_language: e.target.value})}
                            defaultValue={data.default_language}
                            className="py-3 px-4 pe-9 block w-full bg-gray-800 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
                            <option className="font-sans" value='typescript'>Typescript</option>
                            <option className="font-sans" value='python'>Python</option>
                            <option className="font-sans" value='rust'>Rust</option>
                        </select>
                    </div>
                </div>

                <div className='-z-50'>
                    <CodeEditorWindow onChange={onChange} language={data.default_language}
                                      boilerPlate={boilerplate}/>
                </div>

                <div>
                    <h2 className='mt-10 mb-5'>Commit</h2>
                    <div>
                        <form onSubmit={(e) => submit(e)}>
                            <div className='flex flex-row'>
                                <input type="text"
                                       name={"commit_message"}
                                       className=" mr-5 py-3 px-4 block w-full bg-gray-800 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                       placeholder="Commit message"/>
                                <button type="submit"
                                        disabled={code.length === 0}
                                        className="w-64 text-center py-3 px-4 inline-flex gap-x-2 text-sm font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:bg-blue-900">
                                    Commit
                                </button>
                            </div>

                            <textarea
                                name={"commit_description"}
                                className="my-5 py-3 px-4 block w-full bg-gray-800 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={3} placeholder="Commit description"></textarea>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
