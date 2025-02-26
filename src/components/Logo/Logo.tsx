import styled from 'styled-components';

import logo from '../../assets/logo.svg';

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 90px;
  font-size: 24px;
`;

const StyledLogo = styled.img`
  width: auto;
  padding-right: 20px;
`;

const LogoText = styled.div`
  font-weight: 600;
`;

const Logo = () => (
  <MainWrapper>
    <StyledLogo src={logo} alt="logo" />
    <LogoText>DABubble</LogoText>
  </MainWrapper>
);

export default Logo;
