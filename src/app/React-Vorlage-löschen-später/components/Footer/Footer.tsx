import styled from 'styled-components';
import PrimaryLink from '../Link/PrimaryLink';
import { MediaQuery } from '../../enums/breakpoint';

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 60px;

  ${MediaQuery.M} {
    margin-top: 0;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <PrimaryLink to="/impressum">Impressum</PrimaryLink>
      <PrimaryLink to="/datenschutz">Datenschutz</PrimaryLink>
    </FooterContainer>
  );
};

export default Footer;
