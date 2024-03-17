"use client";

import Link from "next/link";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Countdown} from "@/app/components/Countdown";
import {Post} from "@/app/components/Post";
import {ICommit} from "@/app/challenge/page";
import {useEffect, useState} from "react";
import {fetchChallenge} from "@/app/utilities/fetchChallenge";
import {IProfile} from "@/app/components/Profile";


export default function StartPage() {





    const [userData, setUserData] = useState<IProfile>()
    const [postData, setPostData] = useState<ICommit[]>()

    useEffect(() => {
        fetch('http://localhost:3001/api/commits', {
            method: 'GET',
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setPostData(data || undefined))
            .catch((err) => console.error(err))

        fetch('http://localhost:3001/api/me', {
            method: 'GET',
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setUserData(data || undefined))
            .catch((err) => console.error(err))
    }, []);


    if (postData === undefined || userData === undefined) {
        return <div>Loading...</div>;
    }

    const lockedPosts = postData.map((post) => ({...post, locked: !userData.completed_correctly,
        reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 29,
            },
            user_reactions: {
                heart: true,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }

    }));

    const allPosts = lockedPosts.map((post, index) => {
        return (
            <Post props={post} locked={post.locked} key={index}/>
        )
    })


    return (
        <div className="relative flex place-items-center mt-20">
            <div className="flex flex-col">
                {allPosts}
            </div>
        </div>
    );
}
