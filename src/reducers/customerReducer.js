// src/reducers/customerReducer.js

export const initialState = {
  customers: [],
  listLoading: false, // For main customer list spinner
  adding: false, // For new customer form submitting
  deletingId: null, // For specific customer id being deleted
  error: null,
  showForm: false,
  deletingCustomer: null, // For optimistic delete
};

export function customerReducer(state, action) {
  switch (action.type) {
    case "LIST_FETCH_START":
      return { ...state, listLoading: true, error: null };

    case "LIST_FETCH_SUCCESS":
      return { ...state, listLoading: false, customers: action.payload };

    case "FETCH_ERROR":
      return {
        ...state,
        listLoading: false,
        adding: false,
        deletingId: null,
        error: action.payload,
      };

    case "ADD_START":
      return { ...state, adding: true, error: null };

    case "ADD_SUCCESS":
      return {
        ...state,
        adding: false,
        showForm: false, // Automatically hide form on success
        customers: [...state.customers, action.payload],
      };

    case "DELETE_START":
      return {
        ...state,
        deletingId: action.payload.id, // Store the id of the specific customer
        error: null,
        deletingCustomer: action.payload, // Store the customer in the event of a rollback
      };

    case "DELETE_SUCCESS":
      return {
        ...state,
        deletingId: null, // Clear the deletion flag
        customers: state.customers.filter((c) => c.id !== action.payload),
      };

    case "TOGGLE_FORM":
      return { ...state, showForm: !state.showForm };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };

    case "RESTORE_CUSTOMER":
      return {
        ...state,
        error: null,
        deletingId: null, // Clear the deletion flag
        customers: [...state.customers, state.deletingCustomer],
        deletingCustomer: null,
      };

    default:
      return state;
  }
}
