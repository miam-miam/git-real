"use client";

import {useEffect, useState} from "react";

export const Countdown = ({ timeLeft }: { timeLeft: number }) => {
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
        return <h3 className='text-4xl'>00:00</h3>
    }

    return <h3 className='text-4xl'>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h3>
}
