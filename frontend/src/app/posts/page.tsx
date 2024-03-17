import Link from "next/link";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Countdown} from "@/app/components/Countdown";
import {Post} from "@/app/components/Post";


export default function StartPage() {

    const posts = [
        {
            username: "miam-miam100",
            profile_picture: "https://avatars.githubusercontent.com/u/49870539?v=4",
            title: "My first commit",
            description: "I just made",
            language: "python",
            code: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass"
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
            username: "viktaur",
            profile_picture: "https://avatars.githubusercontent.com/u/30535579?v=4",
            title: "My first commit",
            description: "I just made",
            language: "python",
            code: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass"
        }
    ]

    const allPosts = posts.map((post, index) => {
        return (
            <Post props={post} key={index} />
        )
    })


    return (
        <div className="w-1/2 relative flex place-items-center">
            <div className="w-1/2 flex flex-col">
                {allPosts}
            </div>
        </div>
    );
}
