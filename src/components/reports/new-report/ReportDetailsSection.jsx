import React from "react";
import { FileText } from "lucide-react";
import ReportFormSection from "./ReportFormSection";

export default function ReportDetailsSection({
  categories,
  isLoadingCategories,
  categoriesError,
  register,
  errors,
}) {
  return (
    <ReportFormSection
      icon={<FileText size={22} aria-hidden="true" />}
      title="Report details"
      description="Describe the problem you want to report."
    >
      <div className="report-form__field">
        <label htmlFor="title">Title <span>Optional</span></label>
        <input
          id="title"
          type="text"
          maxLength={120}
          placeholder="For example: Broken street light"
          aria-invalid={Boolean(errors.title)}
          {...register("title", {
            maxLength: { value: 120, message: "Title cannot exceed 120 characters." },
          })}
        />
        {errors.title && <p className="report-form__error" role="alert">{errors.title.message}</p>}
      </div>

      <div className="report-form__field">
        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          disabled={isLoadingCategories}
          aria-invalid={Boolean(errors.categoryId)}
          {...register("categoryId", { required: "Category is required." })}
        >
          <option value="">
            {isLoadingCategories ? "Loading categories..." : "Select a category"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {categoriesError && <p className="report-form__error" role="alert">{categoriesError}</p>}
        {errors.categoryId && <p className="report-form__error" role="alert">{errors.categoryId.message}</p>}
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
            minLength: { value: 10, message: "Description must contain at least 10 characters." },
            maxLength: { value: 2000, message: "Description cannot exceed 2000 characters." },
          })}
        />
        {errors.description && <p className="report-form__error" role="alert">{errors.description.message}</p>}
      </div>
    </ReportFormSection>
  );
}
