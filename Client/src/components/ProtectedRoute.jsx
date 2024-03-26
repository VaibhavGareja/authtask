/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
  
    useEffect(() => {

      if (!token) {
        navigate("/login");
      }
    }, []); 
  
    
    return element;
  };
  
  export default ProtectedRoute
