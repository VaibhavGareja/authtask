import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import PasswordReset from "./PasswordReset";
import { UploadButton } from "@bytescale/upload-widget-react";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const token = useSelector((state) => state.auth.token);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
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
          "http://localhost:3000/reset-password",
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
        // Passwords don't match, show error

        setResetSuccess(false);
        setResetError(["New password and confirm password do not match"]);
      }
    } catch (error) {
      console.error("Error resetting password:", error.response.data.message);
      setResetSuccess(false);
      setResetError(error.response.data.message);
    }
  };

  const handlePhotoUpload = async (files) => {
    try {
      const fileUrl = files[0].fileUrl; // Assuming you're uploading only one photo
      await axios.post(
        "http://localhost:3000/upload-photo",
        { fileUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserData(); // Refresh user data after photo upload
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };
  return (
    <div className="dashboard">
      <div className="sidebar">
        {userData && (
          <>
            {userData.photo === null ? (
              <img src="/profile.png" className="profile-image" alt="photo" />
            ) : (
              <img
                src={userData.photo}
                alt="Profile"
                className="profile-image"
              />
            )}
            <UploadButton
              options={{ apiKey: "free", maxFileCount: 1 }}
              onComplete={handlePhotoUpload}
            >
              {({ onClick }) => (
                <span
                  className="material-symbols-rounded add_photo"
                  onClick={onClick}
                >
                  add_a_photo
                </span>
              )}
            </UploadButton>

            <button onClick={toggleResetForm}>Reset Password</button>
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
