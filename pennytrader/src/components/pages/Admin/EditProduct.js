import React, {useEffect, useState} from 'react';
import qs from "qs";
import axios from "axios"
import {useHistory} from "react-router-dom"
import {connect} from "react-redux"
import {setToast} from "../../../actions/actions"

import Webcam from "react-webcam";

function EditProduct(props) {

    const [error, setError] = useState("");
    const [name, setName] = useState(qs.parse(props.location.search, { ignoreQueryPrefix: true }).name);
    const [image, setImage] = useState(qs.parse(props.location.search, { ignoreQueryPrefix: true }).front_image_name);
    const [year, setYear] = useState(qs.parse(props.location.search, { ignoreQueryPrefix: true }).year);
    const [price, setPrice] = useState(qs.parse(props.location.search, { ignoreQueryPrefix: true }).price/100);
    const [description, setDescription] = useState(qs.parse(props.location.search, { ignoreQueryPrefix: true }).description);
    const [status, setStatus] = useState(parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).status));//0 = unlisted, 1 = listed, 2 = sold
    const [rating, setRating] = useState(parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).rating));
    const [manufacturer, setManufacturer] = useState(parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).manufacturer));
    
    //for the server
    const [imageBlob, setImageBlob] = useState("");
    //for preview in browser
    const [imageBase64, setImageBase64] = useState("");

    const [imageRef, setImageRef] = useState();

    let imageInput = React.createRef();
    let webcam = React.createRef();

    useEffect(() => {
        setImageRef(imageInput.current)
    }, [imageInput.current])

    //req.body.data format:
    // {
    //     name: "name",
    //     image_name: "image name",
    //     year: 1990,
    //     price: 10000,
    //     description: "desc"
    // }

    const history = useHistory();

    console.log("Status " + status)

    return (
        <div id="edit-product" className="page-height page-padding">

            <h1 className="page-title">Edit Coin</h1>

            <form id="login-form" name="login" method="POST" enctype="multipart/form-data">
                {/* <input type="file" name="imageName" placeholder="Coin Image" className="add-coin-form-input" id="add-coin-form-image" onChange={(e) => { setImageName(e.target.value) }}></input> */}
                <p className="coin-input-title">Image</p>
                <Webcam audio={false} screenshotFormat="image/png" screenshotQuality={1} videoConstraints={{width: 720, height: 720, facingMode: "environment"}} ref={webcam} />
                <img src={imageBase64}></img>
                <button onClick={(e) => {
                    e.preventDefault();

                    //convert base64 data from react-webcam to a Blob so it can be uploaded to server

                    function base64toBlob(base64Data, contentType) {
                        contentType = contentType || '';
                        var sliceSize = 1024;
                        var byteCharacters = atob(base64Data);
                        var bytesLength = byteCharacters.length;
                        var slicesCount = Math.ceil(bytesLength / sliceSize);
                        var byteArrays = new Array(slicesCount);
                    
                        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                            var begin = sliceIndex * sliceSize;
                            var end = Math.min(begin + sliceSize, bytesLength);
                    
                            var bytes = new Array(end - begin);
                            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                                bytes[i] = byteCharacters[offset].charCodeAt(0);
                            }
                            byteArrays[sliceIndex] = new Uint8Array(bytes);
                        }
                        return new Blob(byteArrays, { type: contentType });
                    };
                    
                    setImageBase64(webcam.current.getScreenshot({width: 720, height: 720}));
                    setImageBlob(base64toBlob(webcam.current.getScreenshot({width: 720, height: 720}).split(",")[1], "image/png"));
                }}>Take Image (or don't to keep old image)</button>

                <p className="coin-input-title">Name</p>
                <input type="text" value={name} name="name" placeholder="Coin Name" className="add-coin-form-input" id="add-coin-form-name" onChange={(e) => { setName(e.target.value) }}></input>
                <p className="coin-input-title">Year</p>
                <input type="number" value={year} defaultValue={19} name="year" placeholder="Year of coin" className="add-coin-form-input" id="add-coin-form-year" onChange={(e) => { setYear(e.target.value) }}></input>
                <p className="coin-input-title">Price</p>
                <input type="number" value={price} name="price" placeholder="Price of coin in dollars (e.g. 3.25)" className="add-coin-form-input" id="add-coin-form-price" onChange={(e) => { setPrice(e.target.value) }}></input>
                <p className="coin-input-title">Description</p>
                <input type="text" value={description} name="description" placeholder="Description of coin" className="add-coin-form-input" id="add-coin-form-description" onChange={(e) => { setDescription(e.target.value) }}></input>

                <p className="coin-input-title">Manufacturer</p>
                <label>
                    P
                    <input type="checkbox" name="p" checked={manufacturer === 0} onChange={() => { setManufacturer(0) }} /><br/>
                </label>
                <label>
                    S
                    <input type="checkbox" name="s" checked={manufacturer === 1} onChange={() => { setManufacturer(1) }} /><br/>
                </label>
                <label>
                    D
                    <input type="checkbox" name="d" checked={manufacturer === 2} onChange={() => { setManufacturer(2) }} /><br/>
                </label>

                <p className="coin-input-title">Rating</p>
                <label>
                    Poor
                    <input type="checkbox" name="poor" checked={rating === 0} onChange={() => { setRating(0) }} /><br/>
                </label>
                <label>
                    Average
                    <input type="checkbox" name="average" checked={rating === 1} onChange={() => { setRating(1) }} /><br/>
                </label>
                <label>
                    Great
                    <input type="checkbox" name="great" checked={rating === 2} onChange={() => { setRating(2) }} /><br/>
                </label>
                <label>
                    Excellent
                    <input type="checkbox" name="excellent" checked={rating === 3} onChange={() => { setRating(3) }} />
                </label>
                
                <p className="coin-input-title">Status</p>
                <label>
                    Listed
                    <input type="checkbox" name="listed" checked={status === 1} onChange={() => { setStatus(1) }} /><br/>
                </label>
                <label>
                    Unlisted
                    <input type="checkbox" name="unlisted" checked={status === 0} onChange={() => { setStatus(0) }} /><br/>
                </label>
                <label>
                    Sold
                    <input type="checkbox" name="sold" checked={status === 2} onChange={() => { setStatus(2) }} /><br/>
                </label>

                <button type="submit" onClick={(e) => {
                    e.preventDefault();
                    let formData = new FormData();
                    formData.append('id', qs.parse(props.location.search, { ignoreQueryPrefix: true }).id);
                    formData.append('front', imageBlob);
                    formData.append('name', name);
                    formData.append('year', year);
                    formData.append('price', price);
                    formData.append('description', description);
                    formData.append('status', status);
                    formData.append('rating', rating);
                    formData.append('manufacturer', manufacturer);
                    formData.append('front_image_name', image);

                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data',
                            'x-access-token': localStorage.getItem("token")
                        }
                    };

                    axios.post(`${process.env.REACT_APP_API_URL}admin/edit`, formData, config)
                    .then(function (response) {
                        props.setToast("Edited product");
                        history.push("/admin/viewproducts");
                    })
                    .catch(function (error) {
                        // console.log(error.response)
                        setError(error.response.data.message);
                    })
                }} id="login-form-submit-button">Submit</button>
            </form>
            <p>{error}</p>
        </div>
    );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setToast })(EditProduct);