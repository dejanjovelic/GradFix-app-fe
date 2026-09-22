import React from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";
import ReportFormSection from "./ReportFormSection";

export default function ReportLocationSection({
  selectedLatitude,
  selectedLongitude,
  isLocating,
  locationError,
  onClearLocation,
  onGetCurrentLocation,
  register,
  errors,
}) {
  return (
    <ReportFormSection
      icon={<MapPin size={22} aria-hidden="true" />}
      title="Location"
      description="Select the report location on the map or use your current location."
    >
      <div className="report-form__selected-location">
        <span>Selected coordinates</span>
        {selectedLatitude != null && selectedLongitude != null ? (
          <>
            <strong>
              {selectedLatitude.toFixed(6)}, {selectedLongitude.toFixed(6)}
            </strong>
            <button type="button" onClick={onClearLocation}>
              Remove location
            </button>
          </>
        ) : (
          <strong>No location selected</strong>
        )}
      </div>

      <button
        className="report-form__location-button"
        type="button"
        onClick={onGetCurrentLocation}
        disabled={isLocating}
      >
        {isLocating ? (
          <LoaderCircle
            className="report-form__spinner"
            size={20}
            aria-hidden="true"
          />
        ) : (
          <LocateFixed size={20} aria-hidden="true" />
        )}
        {isLocating ? "Finding your location..." : "Use my current location"}
      </button>

      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />
      {locationError && (
        <p className="report-form__error" role="alert">
          {locationError}
        </p>
      )}

      <div className="report-form__field report-form__field--address">
        <label htmlFor="addressFallback">
          Address or location description <span>Optional</span>
        </label>
        <input
          id="addressFallback"
          type="text"
          maxLength={250}
          placeholder="Street, number or nearby landmark"
          aria-invalid={Boolean(errors.addressFallback)}
          {...register("addressFallback", {
            maxLength: {
              value: 250,
              message: "Address cannot exceed 250 characters.",
            },
          })}
        />
        <small className="report-form__field-hint">
          This helps other users understand the selected map location.
        </small>
        {errors.addressFallback && (
          <p className="report-form__error" role="alert">
            {errors.addressFallback.message}
          </p>
        )}
      </div>
    </ReportFormSection>
  );
}
