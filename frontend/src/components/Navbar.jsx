import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MenuOutlined, CloseOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { Dropdown, Avatar, Space } from 'antd';

// --- Styled Components ---

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
  
  background-color: ${props => props.$isScrolled ? 'rgba(240, 245, 255, 0.8)' : '#f6f9ff77'};
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.$isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none'};
`;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.$isScrolled ? 'transparent' : '#EAEAEA'};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2E5A99; 
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 1rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  color: #8B8D98; 
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #2E5A99; 
  }
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-height: ${props => (props.$isOpen ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
  
  a {
    padding: 1rem 2rem;
    border-bottom: 1px solid #EAEAEA;
    text-align: center;
  }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #8B8D98;
    font-weight: 500;
    font-size: 1rem;
    font-family: inherit;
     &:hover {
        color: #2E5A99;
    }
`;

// --- Navbar Component ---

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const menuItems = [
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: logout,
        },
    ];

    return (
        <Header $isScrolled={isScrolled}>
            <NavContainer $isScrolled={isScrolled}>
                <Logo to="/">Eztudy</Logo>
                <NavLinks>
                    {user ? (
                        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space style={{cursor: 'pointer'}}>
                                    <Avatar style={{ backgroundColor: '#4C75C4' }} icon={<UserOutlined />} />
                                    <span style={{color: '#333'}}>{user.username}</span>
                                </Space>
                            </a>
                        </Dropdown>
                    ) : (
                        <>
                            <StyledLink to="/auth/login">Login</StyledLink>
                            <StyledLink to="/auth/signup">Signup</StyledLink>
                        </>
                    )}
                </NavLinks>
                <Hamburger onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen 
                        ? <CloseOutlined style={{ fontSize: '24px', color: '#2E5A99' }} /> 
                        : <MenuOutlined style={{ fontSize: '24px', color: '#2E5A99' }} />
                    }
                </Hamburger>
            </NavContainer>
            <MobileMenu $isOpen={isMobileMenuOpen}>
                 {user ? (
                    <LogoutButton onClick={() => { handleLinkClick(); logout(); }}>Logout</LogoutButton>
                ) : (
                    <>
                        <StyledLink to="/auth/login" onClick={handleLinkClick}>Login</StyledLink>
                        <StyledLink to="/auth/signup" onClick={handleLinkClick}>Signup</StyledLink>
                    </>
                )}
            </MobileMenu>
        </Header>
    );
};

export default Navbar;