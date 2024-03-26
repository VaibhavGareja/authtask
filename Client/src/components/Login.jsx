import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ForgotPasswordForm from "./ForgotPasswordForm";
import FormikController from "./form/FormikController";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email address"),
    password: Yup.string().required("Please enter your password"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:3000/login", values);
      const user = response.data.user;
      if (!user.isVerify) {
        alert("Please verify your email before accessing the dashboard.");
        return;
      }

      const loginResponse = await dispatch(loginUser(values));

      if (!loginResponse || loginResponse.payload.status !== 1) {
        throw new Error("Invalid response from server");
      }

      sessionStorage.setItem("token", response.data.token);

      navigate("/dashboard");
      setLoginError("");
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("Error logging in. Please try again later.");
      }
      setSubmitting(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="container">
      {showForgotPassword ? (
        <div className="forgot-password">
          <p>
            Enter your email address below and we&apos;ll send you a link to
            reset your password.
          </p>
          <ForgotPasswordForm onReset={handleResetPassword} />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form className="form">
              <h1>Login</h1>
              {loginError && <div className="error">{loginError}</div>}
              <FormikController
                control="input"
                type="email"
                label="Email"
                name="email"
                formikProps={formikProps}
                placeholder="Enter your email"
              />
              <FormikController
                control="input"
                type="password"
                label="Password"
                name="password"
                formikProps={formikProps}
                placeholder="Enter your password"
              />
              <p className="forget" onClick={handleForgotPasswordClick}>
                Forgot Password ?
              </p>
              <div className="btn">
                <button type="submit">Login</button>
              </div>
              <div>
                <Link to="/signup">Don&apos;t have an account? Sign Up</Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Login;
