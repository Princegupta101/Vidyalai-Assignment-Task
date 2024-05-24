import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import styled from '@emotion/styled';

// Styled components for UI elements
const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const AuthorDetails = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
}));

const ProfileImage = styled.img(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px',
}));

const AuthorNameWrapper = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const AuthorName = styled.span(() => ({
  fontWeight: 'bold',
}));

const AuthorEmail = styled.span(() => ({
  color: '#888',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
  overflow: 'hidden',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
}));

const PrevButton = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  left: '10px',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const NextButton = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  right: '10px',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

// Function to generate profile image URL based on user's name
const generateProfileImageUrl = name => `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;

const Post = ({ post }) => {

  // Reference to the carousel element
  const carouselRef = useRef(null);

  // Event handler for scrolling to the next image
  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <PostContainer>
      <AuthorDetails>
        <ProfileImage src={generateProfileImageUrl(post.user.name)} alt={post.user.name} />
        <AuthorNameWrapper>
          <AuthorName>{post.user.name}</AuthorName>
          <AuthorEmail>{post.user.email}</AuthorEmail>
        </AuthorNameWrapper>
      </AuthorDetails>
      <CarouselContainer>
        <Carousel ref={carouselRef}>

         {/* Mapping through post images and rendering them as carousel items */}
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        
          {/* Previous and Next buttons for carousel navigation */}
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

// PropTypes for type-checking props
Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Post;