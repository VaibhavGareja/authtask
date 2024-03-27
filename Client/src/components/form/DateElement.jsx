/* eslint-disable react/prop-types */

import { ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function DateElement({ label, name, formikProps }) {
  const { setFieldValue } = formikProps;

  return (
    <div className="input">
      <label htmlFor={name}>{label}:</label>

      <DatePicker
        selected={formikProps.values[name]}
        onChange={(date) => setFieldValue(name, date)}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        onKeyDown={(e) => e.preventDefault()}
        placeholderText="Select date"
        dateFormat="dd/MM/yyyy"
        showDateMonthYearPicker
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
}

export default DateElement;
