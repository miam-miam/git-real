import Link from "next/link";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Countdown} from "@/app/components/Countdown";


export default function StartPage() {

    const lastGitRealTime = Date.now() - 3 * 60 * 60 * 1000; // TODO replace with api call
    const happeningNow = true;

    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-UK')

    timeAgo.format(lastGitRealTime)

    if (happeningNow) {

        return (
            <div className="max-w-7xl relative flex place-items-center">
                <div className="w-5xl flex flex-col justify-center">
                    <h1 className="text-9xl font-bold mb-10 text-center">
                        It's GitReal time!
                    </h1>
                    <h3 className="text-2xl font-bold mb-10 text-center">
                        <Countdown timeLeft={300}/>
                    </h3>
                    <div className='grid place-items-center'>
                        <Link href={'editor'}>
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
                    Last GitReal was {timeAgo.format(lastGitRealTime)}
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
