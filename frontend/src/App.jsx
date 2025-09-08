import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Home from './pages/Home';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import { Layout } from 'antd';
const { Content } = Layout;


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Layout style={{ minHeight: '100vh', background: '#fcfdfe' }}>
        <Navbar/>
        <Content style={{ 
          padding: '0',
          minHeight: '100vh',
          background: ''
        }}>
          <Routes>
            {/* Public Routes */}
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
            
            {/* Protected Routes */}
            <Route path='/' element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }/>
            <Route path="/course/:courseId" element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            }/>
          </Routes>
        </Content>
        <Footer/>
      </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
