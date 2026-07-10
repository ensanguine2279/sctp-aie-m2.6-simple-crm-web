// src/components/CustomerDetail.jsx
import { useState, useEffect, useContext } from "react";

import { CustomerContext } from "../contexts/CustomerContextInstance.js";

import CustomerView from "./CustomerView.jsx";
import CustomerEditForm from "./CustomerEditForm.jsx";

import Spinner from "./Spinner.jsx";

import { API_BASE } from "../App.jsx";

import styles from "./CustomerDetail.module.css";

function CustomerDetail({ selectedId }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (e) => {
    setIsEditing(true);
  };

  const handleDone = (updates) => {
    if (updates) {
      setCustomer((prev) => ({ ...prev, ...updates }));
    }
    setIsEditing(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!selectedId) return;

    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/customers/${selectedId}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCustomer();

    return () => {
      controller.abort();
    };
  }, [selectedId]);

  if (!selectedId) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Select a customer to view details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Error: {error}</p>
      </div>
    );
  }

  if (loading || !customer) {
    return (
      <div className={styles.panel}>
        <Spinner size={8} />
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {isEditing ? (
        <CustomerEditForm customer={customer} onDone={handleDone} />
      ) : (
        <CustomerView customer={customer} onEditClick={handleEditClick} />
      )}
    </div>
  );
}

export default CustomerDetail;
