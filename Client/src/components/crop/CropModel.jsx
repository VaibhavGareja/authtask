/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import ReactCropper from "react-cropper";
import "cropperjs/dist/cropper.css";
const baseURL = "http://localhost:3000";
import axios from "axios";

const CropModel = ({ closeModal, token, fetchUserData }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleCrop = async () => {
    if (!cropperRef.current || !cropperRef.current.cropper) return;

    try {
      console.log("Cropping image...");
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImageDataUrl = croppedCanvas.toDataURL();
        setCroppedImage(croppedImageDataUrl);
      } else {
        console.error("Failed to get cropped canvas.");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked"); // Add this line for debugging
    if (!croppedImage) {
      console.error("Cropped image is not set");
      return;
    }
    try {
      console.log("click save");
      const blob = await fetch(croppedImage).then((res) => res.blob());
      console.log(blob);
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${baseURL}/upload-photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUserData();
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="crop-container">
      <label className="choose-file">
        <span>Choose profile photo</span>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <div className="displayImg">
        {image && (
          <div className="crop-wrapper">
            <ReactCropper
              ref={cropperRef}
              src={image}
              aspectRatio={1}
              cropShape="round"
            />
            <button onClick={handleCrop}>Crop</button>
          </div>
        )}

        {croppedImage && (
          <div className="cropped-image-container">
            <h3>Cropped Image:</h3>
            <img src={croppedImage} alt="Cropped image" />
            <button onClick={handleSave}>save</button>
          </div>
        )}
      </div>

      <button className="close " onClick={closeModal}>
        X
      </button>
    </div>
  );
};

export default CropModel;
