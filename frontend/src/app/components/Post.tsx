"use client";

import Image from "next/image";
import {CodeEditorWindow} from "@/app/components/EditorWindow";
import Link from "next/link";

interface IPost {
    username: string
    profile_picture: string
    title: string
    description: string
    language: string
    code: string
    locked: boolean
}


export const Post = ({ props }: { props: IPost }) => {

    const blur = props.locked ? 'blur select-none' : ''

    return (
        <div className="min-w-[1000px] flex flex-col mb-24">
            <div className="flex flex-row items-center mb-5">
                <Image src={props.profile_picture} className="w-10 h-10 rounded-full mr-3"
                       alt={`${props.username} profile picture`} width={400} height={400}/>
                <Link
                    href={`https://github.com/${props.username}`}
                >
                    <h2 className="text-xl font-bold">@{props.username}</h2>
                </Link>
            </div>

            <h1 className={`${blur} text-xl font-bold text-left mb-1`}>{props.title}</h1>
            <div className={`${blur} mb-5`}>
                <p>{props.description}</p>
            </div>

            <div className={`${blur}`}>
                <CodeEditorWindow boilerPlate={props.code} language={props.language} onChange={() => {}} fixedHeight={true} readOnly={true}/>
            </div>

        </div>
    )
}
