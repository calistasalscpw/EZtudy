import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #EAEAEA;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 1rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLink = styled.a`
  color: #8B8D98; /* Gray from palette */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #333;
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  
  div {
    width: 25px;
    height: 3px;
    background-color: #333;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 60px; /* Adjust based on navbar height */
  left: 0;
  width: 100%;
  background-color: #FFFFFF;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  /* Use props for conditional rendering */
  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(-120%)')};
  transition: transform 0.3s ease-in-out;
  
  a {
    padding: 1rem 2rem;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NavContainer>
        <Logo>Eztudy</Logo>
        <NavLinks>
          <StyledLink href="/login">Login</StyledLink>
          <StyledLink href="/signup">Signup</StyledLink>
        </NavLinks>
        <Hamburger onClick={() => setIsOpen(!isOpen)}>
          <div />
          <div />
          <div />
        </Hamburger>
      </NavContainer>
      <MobileMenu $isOpen={isOpen}>
        <StyledLink href="/login">Login</StyledLink>
        <StyledLink href="/signup">Signup</StyledLink>
      </MobileMenu>
    </>
  );
};

export default Navbar;