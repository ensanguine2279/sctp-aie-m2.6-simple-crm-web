// src/components/StatusFilter.jsx
import PropTypes from "prop-types";
import styles from "./StatusFilter.module.css";

function StatusFilter({ currentStatus, onStatusChange }) {
  const statuses = ["all", "active", "inactive"];

  return (
    <div className={styles.filterContainer}>
      <span className={styles.label}>Status:</span>

      {statuses.map((status) => {
        const isActive = currentStatus === status;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={`${styles.filterButton} ${isActive ? styles.activeButton : ""}`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}

StatusFilter.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default StatusFilter;
