/* eslint-disable react/prop-types */
import { Field, ErrorMessage } from "formik";

function InputElement({ label, name, type, placeholder }) {
  return (
    <div className="input">
      <label htmlFor={name}>{label}:</label>
      <Field type={type} name={name} placeholder={placeholder} />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
}

export default InputElement;
