import React, { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";

export default function ReportThumbnail({
  imagePath,
  alt = "",
  className,
  placeholderClassName,
  placeholderText = "No image",
  iconSize = 24,
  loading = "lazy",
}) {
  const imageUrl = getImageUrl(imagePath);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [imageUrl]);

  return (
    <div className={className}>
      {imageUrl && !failed ? (
        <img
          src={imageUrl}
          alt={alt}
          loading={loading}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={placeholderClassName}>
          <ImageOff size={iconSize} aria-hidden="true" />
          {placeholderText && <span>{placeholderText}</span>}
        </div>
      )}
    </div>
  );
}
