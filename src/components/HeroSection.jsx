import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
  background-color: #FFFFFF;
  text-align: center;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #8B8D98; 
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroSection = () => {
  return (
    <HeroContainer>
      <Title>Eztudy</Title>
      <Subtitle>Practical self-paced learning platform</Subtitle>
    </HeroContainer>
  );
};

export default HeroSection;