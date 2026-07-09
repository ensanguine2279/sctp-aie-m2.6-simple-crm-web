// src/components/SortBar.jsx
import PropTypes from "prop-types";
import styles from "./SortBar.module.css";

function SortBar({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}) {
  const fields = [
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
  ];

  const handleSortClick = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the already active field
      onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Default to ascending order when changing to a new field
      onSortFieldChange(field);
      onSortDirectionChange("asc");
    }
  };

  const handleClear = () => {
    onSortFieldChange("");
    onSortDirectionChange("asc");
  };

  return (
    <div className={styles.sortContainer}>
      <span className={styles.label}>Sort by:</span>

      {fields.map((field) => {
        const isCurrentField = sortField === field.value;

        return (
          <button
            key={field.value}
            type="button"
            onClick={() => handleSortClick(field.value)}
            className={`${styles.sortButton} ${isCurrentField ? styles.activeButton : ""}`}
          >
            {field.label}
            {isCurrentField && (sortDirection === "asc" ? " ↑" : " ↓")}
          </button>
        );
      })}

      {sortField && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
        >
          Clear Sort
        </button>
      )}
    </div>
  );
}

SortBar.propTypes = {
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf(["asc", "desc"]).isRequired,
  onSortFieldChange: PropTypes.func.isRequired,
  onSortDirectionChange: PropTypes.func.isRequired,
};

export default SortBar;
