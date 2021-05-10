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
            console.log(response)
            if (!response || !response.data) return setTimeout(callPost, 1000)
            const data = response.data
            console.log(JSON.stringify(data))
            setData(data);
            setTimeout(callPost, 1000)
        }
        callPost()
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
                    videoConstraints={videoConstraints}
                    style={{width:'100%', position:'relative'}}
                />
            </div>
            {data ?
                <div className='predictionArea'>
                    {Object.keys(data.categories).map(cls => niceLabels(cls, data.categories[cls]))}
                </div>
                :
                <p>Data will appear shorlty...</p>}
        </>
    )
}

export default App;

/**
 * 
 * @param {String} cls 
 * @param {Number} prob 
 * @returns {JSX}
 */
function niceLabels(cls, prob) {
    let str = ''
    if (cls.length > 3) str = `Similar To: ${toTitleCase(cls.replace('_', ' '))}`
    if (cls.charAt(0) === `a`) {
        switch (cls.slice(-1)) {
            case `0`: str = `Plastic Type: Unknown (0),`; break;
            case `1`: str = `Plastic Type: PET - polyethylene terephthalate (1)`; break;
            case `2`: str = `Plastic Type: PE-HD - high-density polyethylene (2)`; break;
            case `3`: str = `Plastic Type: PVC - polyvinyl chloride (3)`; break;
            case `4`: str = `Plastic Type: PE-LD - low-density polyethylene (4)`; break;
            case `5`: str = `Plastic Type: PP - polypropylene (5)`; break;
            case `6`: str = `Plastic Type: PS - polystyrene (6)`; break;
            case `7`: str = `Plastic Type: Other (7)`; break;
            default: str = `Plastic Type: Unknown`; break;
        }
    }
    if (cls.charAt(0) === `d`) {
        switch (cls) {
            case `d0`: str = `Deformation: None`; break;
            case `d1`: str = `Deformation: Small Amounts`; break;
            case `d2`: str = `Deformation: Medium Amounts`; break;
            case `d3`: str = `Deformation: Large Amounts`; break;
            default: str = `Deformation: Unknown`; break;
        }
    }
    if (cls.charAt(0) === `e`) {
        switch (cls) {
            case `e0`: str = `Cleanliness: Clean`; break;
            case `e1`: str = `Cleanliness: Small Dirt`; break;
            case `e2`: str = `Cleanliness: Medium Dirt`; break;
            case `e3`: str = `Cleanliness: High Dirt`; break;
            default: str = `Cleanliness: Unknown`; break;
        }
    }
    if (cls.charAt(0) === `f`) {
        switch (cls) {
            case `f0`: str = `Has A Screwing Lid: No`; break;
            case `f1`: str = `Has a Screwing Lid: Yes`; break;
            default: str = `Has a Screwing Lid: Unknown`; break;
        }
    }
    return (
        <div style={{ background: `linear-gradient(90deg, ${'#8730d9'} 0%, ${blendColors('#8730d9', '#000000', .5)} ${(prob * 100).toFixed(5)}%, #000000 100%)`, margin: '1%', padding: '1rem', borderRadius: '3px' }}>
            <p>{`Confidence: ${(prob * 100).toFixed(5)}%, ` + str}</p>
        </div>
    )
}

const videoConstraints = {
    facingMode: { exact: "environment" }
  };

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

function blendColors(colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
}