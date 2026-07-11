// src/contexts/CustomerContext.jsx
import { useReducer, useState, useEffect } from "react";

import { CustomerContext } from "./CustomerContextInstance";
import { customerReducer, initialState } from "../reducers/customerReducer";

import { API_BASE } from "../App";

export function CustomerProvider({ children }) {
  // Coupled state — managed by the reducer
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const { customers, listLoading, adding, deletingId, error, showForm } = state;

  // Independent UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"
  const [selectedTags, setSelectedTags] = useState([]);

  // Helper function to introduction delays to test for loading states
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const filterTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const toggleForm = () => dispatch({ type: "TOGGLE_FORM" });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadCustomers = async () => {
      dispatch({ type: "LIST_FETCH_START" });
      try {
        // Introduce delay to simulate loading state
        await sleep(2000);

        // Pass the signal to the fetch request
        const response = await fetch(`${API_BASE}/customers`, { signal });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();

        dispatch({ type: "LIST_FETCH_SUCCESS", payload: data });
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

  const addCustomer = async (customerData) => {
    dispatch({ type: "ADD_START" });
    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!response.ok)
        throw new Error(`Failed to add customer: ${response.status}`);

      const created = await response.json();

      dispatch({ type: "ADD_SUCCESS", payload: created });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR" });
      alert(`Failed to add customer: ${err.message}`);
    }
  };

  const updateCustomer = async (customerId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok)
        throw new Error(`Failed to update customer: ${response.status}`);

      const updated = await response.json();

      dispatch({ type: "UPDATE_SUCCESS", payload: updated });
    } catch (err) {
      //alert(`Failed to update customer: ${err.message}`);
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  };

  const deleteCustomer = async (customer) => {
    console.log("in deleteCustomer: ", customer);

    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      dispatch({ type: "DELETE_START", payload: customer });

      // Perform an optimistic delete
      dispatch({ type: "DELETE_SUCCESS", payload: customer.id });

      await sleep(2000);

      // Simulate network error
      //throw new Error("Network error");

      const response = await fetch(`${API_BASE}/customers/${customer.id}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw new Error(`Failed to delete customer: ${response.status}`);

      dispatch({ type: "DELETE_SUCCESS", payload: customer.id });

      if (selectedId === customer.id) setSelectedId(null);
    } catch (err) {
      alert(`Failed to delete customer: ${err.message}`);

      // Restore customer in the event of failure
      dispatch({ type: "RESTORE_CUSTOMER", payload: customer });
    }
  };

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

  return (
    <CustomerContext.Provider
      value={{
        customers,
        filteredCustomers,
        sortedCustomers,

        listLoading,
        adding,
        deletingId,

        error,
        showForm,

        searchTerm,
        statusFilter,
        sortField,
        sortDirection,

        selectedId,
        selectedTags,

        addCustomer,
        updateCustomer,
        deleteCustomer,

        toggleForm,
        filterTagToggle,

        setSearchTerm,
        setStatusFilter,
        setSortField,
        setSortDirection,

        setSelectedId,
        setSelectedTags,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
