// src/components/Header.jsx
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextInstance";

import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Simple CRM</h1>
      <div className={styles.userArea}>
        <span className={styles.userName}>{user.name}</span>
        <button className={styles.logoutBtn} onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
