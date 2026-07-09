// src/components/TagFilter.jsx
import PropTypes from "prop-types";
import styles from "./TagFilter.module.css";

function TagFilter({ availableTags, selectedTags, onTagToggle, onClearTags }) {
  return (
    <div className={styles.filterContainer}>
      <span className={styles.label}>Tags:</span>

      {availableTags.map((tag) => {
        const isActive = selectedTags.includes(tag);

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onTagToggle(tag)}
            className={`${styles.filterButton} ${isActive ? styles.activeButton : ""}`}
          >
            {tag}
          </button>
        );
      })}

      {selectedTags.length > 0 && (
        <button
          type="button"
          onClick={onClearTags}
          className={styles.clearButton}
        >
          Clear Tags
        </button>
      )}
    </div>
  );
}

TagFilter.propTypes = {
  availableTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagToggle: PropTypes.func.isRequired,
  onClearTags: PropTypes.func.isRequired,
};

export default TagFilter;
