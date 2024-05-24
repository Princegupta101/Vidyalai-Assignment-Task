import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Oval } from 'react-loader-spinner'; 

import styled from '@emotion/styled';

import { WindowWidthContext } from '../../context/WindowWidth';
import Container from '../common/Container';
import Post from './Post';

// Styled components for styling
const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const LoaderContainer = styled.div(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);  // State for posts
  const [isLoading, setIsLoading] = useState(false);  // State for loading status
  const [startNumber, setStartNumber] = useState(0);  // State for pagination
  const { isSmallerDevice } = useContext(WindowWidthContext);  // Context for window width

  // Fetch posts from API based on window width
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);  // Start loading
      const { data: posts } = await axios.get('/api/v1/posts', {
        params: { start: 0, limit: isSmallerDevice ? 5 : 10 },
      });
      setPosts(posts);
      setIsLoading(false);  // Stop loading
    };

    fetchPost();
  }, [isSmallerDevice]);

  // Load more posts on button click
  const handleClick = async () => {
    setIsLoading(true);  // Start loading
    const { data: posts } = await axios.get('/api/v1/posts', {
      params: { start: isSmallerDevice ? startNumber + 5 : startNumber + 10, limit: isSmallerDevice ? 5 : 10 },
    });

    setPosts((prev) => [...prev, ...posts]);
    setStartNumber((prev) => (isSmallerDevice ? prev + 5 : prev + 10));
    setIsLoading(false);  // Stop loading
  };

  return (
    <Container>
      {isLoading && posts.length === 0 ? (  // Show loader if initial loading
        <LoaderContainer>
          <Oval height={80} width={80} color={"#007bff"} secondaryColor={"#0056b3"} strokeWidth={2} />
        </LoaderContainer>
      ) : (
        <>
          <PostListContainer>
            {posts.map((post, index) => (
              <Post key={`${post.id}-${index}`} post={post} />
            ))}
          </PostListContainer>

          {posts.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LoadMoreButton onClick={handleClick} disabled={isLoading}>
                {!isLoading ? 'Load More' : 'Loading...'}
              </LoadMoreButton>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
