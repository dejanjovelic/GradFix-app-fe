export function getErrorMessage(error, options = {}) {
  const {
    fallbackMessage =
      "Something went wrong. Please try again.",
    unauthorizedMessage =
      "Your session has expired. Please log in again.",
    forbiddenMessage =
      "You do not have permission to perform this action.",
    notFoundMessage =
      "The requested item could not be found.",
  } = options;

  const status = error.response?.status;
  const responseData = error.response?.data;

  const validationMessage = getValidationMessage(
    responseData?.errors
  );

  if (validationMessage) {
    return validationMessage;
  }

  switch (status) {
    case 400:
      return (
        responseData?.detail ||
        responseData?.message ||
        (typeof responseData?.error === "string" && responseData.error) ||
        "Please check the entered information and try again."
      );

    case 401:
      return unauthorizedMessage;

    case 403:
      return forbiddenMessage;

    case 404:
      return (
        responseData?.detail ||
        responseData?.message ||
        notFoundMessage
      );

    case 409:
      return (
        responseData?.detail ||
        responseData?.message ||
        "This action conflicts with existing data."
      );

    case 413:
      return (
        "The uploaded file is too large. " +
        "Please choose a smaller image."
      );

    case 415:
      return (
        "The selected file type is not supported. " +
        "Please use JPG, PNG or WEBP."
      );

    case 422:
      return (
        responseData?.detail ||
        responseData?.message ||
        "The submitted information could not be processed."
      );

    case 429:
      return (
        "Too many requests were sent. " +
        "Please wait a moment and try again."
      );

    case 500:
      return (
        "The server encountered an unexpected problem. " +
        "Please try again later."
      );

    case 502:
    case 503:
    case 504:
      return (
        "The service is temporarily unavailable. " +
        "Please try again shortly."
      );

    default:
      if (!error.response) {
        return (
          "The server could not be reached. " +
          "Check your internet connection and try again."
        );
      }

      return (
        responseData?.detail ||
        responseData?.message ||
        fallbackMessage
      );
  }
}

function getValidationMessage(errors) {
  if (!errors || typeof errors !== "object") {
    return null;
  }

  const messages = Object.values(errors).flat();

  return messages.length > 0 ? messages[0] : null;
}
