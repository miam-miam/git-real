import type {GetServerSideProps, Metadata} from "next";
import {Inter} from "next/font/google";
import PrelineScript from "./components/PrelineScript"
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import {SignIn} from "@/app/components/SignIn";
import {Profile} from "@/app/components/Profile";
// import {Profile} from "@/app/components/Profile";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "GitReal",
    description: "Time to git real",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {

    // const res = await fetch('http://localhost:3001/api/me', {
    //     method: 'GET',
    // })
    //
    // let data = {profile_picture: "", username: ""}
    // if (res.ok) {
    //     data = await res.json()
    //
    //     console.log(data)
    // }
    //
    // if (res.status !== 200) {
    //     console.log(`Failed with ${res.status} ${res.statusText}`)
    // }

    // console.log(res)


    // const profileEl = data.profile_picture ? (
    //     <Link href={'/account'}>
    //         <Image
    //             src={data.profile_picture}
    //             alt="GitReal Logo"
    //             className="w-10 h-10 rounded-full"
    //             width={400}
    //             height={400}
    //             priority
    //         />
    //     </Link>
    // ) : (
    //     <SignIn/>
    // )

    return (
        <html lang="en">
        <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="max-w-7xl w-full items-center justify-between flex">
                <Link href={'/start'}>
                    <Image
                        src="/logo.svg"
                        alt="GitReal Logo"
                        width={100}
                        height={24}
                        priority
                    />
                </Link>

                <div className={'flex flex-row'}>
                    <div className={'grid place-content-center'}>
                        <Link href={'/start'}>
                            <h1 className="text-xl mr-20">Daily Challenge</h1>
                        </Link>
                    </div>

                    <div className={'grid place-content-center'}>
                        <Link href={'/explore'}>
                            <h1 className="text-xl mr-20">Explore</h1>
                        </Link>
                    </div>
                    <div className={'grid place-content-center'}>
                        {/*{profileEl}*/}
                        <Profile/>
                    </div>


                </div>

            </div>
            {children}
            <div className="grid">
                {/*Footer*/}
            </div>
        </main>
        </body>
        <PrelineScript/>
        </html>
    );
}
