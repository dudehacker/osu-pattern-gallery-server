import { useState } from "react";
import axios from "axios";
import { routes } from "../../service/api";

const PostForm = async (values, successCallback, errorCallback) => {
  axios
    .post(routes.pattern, values)
    .then((res) => {
      console.log(res.data);
      successCallback();
    })
    .catch((error) => {
      // Error
      console.log(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
      }
      errorCallback(error.response.data);
    });
};

const initialFormValues = {
  osuTimestamps: "",
  imageUrl: "",
  beatmapUrl: "",
  description: "",
  formSubmitted: false,
  success: false,
};

export const useFormControls = (handleAlertOpen) => {
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("osuTimestamps" in fieldValues)
      temp.osuTimestamps = fieldValues.osuTimestamps
        ? ""
        : "This field is required.";

    if ("imageUrl" in fieldValues)
      temp.imageUrl = fieldValues.imageUrl ? "" : "This field is required.";

    if ("beatmapUrl" in fieldValues)
      temp.beatmapUrl = fieldValues.beatmapUrl ? "" : "This field is required.";

    setErrors({
      ...temp,
    });
  };

  const handleInputValue = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const handleSuccess = () => {
    setValues({
      ...initialFormValues,
      formSubmitted: true,
      success: true,
    });
    handleAlertOpen();
  };

  const handleError = (errMsg) => {
    setValues({
      ...initialFormValues,
      formSubmitted: true,
      success: false,
    });
    handleAlertOpen(errMsg);
  };

  const formIsValid = (fieldValues = values) => {
    const isValid =
      fieldValues.osuTimestamps &&
      fieldValues.imageUrl &&
      fieldValues.beatmapUrl &&
      Object.values(errors).every((x) => x === "");

    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid =
      Object.values(errors).every((x) => x === "") && formIsValid();
    if (isValid) {
      await PostForm(values, handleSuccess, handleError);
    }
  };

  return {
    values,
    errors,
    handleInputValue,
    handleFormSubmit,
    formIsValid,
  };
};
