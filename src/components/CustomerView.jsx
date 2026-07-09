import styles from "./CustomerView.module.css";

function CustomerView({ customer, onEditClick }) {
  return (
    <>
      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.name}>
            {customer.firstName} {customer.lastName}
          </h2>
          {customer.company && (
            <p className={styles.company}>{customer.company}</p>
          )}
        </div>
        <button className={styles.editButton} onClick={onEditClick}>
          Edit
        </button>
      </div>

      <div>
        <p className={styles.contactRow}>{customer.email}</p>
        {customer.phone && (
          <p className={styles.contactRow}>{customer.phone}</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Status and tags</p>
        <div className={styles.tags}>
          <span
            className={`${styles.badge} ${customer.status === "active" ? styles.badgeActive : styles.badgeInactive}`}
          >
            {customer.status}
          </span>
          {customer.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Notes</p>
        {customer.notes ? (
          <p className={styles.notes}>{customer.notes}</p>
        ) : (
          <p className={styles.notesEmpty}>No notes yet.</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Customer since</p>
        <p className={styles.contactRow}>{customer.createdAt}</p>
      </div>
    </>
  );
}

export default CustomerView;
