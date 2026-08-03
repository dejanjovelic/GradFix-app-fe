import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  ImagePlus,
  LoaderCircle,
  LocateFixed,
  MapPin,
  X,
} from "lucide-react";

import { getCategories } from "../../api/categoryApi";
import { createReport } from "../../api/reportApi";

import { getErrorMessage } from "../../utils/getErrorMessage";

import "./new-report-page.scss";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getApiError(error) {
  const responseData = error.response?.data;

  if (responseData?.errors) {
    const validationMessages = Object.values(responseData.errors).flat();

    if (validationMessages.length > 0) {
      return validationMessages[0];
    }
  }

  return (
    responseData?.message ||
    responseData?.title ||
    (typeof responseData === "string" ? responseData : null) ||
    "The report could not be submitted."
  );
}

function NewReportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");

  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      latitude: "",
      longitude: "",
      addressFallback: "",
    },
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  useEffect(() => {
    async function loadCategories() {
      setCategoriesError("");

      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        setCategoriesError(
          getErrorMessage(error, {
            fallbackMessage:
              "Categories could not be loaded. Please refresh the page.",
          }),
        );
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [images]);

  const handleImagesSelected = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    event.target.value = "";
    setImageError("");

    if (selectedFiles.length === 0) {
      return;
    }

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const invalidType = selectedFiles.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type),
    );

    if (invalidType) {
      setImageError("Only JPG, PNG and WEBP images are supported.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE,
    );

    if (oversizedFile) {
      setImageError("Each image must be smaller than 10 MB.");
      return;
    }

    const newImages = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((currentImages) => [...currentImages, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages((currentImages) => {
      const removedImage = currentImages[indexToRemove];

      if (removedImage) {
        URL.revokeObjectURL(removedImage.previewUrl);
      }

      return currentImages.filter((_, index) => index !== indexToRemove);
    });

    setImageError("");
  };

  const getCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser. Enter the address manually.",
      );
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude.toString(), {
          shouldValidate: true,
        });

        setValue("longitude", position.coords.longitude.toString(), {
          shouldValidate: true,
        });

        setLocationError("");
        setIsLocating(false);
      },
      () => {
        setLocationError(
          "Location access was denied. Enter the address manually.",
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const clearCoordinates = () => {
    setValue("latitude", "");
    setValue("longitude", "");
  };

  const onSubmit = async (data) => {
    setSubmitError("");
    setImageError("");
    setLocationError("");

    if (images.length === 0) {
      setImageError("At least one image is required.");
      return;
    }

    const hasCoordinates = data.latitude !== "" && data.longitude !== "";

    const hasAddress = data.addressFallback.trim().length > 0;

    if (!hasCoordinates && !hasAddress) {
      setLocationError(
        "Use your current location or enter an address manually.",
      );
      return;
    }

    const formData = new FormData();

    if (data.title.trim()) {
      formData.append("Title", data.title.trim());
    }

    formData.append("Description", data.description.trim());

    formData.append("CategoryId", data.categoryId);

    if (hasCoordinates) {
      formData.append("Latitude", data.latitude);
      formData.append("Longitude", data.longitude);
    }

    if (hasAddress) {
      formData.append("AddressFallback", data.addressFallback.trim());
    }

    images.forEach(({ file }) => {
      formData.append("Images", file);
    });

    try {
      const createdReport = await createReport(formData);

      navigate(`/reports/${createdReport.id}`, {
        replace: true,
        state: {
          successMessage: "Your report was submitted successfully.",
        },
      });
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, {
          fallbackMessage: "The report could not be submitted.",
          unauthorizedMessage:
            "Please log in again before submitting a report.",
          forbiddenMessage: "Only citizens can submit reports.",
        }),
      );
    }
  };

  return (
    <section className="new-report-page">
      <header className="new-report-page__header">
        <span className="new-report-page__eyebrow">New report</span>

        <h1>Report a problem</h1>

        <p>
          Add photos and location details so the city can identify and resolve
          the problem.
        </p>
      </header>

      <form
        className="report-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {submitError && (
          <div
            className="report-form__message report-form__message--error"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <section className="report-form__card">
          <div className="report-form__card-heading">
            <div className="report-form__card-icon">
              <Camera size={22} />
            </div>

            <div>
              <h2>Photos</h2>
              <p>Add between 1 and 3 clear images.</p>
            </div>
          </div>

          {images.length < MAX_IMAGES && (
            <button
              className="report-form__upload"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={24} />
              <span>Choose photos</span>
              <small>JPG, PNG or WEBP, up to 10 MB each</small>
            </button>
          )}

          <input
            ref={fileInputRef}
            className="report-form__file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesSelected}
          />

          {images.length > 0 && (
            <div className="report-form__previews">
              {images.map((image, index) => (
                <figure
                  className="report-form__preview"
                  key={`${image.file.name}-${image.file.lastModified}`}
                >
                  <img
                    src={image.previewUrl}
                    alt={`Selected report photo ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X size={18} />
                  </button>
                </figure>
              ))}
            </div>
          )}

          <p className="report-form__counter">
            {images.length} / {MAX_IMAGES} photos
          </p>

          {imageError && (
            <p className="report-form__error" role="alert">
              {imageError}
            </p>
          )}
        </section>

        <section className="report-form__card">
          <div className="report-form__field">
            <label htmlFor="title">
              Title <span>Optional</span>
            </label>

            <input
              id="title"
              type="text"
              maxLength={120}
              placeholder="For example: Broken street light"
              aria-invalid={Boolean(errors.title)}
              {...register("title", {
                maxLength: {
                  value: 120,
                  message: "Title cannot exceed 120 characters.",
                },
              })}
            />

            {errors.title && (
              <p className="report-form__error" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="report-form__field">
            <label htmlFor="categoryId">Category</label>

            <select
              id="categoryId"
              disabled={isLoadingCategories}
              aria-invalid={Boolean(errors.categoryId)}
              {...register("categoryId", {
                required: "Category is required.",
              })}
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {categoriesError && (
              <p className="report-form__error" role="alert">
                {categoriesError}
              </p>
            )}

            {errors.categoryId && (
              <p className="report-form__error" role="alert">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="report-form__field">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              rows={6}
              maxLength={2000}
              placeholder="Describe what is damaged, where it is and whether it poses a danger."
              aria-invalid={Boolean(errors.description)}
              {...register("description", {
                required: "Description is required.",
                minLength: {
                  value: 10,
                  message: "Description must contain at least 10 characters.",
                },
                maxLength: {
                  value: 2000,
                  message: "Description cannot exceed 2000 characters.",
                },
              })}
            />

            {errors.description && (
              <p className="report-form__error" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        <section className="report-form__card">
          <div className="report-form__card-heading">
            <div className="report-form__card-icon">
              <MapPin size={22} />
            </div>

            <div>
              <h2>Location</h2>
              <p>Use GPS or enter an address manually.</p>
            </div>
          </div>

          <button
            className="report-form__location-button"
            type="button"
            onClick={getCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <LoaderCircle className="report-form__spinner" size={20} />
            ) : (
              <LocateFixed size={20} />
            )}

            {isLocating ? "Finding location..." : "Use my current location"}
          </button>

          {latitude && longitude && (
            <div className="report-form__location-success">
              <div>
                <strong>Location selected</strong>
                <span>
                  {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                </span>
              </div>

              <button type="button" onClick={clearCoordinates}>
                Remove
              </button>
            </div>
          )}

          <input type="hidden" {...register("latitude")} />

          <input type="hidden" {...register("longitude")} />

          <div className="report-form__divider">
            <span>or</span>
          </div>

          <div className="report-form__field">
            <label htmlFor="addressFallback">Manual address</label>

            <input
              id="addressFallback"
              type="text"
              maxLength={250}
              placeholder="Street, number and city"
              aria-invalid={Boolean(errors.addressFallback)}
              {...register("addressFallback", {
                maxLength: {
                  value: 250,
                  message: "Address cannot exceed 250 characters.",
                },
              })}
            />

            {errors.addressFallback && (
              <p className="report-form__error" role="alert">
                {errors.addressFallback.message}
              </p>
            )}
          </div>

          {locationError && (
            <p className="report-form__error" role="alert">
              {locationError}
            </p>
          )}
        </section>

        <button
          className="report-form__submit"
          type="submit"
          disabled={
            isSubmitting || isLoadingCategories || Boolean(categoriesError)
          }
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="report-form__spinner" size={20} />
              Submitting report...
            </>
          ) : (
            "Submit report"
          )}
        </button>
      </form>
    </section>
  );
}

export default NewReportPage;
