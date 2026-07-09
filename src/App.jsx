// src/App.jsx
import { useState, useEffect, useContext, useReducer } from "react";

import { customerReducer, initialState } from "./reducers/customerReducer";

import { AuthContext } from "./contexts/AuthContextInstance";
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
  const { user } = useContext(AuthContext);

  // Coupled state - managed by reducer
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const { customers, loading, error, submitting, showForm } = state;

  // Independent UI state - each changes on its own
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"

  const [selectedTags, setSelectedTags] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tags: [],
  });

  const handleFilterTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    const newCustomer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: "",
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    dispatch({ type: "ADD_START" });

    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`Failed to add customer: ${response.status}`);
      }

      const created = await response.json();

      // ADD_CUSTOMER closes the form, clears submitting, and appends the customer in one step
      dispatch({ type: "ADD_CUSTOMER", payload: created });

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        tags: [],
        status: "active",
      });
    } catch (err) {
      dispatch({ type: "ADD_ERROR" });
      alert(`Failed to add customer: ${err.message}`);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    setDeletingId(customerId);

    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }

      dispatch({ type: "DELETE_CUSTOMER", payload: customerId });

      if (selectedId === customerId) {
        setSelectedId(null);
      }
    } catch (err) {
      alert(`Failed to delete customer: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleUpdateCustomer = async (customerId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.status}`);
      }

      const updated = await response.json();

      dispatch({ type: "UPDATE_CUSTOMER", payload: updated });
    } catch (err) {
      alert(`Failed to update customer: ${err.message}`);
    }
  };

  // Helper function to introduction delays to test for loading states
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadCustomers = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        // Introduce delay to simulate loading state
        await sleep(2000);

        // Pass the signal to the fetch request
        const response = await fetch(`${API_BASE}/customers`, { signal });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        // ✅ ENHANCED GUARD: If the signal was aborted by the cleanup function,
        // ignore the error entirely, regardless of what string message the browser throws.
        if (signal.aborted || err.name === "AbortError") {
          console.log("Fetch safely aborted on unmount.");
          return;
        }

        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    loadCustomers();

    // Cleanup function runs when the component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => customer.tags && customer.tags.includes(tag));

    return matchesSearch && matchesStatus && matchesTags;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortField) return 0; // Don't sort if no field is selected

    const comparison = a[sortField].localeCompare(b[sortField]);

    // If direction is descending, invert the sort order
    return sortDirection === "asc" ? comparison : -comparison;
  });

  if (!user) {
    return <LoginPage />;
  }

  if (loading) return <Spinner />;

  if (error) return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="simple-crm">
      <Header />

      <h1>Simple CRM</h1>

      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_FORM" })}
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
            onTagToggle={handleFilterTagToggle}
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
                    onDelete={handleDeleteCustomer}
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

        <CustomerDetail
          selectedId={selectedId}
          onUpdate={handleUpdateCustomer}
        />
      </div>
    </div>
  );
}

export default App;
