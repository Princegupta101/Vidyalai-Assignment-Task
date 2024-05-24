const axios = require('axios').default;

/**
 * Fetches all users from the JSONPlaceholder API.
 * @returns {Promise<Array>} An array of user objects.
 * @throws {Error} If an error occurs while fetching users.
 */
async function fetchAllUsers() {
  try {
    const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users');
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
/**
 * Fetches a user by their ID from the JSONPlaceholder API.
 * @param {number} userId The ID of the user to fetch.
 * @returns {Promise<Object>} A user object.
 * @throws {Error} If an error occurs while fetching the user.
 */
async function fetchUserById(userId) {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
}

module.exports = { fetchAllUsers, fetchUserById };