const axios = require('axios').default;

/**
 * Fetches posts from a remote API.
 * @async
 * @param {Object} [params] - The parameters for fetching posts.
 * @param {number} [params.start=0] - The start index of posts to fetch.
 * @param {number} [params.limit=10] - The maximum number of posts to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
async function fetchPosts({ start = 0, limit = 10 } = {}) {
  try {
    // Fetch posts
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      params: { _start: start, _limit: limit },
    });

    // Fetch user information for all posts in parallel
    const userIds = [...new Set(posts.map(post => post.userId))];
    const usersResponse = await Promise.all(
      userIds.map(userId => axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`))
    );
    const usersMap = new Map(usersResponse.map(response => [response.data.id, response.data]));

    // Fetch images for all posts in parallel
    const photosResponse = await Promise.all(
      posts.map(post => axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`))
    );

    // Map photos to posts
    const postsWithInfo = posts.map((post, index) => ({
      ...post,
      user: {
        name: usersMap.get(post.userId).name,
        email: usersMap.get(post.userId).email,
      },
      images: photosResponse[index].data.slice(0, 3).map(photo => ({ url: photo.url })),
    }));

    return postsWithInfo;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

module.exports = { fetchPosts };