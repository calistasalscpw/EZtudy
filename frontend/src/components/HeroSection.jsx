import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
  background: linear-gradient(to left, #CDE0FF, #4C75C4);
  text-align: center;
  padding: 4rem 2rem;
  min-height: calc(90vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #FCFDFE; 
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
      <Subtitle>Practical self-paced learning platform for students</Subtitle>
    </HeroContainer>
  );
};

export default HeroSection;