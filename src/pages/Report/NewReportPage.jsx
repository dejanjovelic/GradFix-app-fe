import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../api/categoryApi";
import { createReport } from "../../api/reportApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import LocationPickerMap from "../../components/maps/LocationPickerMap";
import PageHeader from "../../components/shared/PageHeader";
import ReportDetailsSection from "../../components/reports/new-report/ReportDetailsSection";
import ReportLocationSection from "../../components/reports/new-report/ReportLocationSection";
import ReportPhotosSection from "../../components/reports/new-report/ReportPhotosSection";
import ReportSubmitActions from "../../components/reports/new-report/ReportSubmitActions";
import "./new-report-page.scss";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  const selectedLatitude = latitude !== "" ? Number(latitude) : null;
  const selectedLongitude = longitude !== "" ? Number(longitude) : null;

  const handleLocationSelect = (nextLatitude, nextLongitude) => {
    setValue("latitude", nextLatitude.toString(), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("longitude", nextLongitude.toString(), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setLocationError("");
  };

  useEffect(() => {
    async function loadCategories() {
      setCategoriesError("");
      try {
        setCategories(await getCategories());
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

  useEffect(
    () => () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    },
    [images],
  );

  const handleImagesSelected = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    setImageError("");

    if (!selectedFiles.length) return;
    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }
    if (
      selectedFiles.some((file) => !ALLOWED_IMAGE_TYPES.includes(file.type))
    ) {
      setImageError("Only JPG, PNG and WEBP images are supported.");
      return;
    }
    if (selectedFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
      setImageError("Each image must be smaller than 10 MB.");
      return;
    }

    setImages((currentImages) => [
      ...currentImages,
      ...selectedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (indexToRemove) => {
    setImages((currentImages) => {
      const removedImage = currentImages[indexToRemove];
      if (removedImage) URL.revokeObjectURL(removedImage.previewUrl);
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
        handleLocationSelect(
          position.coords.latitude,
          position.coords.longitude,
        );
        setIsLocating(false);
      },
      (geolocationError) => {
        let message =
          "Your location could not be determined. Select the location manually on the map.";
        if (geolocationError.code === geolocationError.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Select the location manually on the map.";
        }
        if (geolocationError.code === geolocationError.TIMEOUT) {
          message =
            "Location request timed out. Select the location manually on the map.";
        }
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const clearLocation = () => {
    setValue("latitude", "", { shouldValidate: true, shouldDirty: true });
    setValue("longitude", "", { shouldValidate: true, shouldDirty: true });
    setLocationError("");
  };

  const onSubmit = async (data) => {
    setSubmitError("");
    setImageError("");
    setLocationError("");

    if (!images.length) {
      setImageError("At least one image is required.");
      return;
    }
    const hasCoordinates = data.latitude !== "" && data.longitude !== "";
    if (!hasCoordinates) {
      setLocationError(
        "Select the report location on the map or use your current location.",
      );
      return;
    }

    const formData = new FormData();
    if (data.title.trim()) formData.append("Title", data.title.trim());
    formData.append("Description", data.description.trim());
    formData.append("CategoryId", data.categoryId);
    formData.append("Latitude", data.latitude);
    formData.append("Longitude", data.longitude);
    if (data.addressFallback.trim())
      formData.append("AddressFallback", data.addressFallback.trim());
    images.forEach(({ file }) => formData.append("Images", file));

    try {
      const createdReport = await createReport(formData);
      navigate(`/reports/${createdReport.id}`, {
        replace: true,
        state: { successMessage: "Your report was submitted successfully." },
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
      <PageHeader
        className="new-report-page__header"
        eyebrowClassName="new-report-page__eyebrow"
        eyebrow="New report"
        title="Report a problem"
        description="Select the location on the map, add photos and describe the problem."
      />
      <div className="new-report-layout">
        <aside className="new-report-layout__map">
          <LocationPickerMap
            latitude={selectedLatitude}
            longitude={selectedLongitude}
            onLocationSelect={handleLocationSelect}
          />
        </aside>
        <div className="new-report-layout__form">
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
            <div className="report-form__panel">
              <ReportDetailsSection
                categories={categories}
                isLoadingCategories={isLoadingCategories}
                categoriesError={categoriesError}
                register={register}
                errors={errors}
              />
              <ReportLocationSection
                selectedLatitude={selectedLatitude}
                selectedLongitude={selectedLongitude}
                isLocating={isLocating}
                locationError={locationError}
                onClearLocation={clearLocation}
                onGetCurrentLocation={getCurrentLocation}
                register={register}
                errors={errors}
              />
              <ReportPhotosSection
                images={images}
                imageError={imageError}
                maxImages={MAX_IMAGES}
                fileInputRef={fileInputRef}
                onImagesSelected={handleImagesSelected}
                onRemoveImage={removeImage}
              />
              <ReportSubmitActions
                isSubmitting={isSubmitting}
                disabled={
                  isSubmitting ||
                  isLoadingCategories ||
                  Boolean(categoriesError)
                }
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewReportPage;
