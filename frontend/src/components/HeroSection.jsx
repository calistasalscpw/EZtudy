import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroContainer = styled.section`
  background: linear-gradient(135deg, #4389A2, #5C258D);
  text-align: center;
  padding: 6rem 2rem;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.8s ease-out forwards;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  max-width: 650px;
  margin: 0 auto 2rem auto;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 0.3s forwards;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StyledButton = styled(Button)`
  height: 50px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0 2rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 0.6s forwards;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: white !important;
    color: white !important;
  }
`;

const HeroSection = () => {
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <HeroContainer>
      <Title>Eztudy</Title>
      <Subtitle>Dive into a world of knowledge with our curated courses. Learn at your own pace, anytime, anywhere. Your journey to mastery starts here.</Subtitle>
      <StyledButton type="primary" size="large" onClick={scrollToCourses}>
        Explore Courses
      </StyledButton>
    </HeroContainer>
  );
};

export default HeroSection;