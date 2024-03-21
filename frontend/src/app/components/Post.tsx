"use client";

import Image from "next/image";
import {CodeEditorWindow} from "@/app/components/EditorWindow";
import Link from "next/link";
import {ICommit} from "@/app/challenge/page";
import {useEffect, useState} from "react";

export interface IReactionState {
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

export interface IUserReactions {
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

export const Post = ({props, locked}: { props: ICommit, locked: boolean }) => {
    const commitId = props.id;
    const [data, setData] = useState<{ username: string, avatar_url: string }>()
    const [reactions, setReactions] = useState<IReactionState>({
        heart: 0,
        rocket: 0,
        thumbsup: 0,
        thumbsdown: 0,
        skull: 0,
        trash: 0,
        tada: 0,
        facepalm: 0,
        nerd: 0
    });
    const [userReactions, setUserReactions] = useState<IUserReactions>({
        heart: false,
        rocket: false,
        thumbsup: false,
        thumbsdown: false,
        skull: false,
        trash: false,
        tada: false,
        facepalm: false,
        nerd: false,
    })
    const [selectEmojiOpen, setSelectEmojiOpen] = useState(false)

    function setUserData() {
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
    }

    function updateReactionState() {
        fetch(`http://localhost:3001/api/commits/${props.id}/reactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'applications/json'
            }
        })
            .then((res) => res.json())
            .then((reactions: IReactionState) => setReactions(reactions))
            .catch((err) => console.error(err))
    }

     function updateUserReactions() {
        fetch(`http://localhost:3001/api/commits/${props.id}/user-reactions`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((userReactions: IUserReactions) => setUserReactions(userReactions))
            .catch((err) => console.error(err))
    }

    function sendReaction(key: string, active: boolean) {
        fetch('http://localhost:3001/api/reactions', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                // user_id: props.user_id,
                commit_id: props.id,
                reaction_id: Object.keys(reactions).indexOf(key),
                // active: false,
                active
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => console.log("Received", res, "after posting reaction"));
    }

    useEffect(() => {
        setUserData();
        updateReactionState();
        updateUserReactions();
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

    const usedReactionsList = Object.entries(reactions).map((reaction, index) => {
        const [key, value] = reaction
        if (value === 0) return null

        const onClick = async () => {
            if (userReactions[key as keyof typeof reactions]) {
                setUserReactions({...userReactions, [key]: false})
                setReactions({...reactions, [key]: value - 1})

                // await fetch('http://localhost:3001/api/reactions', {
                //     method: 'POST',
                //     credentials: "include",
                //     body: JSON.stringify({
                //         user_id: props.user_id,
                //         commit_id: props.id,
                //         reaction_id: Object.keys(reactions).indexOf(key),
                //         active: false
                //     }),
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // })

                sendReaction(key, false);
            } else {
                sendReaction(key, true);
            }

            // setUserReactions({...userReactions, [key]: true})
            // setReactions({...reactions, [key]: value + 1})

            // await fetch('http://localhost:3001/api/reactions', {
            //     method: 'POST',
            //     credentials: "include",
            //     body: JSON.stringify({
            //         user_id: props.user_id,
            //         commit_id: props.id,
            //         reaction_id: Object.keys(reactions).indexOf(key),
            //         active: true
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            // sendReaction(key, true)

        }

        updateReactionState();
        updateUserReactions();

        return (
            <button key={index} onClick={onClick} type="button"
                    className={`${blur} h-12 px-4 text-xl inline-flex items-center font-semibold rounded-full ${userReactions[key as keyof typeof reactions] ? 'bg-blue-700' : ''} text-white hover:bg-blue-700`}>
                {emojiList[key as keyof typeof reactions]} {value}
            </button>
        )
    })

    const unusedReactionsList = Object.entries(reactions).map((reaction, index) => {
        const [key, value] = reaction
        if (value !== 0) return null

        const onClick = async () => {

            if (userReactions[key as keyof typeof reactions]) {
                setUserReactions({...userReactions, [key]: false})
                setReactions({...reactions, [key]: value - 1})

                await fetch('http://localhost:3001/api/reactions', {
                    method: 'POST',
                    credentials: "include",
                    body: JSON.stringify({
                        user_id: props.user_id,
                        commit_id: props.id,
                        reaction_id: Object.keys(reactions).indexOf(key),
                        active: false
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                return
            }

            setUserReactions({...userReactions, [key]: true})
            setReactions({...reactions, [key]: value + 1})

            await fetch('http://localhost:3001/api/reactions', {
                method: 'POST',
                credentials: "include",
                body: JSON.stringify({
                    user_id: props.user_id,
                    commit_id: props.id,
                    reaction_id: Object.keys(reactions).indexOf(key),
                    active: true
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        }

        return (
            <button key={index} onClick={onClick} type="button"
                    className={`${blur} h-12 px-4 text-xl inline-flex items-center font-semibold rounded-full ${userReactions[key as keyof typeof reactions] ? 'bg-blue-700' : ''} text-white hover:bg-blue-700`}>
                {emojiList[key as keyof typeof reactions]}
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


            <div className={'flex flex-row'}>
                <div className={'w-full'}>
                    <h1 className={`${blur} text-xl font-bold text-left mb-1`}>{props.title}</h1>
                    <div className={`${blur} mb-5`}>
                        <p>{props.description}</p>
                    </div>
                </div>
                <div className={'flex flex-row-reverse  '}>
                    <div className={`${blur} pt-12`}>
                        <code className={' text-gray-500 text-mono'}>{props.commit_hash}</code>
                    </div>
                </div>
            </div>


            <div className={`${blur}`}>
                <CodeEditorWindow boilerPlate={props.solution} language={props.language} onChange={() => {
                }} fixedHeight={true} readOnly={true}/>
            </div>

            <div className={'mt-2 flex space-x-4'}>
                {usedReactionsList}
                <div className={`${blur} rounded-full border-2  border-gray-500`}>
                    <button type="button"
                            onClick={() => setSelectEmojiOpen(!selectEmojiOpen)}
                            className={"w-12 h-12 items-center text-xl inline-flex  font-semibold  text-gray-500 hover:border-gray-200 hover:text-gray-200"}>
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
