"use client";

import Link from "next/link";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Countdown} from "@/app/components/Countdown";
import {fetchChallenge, IChallenge} from "@/app/utilities/fetchChallenge";
import {useEffect, useState} from "react";

TimeAgo.addDefaultLocale(en)


export default function StartPage() {


    const [data, setData] = useState<IChallenge | null>()

    useEffect(() => {
        const timerId = setInterval(async () => {
            const newData = await fetchChallenge()
            setData(newData);
        }, 2000)
        return () => {
            clearInterval(timerId);
        };
    }, []);


    if (!data) {
        console.log("no challenge data on start")
        return <div>Loading...</div>;
    }


    const now = Date.now();
    const lastGitRealStartTime = new Date(data.date_released).getTime()
    const lastGitRealEndTime = new Date(data.deadline).getTime()

    const happeningNow = lastGitRealStartTime < now && now < lastGitRealEndTime;


    const timeAgo = new TimeAgo('en-UK')

    if (happeningNow) {

        const secondsToDeadline = (lastGitRealEndTime - now) / 1000;

        return (
            <div className="max-w-7xl relative flex place-items-center">
                <div className="w-5xl flex flex-col justify-center">
                    <h1 className="text-9xl font-bold mb-10 text-center">
                        It's GitReal time!
                    </h1>
                    <div className="text-2xl font-bold mb-10 text-center">
                        <Countdown textSize={"text-6xl"} timeLeft={secondsToDeadline}/>
                    </div>
                    <div className='grid place-items-center'>
                        <Link href={'challenge'}>
                            <button type="button"
                                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-100 hover:bg-white hover:text-gray-950">
                                Accept Challenge
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl relative flex place-items-center">
            <div className="w-5xl flex flex-col justify-center">
                <h1 className="text-7xl font-bold mb-10 text-center">
                    GitReal is waiting...
                </h1>
                <h3 className="text-2xl font-bold mb-10 text-center">
                    Last GitReal was {timeAgo.format(lastGitRealEndTime)}
                </h3>
                <div className='grid place-items-center'>
                    <Link href={'editor'}>
                        <button type="button"
                                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-100 hover:bg-white hover:text-gray-950">
                            Previous Challenges
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
