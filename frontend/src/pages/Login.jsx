import React from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F9FAFB;
  padding: 2rem;
`;

const Login = () => {
  return (
    <PageContainer>
      <LoginForm />
    </PageContainer>
  );
};

export default Login;