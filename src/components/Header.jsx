// src/components/Header.jsx
import { useAuth } from "../contexts/AuthContextInstance";

import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useAuth();

  // Guard clause in case Header renders before authentication settles
  if (!user) return null;

  // Build the dynamic badge style string based on the user's role
  const badgeClass = `${styles.roleBadge} ${
    user.role === "admin" ? styles.roleBadgeAdmin : styles.roleBadgeUser
  }`;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        🛡️ <span className={styles.logoText}>Simple CRM</span>
      </div>

      <div className={styles.userInfo}>
        <span className={styles.userName}>{user.name}</span>

        {/* Dynamic Role Badge Element */}
        <span className={badgeClass}>{user.role}</span>

        <button type="button" onClick={logout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
