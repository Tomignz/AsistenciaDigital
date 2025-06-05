// frontend/src/utils/api.js

/**
 * Performs a fetch request, automatically adding the JWT token to the Authorization header
 * if available in localStorage.
 *
 * @param {string} url The URL to fetch.
 * @param {object} options The options for the fetch request (method, headers, body, etc.).
 * @returns {Promise<Response>} The promise returned by fetch.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  // Ensure headers object exists
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is an object, stringify it and set Content-Type if not already set
  let body = options.body;
  if (typeof body === 'object' && body !== null && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const newOptions = {
    ...options,
    headers,
    body,
  };

  const finalUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
  return fetch(finalUrl, newOptions);
};

// Example of a GET request using authenticatedFetch
// export const getProtectedData = async () => {
//   const response = await authenticatedFetch('/api/protected-resource');
//   if (!response.ok) {
//     // Handle error, e.g., redirect to login if 401, or throw an error
//     if (response.status === 401) {
//       // Potentially clear token and redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('username');
//       localStorage.removeItem('userRole');
//       window.location.href = '/login'; // Or use useNavigate if in a component context
//     }
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return response.json();
// };

// Example of a POST request using authenticatedFetch
// export const postProtectedData = async (data) => {
//   const response = await authenticatedFetch('/api/another-protected-resource', {
//     method: 'POST',
//     body: data, // Will be stringified by authenticatedFetch if it's an object
//   });
//   if (!response.ok) {
//     // Handle error
//     if (response.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('username');
//       localStorage.removeItem('userRole');
//       window.location.href = '/login';
//     }
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return response.json();
// };
