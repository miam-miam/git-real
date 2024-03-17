"use client";

import Image from "next/image";
import Link from "next/link";

export const SignIn = () => {

    return (
        <Link href={'http://localhost:3001/auth/login'}>
            <button type="button"
                    className="py-3 px-4 hover:invert inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-50 text-black hover:bg-gray-200">
                <Image
                    src={"/github-mark.svg"}
                    alt={"GitHub Mark"}
                    width={20}
                    height={20}
                />
                Sign in with Github
            </button>
        </Link>

    );
}
