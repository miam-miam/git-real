"use client";

import Link from "next/link";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Countdown} from "@/app/components/Countdown";
import {Post} from "@/app/components/Post";
import Image from "next/image";
import {IProfile} from "@/app/components/Profile";
import {useEffect, useState} from "react";


export default function Account() {

    const [userData, setUserData] = useState<IProfile>()
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3001/api/me', {
            method: 'GET',
            credentials: "include"
        })
            .then((res) => res.json())
            .then((userData) => {
                setUserData(userData)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])


    if (!userData) {
        console.log("no data")
        return null
    }

    const posts = [
        {
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};"
        },
        {
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};"
        },
                {
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};"
        },
    ]


    const lockedPosts = posts.map((post) => ({...post, username: undefined, locked: false }));

    const allPosts = lockedPosts.map((post, index) => {
        return (
            <Post props={post} key={index}/>
        )
    })


    return (
        <div className="relative flex place-items-center mt-20">
            <div className="flex flex-row">
                <div className={'m-10'}>
                    {/*<h2 className={'mb-5 text-2xl font-bold'}>Your account</h2>*/}
                    <div className={'mt-10'}>
                        <Image
                            src={userData.avatar_url}
                            alt="GitReal Logo"
                            className="w-24 h-24 rounded-full"
                            width={400}
                            height={400}
                            priority
                        />
                    </div>
                    <div className={'mt-2'}>
                        <Link
                            href={`https://github.com/${userData.username}`}
                        >
                            <h2 className="text-xl font-bold">@{userData.username}</h2>
                        </Link>
                    </div>
                    <Link href={'http://localhost:3001/auth/logout'}>
                        <button type="button"
                                className="mt-5 py-3 px-4 hover:invert inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-50 text-black hover:bg-gray-200">
                            Sign out
                        </button>
                    </Link>
                </div>
                <div className={'flex flex-col ml-24'}>
                    {/*<h2 className={'mb-16 text-2xl font-bold'}>Your posts</h2>*/}
                        {allPosts}
                </div>
            </div>
        </div>
    );
}
