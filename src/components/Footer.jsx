import React from "react";
import styled from "styled-components";

const Footer = () => {

    const currentYear = new Date().getFullYear();

    // --- Style Objects for Cleaner Code ---
    const FooterStyle = styled.div`
        background: #172F5F;
        color: #ffffff;
        padding: 1.5rem 1.5rem;, 
        fontFamily: 'Poppins', sans-serif;
    `;

    const ContainerStyle = styled.div`
        margin: '0 auto' 
    `;

    return(
        <FooterStyle>
            <ContainerStyle>
                <div>
                    <div style={{color: '#ECF2FE', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        <span>© {currentYear} Calista Salsabila CPW. All rights reserved.</span>
                    </div>
                </div>
            </ContainerStyle>
        </FooterStyle>
    )
}

export default Footer;