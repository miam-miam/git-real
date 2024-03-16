import Image from "next/image";
import {SignIn} from "@/app/components/SignIn";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="max-w-7xl w-full items-center justify-between flex">
                <Image
                    src="/logo.svg"
                    alt="GitReal Logo"
                    width={100}
                    height={24}
                    priority
                />
            </div>

            <div className="max-w-7xl relative flex place-items-center">
                <div className="w-5xl relative">
                    <div>
                        <h1 className="text-7xl font-bold text-left mb-10">
                            Your daily dose of code.
                        </h1>
                    </div>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-left mb-2">
                            😊 Meaningful commits
                        </h2>
                        <h2 className="text-3xl font-bold text-left mb-2">
                            ⚠️ Spontaneous merges
                        </h2>
                        <h2 className="text-3xl font-bold text-left mb-2">
                            🤳 Authentic pull requests
                        </h2>
                    </div>
                    <div>
                        <h3 className="text-xl text-left mb-10">
                            Everyday get a notification to share a genuine glimpse into your coding life with the people you care most about.
                        </h3>
                    </div>
                    <div>
                        <SignIn />
                    </div>
                </div>
                <div className='w-5xl'>
                    <Image
                        src="/snippet.svg"
                        alt="Vercel Logo"
                        width={1200}
                        height={500}
                        priority
                    />
                </div>
            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">

            </div>
        </main>
    );
}
