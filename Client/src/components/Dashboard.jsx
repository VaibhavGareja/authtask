import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import PasswordReset from "./PasswordReset";
import CropModel from "./crop/CropModel";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const fileInputRef = useRef(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const token = useSelector((state) => state.auth.token);
  const baseURL = "http://localhost:3000";

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
  };

  const handlePasswordReset = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }) => {
    try {
      console.log("Reset Password Form Data:", {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      if (newPassword === confirmPassword) {
        await axios.post(
          `${baseURL}/reset-password`,
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResetSuccess(true);
        setShowResetForm(false);
        setResetError("");
      } else {
        setResetSuccess(false);
        setResetError(["New password and confirm password do not match"]);
      }
    } catch (error) {
      console.error("Error resetting password:", error.response.data.message);
      setResetSuccess(false);
      setResetError(error.response.data.message);
    }
  };

  const handleModel = () => {
    setModalOpen(true);
    console.log("clicked...");
  };
  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  // const handleUploadClick = async () => {
  //   if (selectedFile) {
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", selectedFile);

  //       await axios.post(`${baseURL}/upload-photo`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setSelectedFile(null);
  //       fetchUserData();
  //       console.log("File uploaded successfully!");
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //     }
  //   } else {
  //     console.error("No file selected.");
  //   }
  // };

  return (
    <div className="dashboard">
      {modalOpen && (
        <CropModel
          // updateAvatar={updateAvatar}
          fetchUserData={fetchUserData}
          token={token}
          closeModal={() => setModalOpen(false)}
        />
      )}
      <div className="sidebar">
        {userData && (
          <>
            {userData.photo !== null ? (
              <img
                src={`${baseURL}/${userData.photo}`}
                className="profile-image"
                alt="photo"
              />
            ) : (
              <img src="/profile.png" className="profile-image" alt="photo" />
            )}

            {/* <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <span
              className="material-symbols-outlined upload-img"
              onClick={() => fileInputRef.current.click()}
            >
              add_a_photo
            </span> */}
            <span
              className="material-symbols-outlined upload-img"
              onClick={handleModel}
            >
              add_a_photo
            </span>

            {/* <button className="left-btn" onClick={handleUploadClick}>
              Upload
            </button> */}
            <button className="left-btn" onClick={toggleResetForm}>
              Reset Password
            </button>
            {showResetForm && <PasswordReset onSubmit={handlePasswordReset} />}
            {resetSuccess && <p>Password reset successful!</p>}

            {resetError && <p className="error">{resetError}</p>}
          </>
        )}
      </div>
      <div className="right">
        <h2>User Information</h2>
        {userData ? (
          <div>
            <p>
              <strong>ID:</strong> {userData.id}
            </p>
            <p>
              <strong>First Name:</strong> {userData.Fname}
            </p>
            <p>
              <strong>Last Name:</strong> {userData.Lname}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone no:</strong> {userData.phoneno}
            </p>
            <p>
              <strong>Verification Status:</strong>{" "}
              {userData.isVerify ? "Verified" : "Not Verified"}
            </p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
