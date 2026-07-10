// src/App.jsx
import { useState, useContext } from "react";

import { useAuth } from "./contexts/AuthContextInstance";
import { useCustomers } from "./contexts/CustomerContextInstance";

import LoginPage from "./components/LoginPage";
import Header from "./components/Header";

import CustomerCard from "./components/CustomerCard";
import CustomerDetail from "./components/CustomerDetail";

import SearchBar from "./components/SearchBar";
import SortBar from "./components/SortBar";
import StatusFilter from "./components/StatusFilter";
import TagFilter from "./components/TagFilter";

import Spinner from "./components/Spinner";

import "./App.css";

const ALL_TAGS = ["VIP", "Lead", "Referral"];
export const API_BASE = "http://localhost:3001";

function App() {
  const { user } = useAuth();
  const {
    customers,
    filteredCustomers,
    sortedCustomers,

    loading,
    error,
    submitting,

    showForm,

    searchTerm,
    statusFilter,
    sortField,
    sortDirection,

    selectedId,
    selectedTags,
    deletingId,

    addCustomer,

    toggleForm,
    filterTagToggle,

    setSearchTerm,
    setStatusFilter,
    setSortField,
    setSortDirection,

    setSelectedId,
    setSelectedTags,
  } = useCustomers();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    tags: [],
  });

  if (!user) return <LoginPage />;
  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const newCustomer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await addCustomer(newCustomer);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "active",
      tags: [],
    });
  };

  // Helper function to introduction delays to test for loading states
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="simple-crm">
      <Header />

      <h1>Simple CRM</h1>

      <button
        type="button"
        onClick={toggleForm}
        className="submit-button"
        style={{ marginBottom: "24px", display: "block" }}
      >
        {showForm ? "Cancel" : "Add Customer"}
      </button>

      {showForm && (
        <form onSubmit={handleAddCustomer} className="add-customer-form">
          <h3>Add New Customer</h3>

          <div className="form-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g. Sarah"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Chen"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. sarah.chen@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              placeholder="e.g. +65 9123 4567"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-field">
            <label>Tags</label>
            <div className="tag-options">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Adding" : "Add Customer"}
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

          {/* Sorting Row */}
          <SortBar
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
          />

          {/* Status Filter Row */}
          <StatusFilter
            currentStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {/* Tag Filter Row */}
          <TagFilter
            availableTags={ALL_TAGS}
            selectedTags={selectedTags}
            onTagToggle={filterTagToggle}
            onClearTags={() => setSelectedTags([])}
          />

          <div className="customer-list">
            <h2>
              Customers{" "}
              <span
                className="tag"
                style={{
                  fontSize: "14px",
                  verticalAlign: "middle",
                  marginLeft: "8px",
                  display: "inline-block",
                }}
              >
                {searchTerm || selectedTags.length > 0 || statusFilter !== "all"
                  ? `showing ${filteredCustomers.length} of ${customers.length}`
                  : `(${customers.length})`}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  marginLeft: "8px",
                }}
              >
                {searchTerm || selectedTags.length > 0 || statusFilter !== "all"
                  ? // When filtering: shows e.g., "active: 2 of 4 matching"
                    `active: ${filteredCustomers.filter((c) => c.status === "active").length} of ${customers.filter((c) => c.status === "active").length}`
                  : // When not filtering: shows e.g., "4 active"
                    `${customers.filter((c) => c.status === "active").length} active`}
              </span>
            </h2>

            {sortedCustomers.length === 0 ? (
              <p className="empty-state">
                {customers.length === 0
                  ? "No customers yet. Add one above!"
                  : statusFilter === "active"
                    ? "No active customers."
                    : statusFilter === "inactive"
                      ? "No inactive customers."
                      : "No customers match your search."}
              </p>
            ) : (
              <div className="customers">
                {sortedCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onSelect={setSelectedId}
                    isSelected={selectedId === customer.id}
                    searchTerm={searchTerm}
                    deletingId={deletingId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CustomerDetail selectedId={selectedId} />
      </div>
    </div>
  );
}

export default App;
