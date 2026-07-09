// src/components/LoginPage.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContextInstance";

import { USERS } from "../data/users";

import styles from "./LoginPage.module.css";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    // In a real app, this would be a POST request to an API endpoint.
    // The backend would verify the credentials and return the user object.
    const match = USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (match) {
      // Pull the password variable out into its own isolated string,
      // and gathers everything else into a brand new object userData.
      // Then simply pass userData to the login function, and the password
      // variable naturally vanishes when the function finishes executing.
      const { password, ...userData } = match;

      login(userData);
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <h1 className={styles.heading}>Sign in</h1>
        <p className={styles.lead}>Welcome back to Simple CRM.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@simplesystems.io"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Sign in
          </button>
        </form>

        <p className={styles.hint}>
          Try: daniel@simplesystems.io / password123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
