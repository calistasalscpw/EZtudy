import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const { Title, Text, Link } = Typography;

const FormContainer = styled.div`
  background-color: #FFFFFF;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(to right, #4C75C4, #80A8F1);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
   &:hover {
    background: linear-gradient(to right, #4C75C4, #80A8F1);
    opacity: 0.9;
  }
`;

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signup(values);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2} style={{ color: '#2E5A99' }}>Create Your Account</Title>
        <Text type="secondary">Start your learning adventure with EZtudy.</Text>
      </div>
      <Form name="signup" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, type: 'email', message: "Please input a valid email!" }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <StyledButton type="primary" htmlType="submit" loading={loading} block>
            Sign Up
          </StyledButton>
        </Form.Item>
        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          Already have an account? <Link href="/login">Login here!</Link>
        </Text>
      </Form>
    </FormContainer>
  );
};

export default SignupForm;