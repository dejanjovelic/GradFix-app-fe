import React from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className = "page-header",
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  titleId,
}) {
  const classes = ["page-header", className]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" ");

  return (
    <header className={classes}>
      <div>
        {eyebrow && <span className={eyebrowClassName}>{eyebrow}</span>}
        <h1 id={titleId} className={titleClassName}>
          {title}
        </h1>
        {description && <p className={descriptionClassName}>{description}</p>}
      </div>
      {action}
    </header>
  );
}
