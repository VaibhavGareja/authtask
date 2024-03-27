import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signupUser } from "../store/authSlice";
import FormikController from "./form/FormikController";

const initialValues = {
  Fname: "",
  Lname: "",
  email: "",
  phoneno: "",
  DOB: "",
  password: "",
};

const SignUp = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignUpSchema = Yup.object({
    Fname: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(25, "First name must be at most 25 characters")
      .required("Please enter your first name"),
    Lname: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(25, "Last name must be at most 25 characters")
      .required("Please enter your last name"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email address"),
    phoneno: Yup.string()
      .min(10, "Phone number must be exactly 10 digits ")
      .max(10, "Phone number must be exactly 10 digits ")
      .required("Please enter the number"),
    DOB: Yup.date()
      .required("Date of Birth is required")
      .max(new Date("2009-01-01"), "You must be at least 15 years old")
      .min(new Date("1974-01-01"), "You are too old to sign up"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Please enter your password"),
  });

  const [isSignedUp, setIsSignedUp] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");

  const onSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/signup", values);

      if (response.status === 200) {
        setSignupMessage(
          "Thank you for signing up! An email verification link has been sent to your email address."
        );
        setIsSignedUp(true);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      {!isSignedUp ? (
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={onSubmit}
        >
          {(formikProps) => (
            <Form className="form">
              <h1>Registration Form</h1>
              <FormikController
                control="input"
                type="text"
                label="First Name"
                placeholder="Enter the First Name "
                name="Fname"
                formikProps={formikProps}
              />
              <FormikController
                control="input"
                type="text"
                label="Last Name"
                name="Lname"
                placeholder="Enter the Last Name "
                formikProps={formikProps}
              />
              <FormikController
                control="input"
                type="email"
                label="Email"
                name="email"
                placeholder="Enter the Email "
                formikProps={formikProps}
              />
              <FormikController
                control="input"
                type="number"
                label="Phone Number"
                name="phoneno"
                placeholder="Enter the Phone no "
                formikProps={formikProps}
              />
              <FormikController
                control="date"
                type="date"
                label="DOB"
                name="DOB"
                placeholder="Enter the DOB "
                formikProps={formikProps}
              />

              {/* <FormikController
                control="input"
                label="Date of Birth"
                name="DOB"
                onkeydown="return false"
                formikProps={formikProps}
              /> */}
              <FormikController
                control="input"
                type="password"
                label="Password"
                placeholder="Enter the Password"
                name="password"
                formikProps={formikProps}
              />
              <div className="btn">
                <button type="submit">Register</button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="verification-message">
          <p>{signupMessage}</p>
          <button className="SLbtn" onClick={handleLogin}>
            Continue to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
