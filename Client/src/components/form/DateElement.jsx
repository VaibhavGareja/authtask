/* eslint-disable react/prop-types */

import { ErrorMessage, getIn } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function DateElement({ label, name, formikProps }) {
  const { setFieldValue, setFieldTouched } = formikProps;
  const handleDateChange = (date) => {
    setFieldValue(name, date);
    setFieldTouched(name, true, false);
    formikProps.validateField(name);
  };
  const fieldError = getIn(formikProps.errors, name);
  return (
    <div className="input">
      <label htmlFor={name}>{label}:</label>
      
      <DatePicker
        selected={formikProps.values[name]}
        onChange={handleDateChange}
        onBlur={() => setFieldTouched(name, true)}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        onKeyDown={(e) => e.preventDefault()}
        placeholderText="Select date"
        dateFormat="dd/MM/yyyy"
        showDateMonthYearPicker
      />
      {fieldError && <ErrorMessage name={name} component="div" className="error" />}
    </div>
  );
}

export default DateElement;
