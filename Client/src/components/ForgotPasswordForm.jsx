import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [resetStatus, setResetStatus] = useState(null);

  const initialValues = {
    email: "",
  };

  const ForgotPasswordSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email address"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:3000/forgot-password", values);
      console.log("Forgot password response:", response);
      setResetStatus("success");
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetStatus("error");
    }
    setSubmitting(false);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit: formikSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      {resetStatus === "success" ? (
        <p>Password reset link sent successfully. Please check your email.</p>
      ) : resetStatus === "error" ? (
        <p>Failed to send reset password link. Please try again later.</p>
      ) : (
        <form onSubmit={formikSubmit}>
          <div className="input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
            />
            {touched.email && errors.email ? (
              <div className="error">{errors.email}</div>
            ) : null}
          </div>
          <div className="btn">
            <button type="submit" disabled={isSubmitting}>Reset Password</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
