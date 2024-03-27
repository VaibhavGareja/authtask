/* eslint-disable react/prop-types */
import DateElement from "./DateElement";
import InputElement from "./InputElemnt";

function FormikController(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <InputElement {...rest} />;
    case "date":
      return <DateElement {...rest}  />;
    default:
      return null;
  }
}

export default FormikController;
