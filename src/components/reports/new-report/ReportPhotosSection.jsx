import React from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import ReportFormSection from "./ReportFormSection";

export default function ReportPhotosSection({
  images,
  imageError,
  maxImages,
  fileInputRef,
  onImagesSelected,
  onRemoveImage,
}) {
  return (
    <ReportFormSection
      icon={<Camera size={22} aria-hidden="true" />}
      title="Photos"
      description="Add between 1 and 3 clear images."
    >
      {images.length < maxImages && (
        <button
          className="report-form__upload"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus size={24} aria-hidden="true" />
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
        onChange={onImagesSelected}
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
                onClick={() => onRemoveImage(index)}
                aria-label={`Remove photo ${index + 1}`}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </figure>
          ))}
        </div>
      )}

      <p className="report-form__counter">
        {images.length} / {maxImages} photos
      </p>
      {imageError && (
        <p className="report-form__error" role="alert">
          {imageError}
        </p>
      )}
    </ReportFormSection>
  );
}
