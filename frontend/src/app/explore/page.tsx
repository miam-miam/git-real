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
        return null;
    }

    const lockedPosts = postData.map((post) => ({...post, locked: !userData.done_recent}));

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
