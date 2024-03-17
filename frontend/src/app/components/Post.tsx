"use client";

import Image from "next/image";
import {CodeEditorWindow} from "@/app/components/EditorWindow";
import Link from "next/link";
import {ICommit} from "@/app/challenge/page";
import {useEffect, useState} from "react";


export const Post = ({props, locked}: { props: ICommit, locked: boolean }) => {

    const [data, setData] = useState<{ username: string, avatar_url: string }>()
    const [selectEmojiOpen, setSelectEmojiOpen] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:3001/api/user/${props.user_id}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => setData(data || undefined))
            .catch((err) => console.error(err))
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }



    const blur = locked ? 'blur select-none' : ''

    const emojiList = {
        heart: '❤️',
        rocket: '🚀',
        thumbsup: '👍',
        thumbsdown: '👎',
        skull: '💀',
        trash: '🗑️',
        tada: '🎉',
        facepalm: '🤦',
        nerd: '🤓'
    }

    const usedReactionsList = Object.entries(props.reactions).map((reaction) => {
        const [key, value] = reaction
        if (value === 0) return null

        const onClick = () => {
            console.log('clicked button with emoji', key, data.username)
        }

        return (
            <button onClick={onClick} type="button"
                    className={`h-12 px-4 text-xl inline-flex items-center font-semibold rounded-full ${props.user_reactions[key as keyof typeof props.reactions] ? 'bg-blue-700' : ''} text-white hover:bg-blue-700`}>
                {emojiList[key as keyof typeof props.reactions]} {value}
            </button>
        )
    })

    const unusedReactionsList = Object.entries(props.reactions).map((reaction) => {
        const [key, value] = reaction
        if (value !== 0) return null

        const onClick = () => {
            console.log('clicked button with emoji', key, data.username)
        }

        return (
            <button onClick={onClick} type="button"
                    className={`h-12 px-4 text-xl inline-flex items-center font-semibold rounded-full ${props.user_reactions[key as keyof typeof props.reactions] ? 'bg-blue-700' : ''} text-white hover:bg-blue-700`}>
                {emojiList[key as keyof typeof props.reactions]}
            </button>
        )
    })


    return (
        <div className="min-w-[1000px] flex flex-col mb-24">

            {
                data.username ? (
                    <div className="flex flex-row items-center mb-5">
                        <Image src={data.avatar_url} className="w-10 h-10 rounded-full mr-3"
                               alt={`${data.username} profile picture`} width={400} height={400}/>
                        <Link
                            href={`https://github.com/${data.username}`}
                        >
                            <h2 className="text-xl font-bold">@{data.username}</h2>
                        </Link>
                    </div>

                ) : null
            }


            <h1 className={`${blur} text-xl font-bold text-left mb-1`}>{props.title}</h1>
            <div className={`${blur} mb-5`}>
                <p>{props.description}</p>
            </div>

            <div className={`${blur}`}>
                <CodeEditorWindow boilerPlate={props.solution} language={props.language} onChange={() => {
                }} fixedHeight={true} readOnly={true}/>
            </div>

            <div className={'mt-2 flex space-x-4'}>
                {usedReactionsList}
                <div className={`rounded-full border-2  border-gray-500`}>
                    <button type="button"
                            onClick={() => setSelectEmojiOpen(!selectEmojiOpen)}
                            className="w-12 h-12 items-center text-xl inline-flex  font-semibold  text-gray-500 hover:border-gray-200 hover:text-gray-200">
                        <div className='flex w-full justify-center'>
                            {selectEmojiOpen ? '-' : '+'}
                        </div>
                    </button>
                    {selectEmojiOpen && unusedReactionsList}
                </div>


            </div>

        </div>
    )
}
