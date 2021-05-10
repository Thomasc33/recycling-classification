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
            }).catch(er => { })

            //return data
            if (!response || !response.data) return setTimeout(callPost, 1000)
            const data = response.data
            console.log(JSON.stringify(data))
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
                <div>
                    <label>Choose a model: </label>
                    <select id='model'>
                        <option value='duckduckgo'>DuckDuckGo</option>
                        <option value='wadaba'>WaDaBA</option>
                    </select>
                </div>
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
    if (cls.length > 3) return `Similar To: ${toTitleCase(cls.replace('_', ' '))}`
    if (cls.charAt(0) === 'a') {
        switch (cls.slice(-1)) {
            case '0': return 'Plastic Type: Unknown (0)'
            case '1': return 'Plastic Type: PET - polyethylene terephthalate (1)'
            case '2': return 'Plastic Type: PE-HD - high-density polyethylene (2)'
            case '3': return 'Plastic Type: PVC - polyvinyl chloride (3)'
            case '4': return 'Plastic Type: PE-LD - low-density polyethylene (4)'
            case '5': return 'Plastic Type: PP - polypropylene (5)'
            case '6': return 'Plastic Type: PS - polystyrene (6)'
            case '7': return 'Plastic Type: Other (7)'
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

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}