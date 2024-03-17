"use client";

import {useEffect, useState} from "react";

export const Countdown = ({ textSize }: { textSize: string }) => {

    const timeLeft = 300;

    const [counter, setCounter] = useState(timeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            if (counter === 0) {
                clearInterval(timer);
                return;
            }
            setCounter(counter - 1)
        }, 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;

    if (counter <= 0) {
        return <h3 className={`${textSize} font-mono`}>00:00</h3>
    }

    return <h3 className={`${textSize} font-bold font-mono`}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h3>
}
