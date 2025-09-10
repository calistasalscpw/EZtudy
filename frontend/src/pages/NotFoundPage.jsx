import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Result } from 'antd';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 130px); 
  background-color: #F9FAFB;
  padding: 2rem;
`;

const GradientButton = styled(Button)`
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(to right, #6a82ea, #7d53a9);
    color: white !important;
  }
`;

const NotFoundPage = () => {
  return (
    <PageContainer>
        <Result
            status="404"
            title="404 - Page Not Found"
            subTitle="Sorry, the page you are looking for does not exist."
            extra={
                <Link to="/">
                    <GradientButton type="primary" size="large">
                        Back to Home
                    </GradientButton>
                </Link>
            }
        />
    </PageContainer>
  );
};

export default NotFoundPage;
