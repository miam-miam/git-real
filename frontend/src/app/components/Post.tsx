"use client";

import Image from "next/image";
import {CodeEditorWindow} from "@/app/components/EditorWindow";
import Link from "next/link";
import {useState} from "react";

interface IPost {
    id: string
    username?: string
    profile_picture: string
    title: string
    description: string
    language: string
    code: string
    locked: boolean
    reactions: {
        heart: number
        rocket: number
        thumbsup: number
        thumbsdown: number
        skull: number
        trash: number
        tada: number
        facepalm: number
        nerd: number
    }
    user_reactions: {
        heart: boolean
        rocket: boolean
        thumbsup: boolean
        thumbsdown: boolean
        skull: boolean
        trash: boolean
        tada: boolean
        facepalm: boolean
        nerd: boolean
    }
}


export const Post = ({props}: { props: IPost }) => {

    const [selectEmojiOpen, setSelectEmojiOpen] = useState(false)

    const blur = props.locked ? 'blur select-none' : ''

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
            console.log('clicked button with emoji', key, props.username)
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
            console.log('clicked button with emoji', key, props.username)
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
            {/*<div className={"flex justify-center bg-amber-500"}>*/}
            {/*    <div className="z-[8237498237487236478] absolute grid mt-32 content-center">*/}
            {/*        <div className={"w-96"}>*/}
            {/*            <p>Commit your challenge to view</p>*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {
                props.username ? (
                    <div className="flex flex-row items-center mb-5">
                        <Image src={props.profile_picture} className="w-10 h-10 rounded-full mr-3"
                               alt={`${props.username} profile picture`} width={400} height={400}/>
                        <Link
                            href={`https://github.com/${props.username}`}
                        >
                            <h2 className="text-xl font-bold">@{props.username}</h2>
                        </Link>
                    </div>
                ) : null
            }


            <h1 className={`${blur} text-xl font-bold text-left mb-1`}>{props.title}</h1>
            <div className={`${blur} mb-5`}>
                <p>{props.description}</p>
            </div>

            <div className={`${blur}`}>
                <CodeEditorWindow boilerPlate={props.code} language={props.language} onChange={() => {
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
