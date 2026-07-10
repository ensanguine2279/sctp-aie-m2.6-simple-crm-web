// src/components/CustomerCard.jsx (updated)
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextInstance";
import { CustomerContext } from "../contexts/CustomerContextInstance";

import PropTypes from "prop-types";
import { Mail, Phone } from "lucide-react";

import styles from "./CustomerCard.module.css";

function initials(firstName, lastName) {
  return (firstName[0] + lastName[0]).toUpperCase();
}

function highlightText(text, search) {
  // Use .trim() to ensure we don't try to highlight plain trailing spaces
  if (!search || !search.trim()) return text;

  const trimmedSearch = search.trim();

  // A clean, linter-approved way to escape regex characters
  const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Escape special regex tokens and build a case-insensitive matching group split pattern
  const regex = new RegExp(`(${escapedSearch})`, "gi");

  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === trimmedSearch.toLowerCase() ? (
      <mark key={index} className={styles.highlight}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function CustomerCard({
  customer,
  onSelect,
  isSelected,
  searchTerm,
  deletingId,
}) {
  console.log("in customer card: ", customer);

  const { deleteCustomer } = useContext(CustomerContext);
  const { hasRole } = useContext(AuthContext);

  const { firstName, lastName, email, phone, status, tags } = customer;
  const isDeleting = deletingId === customer.id;

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      onClick={() => onSelect(customer.id)}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>{initials(firstName, lastName)}</div>
        <div className={styles.nameBlock}>
          <p className={styles.name}>
            {/* Wrap standard text nodes with the dynamic highlighting helper */}
            {highlightText(firstName, searchTerm)}{" "}
            {highlightText(lastName, searchTerm)}
          </p>
        </div>
        <span
          className={`${styles.badge} ${status === "active" ? styles.badgeActive : styles.badgeInactive}`}
        >
          {status}
        </span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <Mail size={14} />
          {/* Apply highlighting to email layout */}
          <span>{highlightText(email, searchTerm)}</span>
        </div>
        <div className={styles.metaRow}>
          <Phone size={14} />
          <span>{highlightText(phone, searchTerm)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {hasRole("admin") && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              deleteCustomer(customer.id);
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}

CustomerCard.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
  deletingId: PropTypes.string.isRequired,
};

export default CustomerCard;
