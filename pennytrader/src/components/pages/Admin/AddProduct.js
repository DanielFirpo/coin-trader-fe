import React, { useState, useEffect } from "react";
import { setToast } from "../../../actions/actions";
import { connect } from "react-redux";
import axios from "axios";
import Webcam from "react-webcam";

function AddProduct(props) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  //for the server
  const [frontImageBlob, setFrontImageBlob] = useState("");
  //for preview in browser
  const [frontImageBase64, setFrontImageBase64] = useState("");

  //for the server
  const [backImageBlob, setBackImageBlob] = useState("");
  //for preview in browser
  const [backImageBase64, setBackImageBase64] = useState("");

  const [camara, setCamara] = useState(true); //camara facing
  const [year, setYear] = useState(19);
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1); //0 = unlisted, 1 = listed, 2 = sold
  const [rating, setRating] = useState(1);
  const [manufacturer, setManufacturer] = useState(0);

  const [imageRef, setImageRef] = useState();

  const [size, setSize] = useState(720);

  let imageInput = React.createRef();
  let webcam = React.createRef();

  useEffect(() => {
    setImageRef(imageInput.current);
  }, [imageInput.current]);

  //req.body.data format:
  // {
  //     name: "name",
  //     image_name: "image name",
  //     year: 1990,
  //     price: 10000,
  //     description: "desc"
  // }

  function clearForm() {
    if (isNaN(parseInt(name))) {
      setName("");
    } else {
      setName(incrementName(name));
    }
    setYear(19);
    setPrice("");
    setDescription("");
    // imageRef.value = "";
  }

  //add 1 to the name but preserve leading 0s: 000321 --> 000322
  function incrementName(str) {
    let zeros = "";
    let done = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] == "0" && !done && i != str.length - 1) {
        zeros += "0";
      } else {
        done = true;
      }
    }
    return zeros + (parseInt(str.substring(zeros.length - 1)) + 1).toString();
  }

  //convert base64 data from react-webcam to a Blob so it can be uploaded to server

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || "";
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
  }

  return (
    <div id="add-product" className="page-height page-padding">
      <h1 className="page-title">Add Coin</h1>

      <form
        id="add-product-form"
        name="login"
        method="POST"
        encType="multipart/form-data"
      >
        {/* <input type="file" name="imageName" placeholder="Coin Image" className="add-coin-form-input" id="add-coin-form-image" onChange={(e) => { setImageName(e.target.value) }}></input> */}
        <p className="coin-input-title">Image (optional)</p>
        <Webcam
          audio={false}
          screenshotFormat="image/png"
          screenshotQuality={1}
          videoConstraints={{width: 720, height: 720, facingMode: "environment"}}
          height={720}
          width={720}
          ref={webcam}
        />
        {/* 720x720 */}
        <br></br>
        <button
          onClick={(e) => {
            e.preventDefault();

            setFrontImageBase64(
              webcam.current.getScreenshot({ height: 720, width: 720 })
            );
            setFrontImageBlob(
              base64toBlob(
                webcam.current
                  .getScreenshot({ height: 720, width: 720 })
                  .split(",")[1],
                "image/png"
              )
            );
          }}
        >
          Take Front Image
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();

            setBackImageBase64(
              webcam.current.getScreenshot({ height: 720, width: 720 })
            );
            setBackImageBlob(
              base64toBlob(
                webcam.current
                  .getScreenshot({ height: 720, width: 720 })
                  .split(",")[1],
                "image/png"
              )
            );
          }}
        >
          Take Back Image
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setCamara(!camara);
          }}
        >
          Switch Camara (current: {camara ? "user" : "environment"})
        </button>
        {/* <input type="number" value={size} name="size" placeholder="Image Size" className="add-coin-form-input" id="add-coin-form-price" onChange={(e) => { setSize(e.target.value) }}></input> */}

        <p className="coin-input-title">Front Image</p>
        <img src={frontImageBase64}></img>
        <p className="coin-input-title">Back Image</p>
        <img src={backImageBase64}></img>
        {/* <input type="file" ref={imageInput} name="file" onChange={(e) => { console.log(e.target.files[0]); console.log(webcam.current.getScreenshot()); setImage(e.target.files[0]);}}/> */}
        <p className="coin-input-title">Name</p>
        <input
          type="text"
          value={name}
          name="name"
          placeholder="Coin Name"
          className="add-coin-form-input"
          id="add-coin-form-name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <p className="coin-input-title">Year</p>
        <input
          type="number"
          value={year}
          name="year"
          placeholder="Year of coin"
          className="add-coin-form-input"
          id="add-coin-form-year"
          onChange={(e) => {
            setYear(e.target.value);
          }}
        ></input>
        <p className="coin-input-title">Price</p>
        <input
          type="number"
          value={price}
          name="price"
          placeholder="Price of coin in dollars (e.g. 3.25)"
          className="add-coin-form-input"
          id="add-coin-form-price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        ></input>
        <p className="coin-input-title">Description (optional)</p>
        <input
          type="text"
          value={description}
          name="description"
          placeholder="Description of coin"
          className="add-coin-form-input"
          id="add-coin-form-description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        ></input>

        <p className="coin-input-title">Manufacturer</p>
        <label>
          P
          <input
            type="checkbox"
            name="p"
            checked={manufacturer === 0}
            onChange={() => {
              setManufacturer(0);
            }}
          />
          <br />
        </label>
        <label>
          S
          <input
            type="checkbox"
            name="s"
            checked={manufacturer === 1}
            onChange={() => {
              setManufacturer(1);
            }}
          />
          <br />
        </label>
        <label>
          D
          <input
            type="checkbox"
            name="d"
            checked={manufacturer === 2}
            onChange={() => {
              setManufacturer(2);
            }}
          />
          <br />
        </label>

        <p className="coin-input-title">Rating</p>
        <label>
          Poor
          <input
            type="checkbox"
            name="poor"
            checked={rating === 0}
            onChange={() => {
              setRating(0);
            }}
          />
          <br />
        </label>
        <label>
          Average
          <input
            type="checkbox"
            name="average"
            checked={rating === 1}
            onChange={() => {
              setRating(1);
            }}
          />
          <br />
        </label>
        <label>
          Great
          <input
            type="checkbox"
            name="great"
            checked={rating === 2}
            onChange={() => {
              setRating(2);
            }}
          />
          <br />
        </label>
        <label>
          Excellent
          <input
            type="checkbox"
            name="excellent"
            checked={rating === 3}
            onChange={() => {
              setRating(3);
            }}
          />
        </label>

        <p className="coin-input-title">Status</p>
        <label>
          Listed
          <input
            type="checkbox"
            name="listed"
            checked={status === 1}
            onChange={() => {
              setStatus(1);
            }}
          />
          <br />
        </label>
        <label>
          Unlisted
          <input
            type="checkbox"
            name="unlisted"
            checked={status === 0}
            onChange={() => {
              setStatus(0);
            }}
          />
          <br />
        </label>
        <label>
          Sold
          <input
            type="checkbox"
            name="sold"
            checked={status === 2}
            onChange={() => {
              setStatus(2);
            }}
          />
          <br />
        </label>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();

            const config = {
              headers: {
                "content-type": "multipart/form-data",
                "x-access-token": localStorage.getItem("token"),
              },
            };

            let formData1 = new FormData();
            formData1.append("front", frontImageBlob);
            formData1.append("back", backImageBlob);
            formData1.append("name", name);
            formData1.append("year", year);
            formData1.append("price", price);
            formData1.append("description", description);
            formData1.append("status", status);
            formData1.append("rating", rating);
            formData1.append("manufacturer", manufacturer);

            axios
              .post(
                `${process.env.REACT_APP_API_URL}admin/add`,
                formData1,
                config
              )
              .then(function () {
                console.log("SUCCESS");

                clearForm();
                props.setToast("Successfully Added Product")
              })
              .catch(function (error) {
                console.log(error.response);
                setError("Error! Check fields");
              });
          }}
          id="add-coin-form-submit-button"
        >
          Submit
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setToast })(AddProduct);
