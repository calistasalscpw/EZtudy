import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

// --- Styled Components ---

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
  
  background-color: ${props => props.$isScrolled ? 'rgba(240, 245, 255, 0.8)' : 'transparent'};
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

// --- Navbar Component ---

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Effect for scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <Header $isScrolled={isScrolled}>
            <NavContainer $isScrolled={isScrolled}>
                <Logo to="/">Eztudy</Logo>
                <NavLinks>
                    <StyledLink to="/login">Login</StyledLink>
                    <StyledLink to="/signup">Signup</StyledLink>
                </NavLinks>
                <Hamburger onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen 
                        ? <CloseOutlined style={{ fontSize: '24px', color: '#2E5A99' }} /> 
                        : <MenuOutlined style={{ fontSize: '24px', color: '#2E5A99' }} />
                    }
                </Hamburger>
            </NavContainer>
            <MobileMenu $isOpen={isMobileMenuOpen}>
                <StyledLink to="/login" onClick={handleLinkClick}>Login</StyledLink>
                <StyledLink to="/signup" onClick={handleLinkClick}>Signup</StyledLink>
            </MobileMenu>
        </Header>
    );
};

export default Navbar;