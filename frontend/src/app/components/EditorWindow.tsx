"use client";

import React, {useEffect, useState} from "react";

import Editor, {useMonaco} from "@monaco-editor/react";
import {monacoTheme} from "@/app/components/MonacoTheme";

export const CodeEditorWindow = ({onChange, language, boilerPlate, fixedHeight, readOnly }: {
    onChange: (code: string) => void,
    language: string,
    boilerPlate: string,
    fixedHeight?: boolean,
    readOnly?: boolean
}) => {
    const [value, setValue] = useState(boilerPlate || "");

    const monaco = useMonaco();

    useEffect(() => {

        monaco?.editor.defineTheme('custom', {
            ...monacoTheme,
            base: 'vs-dark',
            inherit: true,
        });

        monaco?.editor.setTheme('custom')
    }, [monaco]);

    // https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html
    // https://www.npmjs.com/package/@monaco-editor/react#editor
    const options = {
        selectOnLineNumbers: true,
        scrollBeyondLastLine: false,
        readOnly: readOnly,
        fontSize: 19,
        overviewRulerLanes: 0,
        minimap: {
            enabled: false,
        },
        padding: {
            top: 20,
            bottom: 20
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        setValue(value || "");
        onChange(value || "");
    };

    return (
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
            <Editor
                height={fixedHeight ? `calc(${(boilerPlate.split("\n").length + 1) * 26}px + 40px)` : "20vh"}
                width={`100%`}
                language={language || "javascript"}
                value={boilerPlate}
                defaultValue={boilerPlate}
                onChange={handleEditorChange}
                options={options}
            />
        </div>
    );
};
