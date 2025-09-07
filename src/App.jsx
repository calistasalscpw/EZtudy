import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { Layout } from 'antd';
const { Content } = Layout;


function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh', background: '#fcfdfe' }}>
        <Navbar/>
        <Content style={{ 
          padding: '0',
          minHeight: '100vh',
          background: ''
        }}>
          <Routes>
            <Route path='/' element={<Home/>}/>
          </Routes>
        </Content>
        <Footer/>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
