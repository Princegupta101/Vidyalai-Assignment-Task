const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios = require('axios')

const router = express.Router();
/**
 * Route handler to fetch posts with dummy images.
 * @name GET /api/v1/posts
 * @function
 * @memberof module:postsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();
    
    // Fetch posts with user data and images
    const postsWithUser = await Promise.all(posts.map(async post => {
        try {
            const photosRes = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
            const userData = await fetchUserById(post.userId);
            return {
                ...post,
                images: photosRes.data,
                user: userData
            };
        } catch (err) {
            console.log(`Error fetching data for post ${post.id}:`, err.message);
            return {
                ...post,
                images: []
            };
        }
    }));

    res.json(postsWithUser);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;