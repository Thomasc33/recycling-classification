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
            //Image Logic
            let im = webcamRef.current.getScreenshot()
            let formData = new FormData()
            if (!im) return setTimeout(callPost, 1000)
            var block = im.split(";");
            var contentType = block[0].split(":")[1];
            var realData = block[1].split(",")[1];
            var blob = b64toBlob(realData, contentType);
            if (!blob) return setTimeout(callPost, 1000)
            formData.append('image', blob)

            //Model selection
            let choice = document.getElementById('model')
            console.log(choice.value)
            formData.append('model', choice.value)

            //Post
            const response = await axios({
                method: 'post',
                url: 'https://mc.bluebounty.tech:9000/predict',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                data: formData
            }).catch(er => {
                console.log('error: ', er)
            })

            //return data
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
            <label>Choose a model: </label>
            <select className='modelSelect' id='model'>
                <option value='wadaba'>WaDaBA</option>
                <option value='duckduckgo'>DuckDuckGo</option>
            </select>
            <PageTemplate highLight="0" />
            <div className='Camera'>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />
                {data ?
                    <> {data.categories.map(cls => <p>{niceLabels(cls)}</p>)} </>
                    :
                    <p>Data will appear shorlty...</p>}
            </div>
        </>
    )
}

export default App;

function niceLabels(cls) {
    if (cls.charAt(0) === 'a') {
        switch (cls) {
            case 'a00': return 'Plastic Type: Unknown (0)'
            case 'a01': return 'Plastic Type: PET - polyethylene terephthalate (1)'
            case 'a02': return 'Plastic Type: PE-HD - high-density polyethylene (2)'
            case 'a03': return 'Plastic Type: PVC - polyvinyl chloride (3)'
            case 'a04': return 'Plastic Type: PE-LD - low-density polyethylene (4)'
            case 'a05': return 'Plastic Type: PP - polypropylene (5)'
            case 'a06': return 'Plastic Type: PS - polystyrene (6)'
            case 'a07': return 'Plastic Type: Other (7)'
            default: return 'Plastic Type: Unknown'
        }
    }
    if (cls.charAt(0) === 'd') {
        switch (cls) {
            case 'd0': return 'Deformation: None'
            case 'd1': return 'Deformation: Small Amounts'
            case 'd2': return 'Deformation: Medium Amounts'
            case 'd3': return 'Deformation: Large Amounts'
            default: return 'Deformation: Unknown'
        }
    }
    if (cls.charAt(0) === 'e') {
        switch (cls) {
            case 'e0': return 'Cleanliness: Clean'
            case 'e1': return 'Cleanliness: Small Dirt'
            case 'e2': return 'Cleanliness: Medium Dirt'
            case 'e3': return 'Cleanliness: High Dirt'
            default: return 'Cleanliness: Unknown'
        }
    }
    if (cls.charAt(0) === 'f') {
        switch (cls) {
            case 'f0': return 'Has A Screwing Lid: No'
            case 'f1': return 'Has a Screwing Lid: Yes'
            default: return 'Has a Screwing Lid: Unknown'
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