import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from 'antd';
const { Content } = Layout;


function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh', background: '#0f0c2a' }}>
        <Content style={{ 
          marginTop: 64,
          padding: '24px',
          minHeight: '100vh',
          background: ''
        }}>
          <Routes>
            <Route path='/' element={<Home/>}/>
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
