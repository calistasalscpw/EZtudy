import React from 'react';
import styled from 'styled-components';

// Styled components for the Course Card
const CardWrapper = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ImagePlaceholder = styled.div`
  background-color: #A7C6FF; 
  height: 150px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: #8B8D98;
`;

// The reusable CourseCard component
const CourseCard = ({ title, description }) => {
  return (
    <CardWrapper>
      <ImagePlaceholder />
      <ContentWrapper>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </ContentWrapper>
    </CardWrapper>
  );
};

// Styled components for the main section
const CoursesContainer = styled.section`
  padding: 2rem 2rem 4rem 2rem;
  background-color: #F9F9F9;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoursesSection = () => {
  const courses = [
    { title: 'Course 1', description: 'Description for the first course.' },
    { title: 'Course 2', description: 'Description for the second course.' },
    { title: 'Course 3', description: 'Description for the third course.' },
  ];

  return (
    <CoursesContainer>
      <SectionTitle>Courses</SectionTitle>
      <Grid>
        {courses.map((course, index) => (
          <CourseCard key={index} title={course.title} description={course.description} />
        ))}
      </Grid>
    </CoursesContainer>
  );
};

export default CoursesSection;