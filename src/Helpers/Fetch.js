import { useState, useEffect } from 'react';

const useFetch = url => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function callFetch() {
            const response = await fetch(url, {
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const data = await response.json();
            setData(data);
            setLoading(false);
        }
        callFetch()
        setInterval(callFetch, 3000)
    }, [url])

    return { data, loading }
}

export {
    useFetch
}