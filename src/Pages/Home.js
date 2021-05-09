import { useState, useRef, useEffect } from 'react'
import PageTemplate from './Template'
import Webcam from 'react-webcam'
import axios from 'axios'
import FormData from 'form-data'
import '../css/Home.css';

function App() {
    const webcamRef = useRef(null);
    const [data, setData] = useState(null)

    useEffect(() => {
        async function callPost() {
            let im = webcamRef.current.getScreenshot()
            let formData = new FormData()
            if (!im) return
            var block = im.split(";");
            var contentType = block[0].split(":")[1];
            var realData = block[1].split(",")[1];
            var blob = b64toBlob(realData, contentType);
            if (!blob) return
            formData.append('image', blob)
            const response = await axios({
                method: 'post',
                url: 'http://a.bluebounty.tech:9000/predict',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                data: formData
            }).catch(er => {
                console.log('error: ', er)
            })
            if (!response || !response.data) return console.log('no data')
            const data = response.data
            console.log(data)
            setData(data);
        }
        setInterval(callPost, 3000)
    }, [])
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


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}