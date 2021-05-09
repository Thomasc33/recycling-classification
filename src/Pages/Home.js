import { useState, useRef, useEffect } from 'react'
import PageTemplate from './Template'
import Webcam from 'react-webcam'
import axios from 'axios'
import '../css/Home.css';

function App() {
    const webcamRef = useRef(null);
    const [data, setData] = useState(null)

    useEffect(() => {
        async function callPost() {
            let im = webcamRef.current.getScreenshot()
            console.log(im)
            const response = await axios.post('url', { im }, {
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            const data = await response.json();
            setData(data);
        }
        callPost()
        setInterval(callPost, 2500)
    })
    return (
        <>
            <PageTemplate highLight="0" />
            <div className='Camera'>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />
                {data ?
                    <>
                        <p>Plastic Type: {data.type}</p>
                        <p>Deformed: {data.deformed ? 'Yes' : 'No'}</p>
                        <p>Lid On: {data.lid ? 'Yes' : 'No'}</p>
                        <p>Dirty: {data.dirty ? 'Yes' : 'No'}</p>
                    </>
                    :
                    <p>Data will appear shorlty...</p>
                }

            </div>
        </>
    )
}

export default App;
