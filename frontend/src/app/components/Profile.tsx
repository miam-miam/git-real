"use client";

import Image from "next/image";
import {SignIn} from "@/app/components/SignIn";
import {useEffect, useState} from "react";
import Link from "next/link";

export const Profile = () => {


    const [data, setData] = useState<{ profile_picture: string, username: string }>({profile_picture: "", username: ""})
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3001/api/me')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])


    if (!data) {
        return null
    }

    return data.profile_picture ? (
        <Link href={'/account'}>
            <Image
                src={data.profile_picture}
                alt="GitReal Logo"
                className="w-10 h-10 rounded-full"
                width={400}
                height={400}
                priority
            />
        </Link>
    ) : (
        <SignIn/>
    )
}
