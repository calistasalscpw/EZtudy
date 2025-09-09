import React from 'react';
import SignupForm from '../components/SignupForm';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F9FAFB;
  padding: 2rem;
`;

const SignupPage = () => {
  return (
    <PageContainer>
      <SignupForm />
    </PageContainer>
  );
};

export default SignupPage;