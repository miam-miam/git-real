import Link from "next/link";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {Countdown} from "@/app/components/Countdown";
import {Post} from "@/app/components/Post";


export default function StartPage() {

    const posts = [
        {
            id: "tsdf",
            username: "miam-miam100",
            profile_picture: "https://avatars.githubusercontent.com/u/49870539?v=4",
            title: "My first commit",
            description: "I just made",
            language: "python",
            code: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass",
            reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 29,
            },
            user_reactions: {
                heart: true,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }
        },
        {
            id: "tsdf",
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};",
            reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 0,
            },
            user_reactions: {
                heart: false,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }
        },
        {
            id: "tsdf",
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};",
            reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 0,
            },
            user_reactions: {
                heart: false,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }
        },
        {
            id: "tsdf",
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};",
            reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 0,
            },
            user_reactions: {
                heart: false,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }
        },
        {
            id: "tsdf",
            username: "ortovoxx",
            profile_picture: "https://avatars.githubusercontent.com/u/56805259?v=4",
            title: "My first commit",
            description: "Just a test to see a longer message and how it looks like",
            language: "typescript",
            code: "var twoSum = function(nums, target) {\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n//test\n  \n};",
            reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 0,
            },
            user_reactions: {
                heart: false,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }
        },
        {
            id: "tsdf",
            username: "viktaur",
            profile_picture: "https://avatars.githubusercontent.com/u/30535579?v=4",
            title: "My first commit",
            description: "I just made",
            language: "python",
            code: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass",
            reactions: {
                heart: 2,
                rocket: 0,
                thumbsup: 0,
                thumbsdown: 0,
                skull: 0,
                trash: 0,
                tada: 0,
                facepalm: 0,
                nerd: 0,
            },
            user_reactions: {
                heart: false,
                rocket: false,
                thumbsup: false,
                thumbsdown: false,
                skull: false,
                trash: false,
                tada: false,
                facepalm: false,
                nerd: false,
            }

        }
    ]


    const lockedPosts = posts.map((post) => ({...post, locked: false}));

    const allPosts = lockedPosts.map((post, index) => {
        return (
            <Post props={post} key={index}/>
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
