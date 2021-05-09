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
            if (!im) return setTimeout(callPost, 1000)
            var block = im.split(";");
            var contentType = block[0].split(":")[1];
            var realData = block[1].split(",")[1];
            var blob = b64toBlob(realData, contentType);
            if (!blob) return setTimeout(callPost, 1000)
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
            if (!response || !response.data) return setTimeout(callPost, 1000)
            const data = response.data
            console.log(data)
            setData(data);
            setTimeout(callPost, 1000)
        }
        callPost()
        //setInterval(callPost, 3000)
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
                        {data.categories.map(cls => <p>{niceLabels(cls)}</p>)}
                    </>
                    :
                    <p>Data will appear shorlty...</p>
                }

            </div>
        </>
    )
}

export default App;

function niceLabels(cls) {
    if (cls.charAt(0) === 'a') {
        switch (cls) {
            case 'a00': return 'Unknown'
            case 'a01': return 'PET - polyethylene terephthalate'
            case 'a02': return 'PE-HD - high-density polyethylene'
            case 'a03': return 'PVC - polyvinyl chloride'
            case 'a04': return 'PE-LD - low-density polyethylene'
            case 'a05': return 'PP - polypropylene'
            case 'a06': return 'PS - polystyrene'
            case 'ao7': return 'Other'
            default: return 'Unknown'
        }
    }
}

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