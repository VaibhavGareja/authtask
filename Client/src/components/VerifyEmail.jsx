import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const nevigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:3000/verify/${token}`);
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };
    verifyEmail();
  }, [token]);

  const handleLogin = () => {
    nevigate("/login");
  };
  return (
    <div>
      <center>
        <h1>Welcome to Verify Page </h1>
        <p>Email Verification successful</p>
        <button className="VBbtn" onClick={handleLogin}>
          Login
        </button>
      </center>
    </div>
  );
};

export default VerifyEmail;
