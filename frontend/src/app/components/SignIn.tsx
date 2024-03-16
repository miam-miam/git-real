"use client";

import Image from "next/image";

export const SignIn = () => {

    const signIn = async () => {
        const res = await fetch('/api/auth/signin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log(data);
    }

    return (
        <button type="button"
                onClick={() => signIn()}
                className="py-3 px-4 hover:invert inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-50 text-black hover:bg-gray-200">
            <Image
                src={"/github-mark.svg"}
                alt={"GitHub Mark"}
                width={20}
                height={20}
            />
            Sign in with Github
        </button>
    );
}
