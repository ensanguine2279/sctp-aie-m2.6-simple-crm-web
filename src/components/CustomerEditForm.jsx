// src/components/CustomerEditForm.jsx
import { useState } from "react";

import { useCustomers } from "../contexts/CustomerContextInstance";

import PropTypes from "prop-types";

import styles from "./CustomerEditForm.module.css";

function CustomerEditForm({ customer, onDone }) {
  const ALL_TAGS = ["VIP", "Lead", "Referral"];

  const { updateCustomer } = useCustomers();

  const [editForm, setEditForm] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone || "",
    company: customer.company || "",
    notes: customer.notes || "",
    status: customer.status,
    tags: customer.tags || [],
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagToggle = (tag) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCustomer(customer.id, editForm);
      onDone(editForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={styles.name}>Edit customer</h2>

      <div className={styles.section}>
        <div className={styles.editField}>
          <label className={styles.sectionLabel} htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={styles.input}
            value={editForm.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.editField}>
          <label className={styles.sectionLabel} htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={styles.input}
            value={editForm.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.editField}>
          <label className={styles.sectionLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            value={editForm.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.editField}>
          <label className={styles.sectionLabel} htmlFor="company">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className={styles.input}
            value={editForm.company}
            onChange={handleChange}
          />
        </div>

        <div className={styles.editField}>
          <label className={styles.sectionLabel} htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className={styles.input}
            value={editForm.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className={styles.editField}>
          <label className={styles.sectionLabel} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className={styles.input}
            value={editForm.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.editField}>
          <label className={styles.sectionLabel}>Tags</label>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "4px",
            }}
          >
            {ALL_TAGS.map((tag) => {
              const isTagSelected = editForm.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="tag-toggle"
                  style={{
                    padding: "4px 12px",
                    border: "1px solid",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    background: isTagSelected ? "var(--primary-100)" : "white",
                    borderColor: isTagSelected
                      ? "var(--primary-500)"
                      : "var(--border-default)",
                    color: isTagSelected
                      ? "var(--primary-700)"
                      : "var(--text-body)",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.editActions}>
        <button type="submit" className={styles.saveButton} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => onDone(null)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

CustomerEditForm.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    company: PropTypes.string,
    notes: PropTypes.string,
    status: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onDone: PropTypes.func.isRequired,
};

export default CustomerEditForm;
