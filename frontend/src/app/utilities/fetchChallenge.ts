export interface IChallenge {
    id: number,
    title: string,
    description: string,
    example_input: string,
    example_output: string,
    boilerplate: {
        python: string,
        typescript: string,
        rust: string,
    },
    default_language: string,
    date_released: string,
    deadline: string,
}


export const fetchChallenge = async (): Promise<IChallenge | null> => {
    const res = await fetch('http://localhost:3001/api/challenge', {
        method: 'GET',
        credentials: "include"
    })

    if (!res.ok) {
        console.error("res challenge", res.status, res.statusText)

    }

    let data: IChallenge;

    if (res.ok) {
        data = await res.json()
        return data;
    }

    return null;
}
