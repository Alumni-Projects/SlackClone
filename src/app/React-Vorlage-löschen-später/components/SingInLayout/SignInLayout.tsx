import { ReactNode } from 'react';
import styled from 'styled-components';
import Logo from '../Logo/Logo';
import Footer from '../Footer/Footer';
import PrimaryLink from '../Link/PrimaryLink';
import { MediaQuery } from '../../enums/breakpoint';

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;

  ${MediaQuery.M} {
    padding: 50px;
  }
`;

type SignUpTextProps = {
  displayOnMobile: boolean;
};

const SignUpText = styled.div<SignUpTextProps>`
  display: ${(props) => (props.displayOnMobile ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  height: 90px;
  font-size: var(--font-size-m);
  gap: 12px;

  ${MediaQuery.M} {
    display: ${(props) => (props.displayOnMobile ? 'none' : 'flex')};
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-self: normal;
  justify-content: center;
  align-items: center;

  ${MediaQuery.M} {
    justify-content: space-between;
    flex-direction: row;
  }
`;

const ChildWrapper = styled.div`
  flex-direction: column;
  background: var(--white-color);
  box-shadow: 0 2px 10px 0 rgb(0 0 0 / 8%);
  border-radius: var(--border-radius-m);
  display: flex;
  padding: 35px 20px;
  margin: 30px 0;
  max-width: 696px;

  ${MediaQuery.S} {
    padding: 50px;
    max-width: 696px;
    width: -webkit-fill-available;
  }

  ${MediaQuery.M} {
    margin: 15px 0 60px;
  }
`;

type Props = {
  children: ReactNode;
  showSignUp?: boolean;
};

const SignInLayout = (props: Props) => {
  const { children, showSignUp = true } = props;

  return (
    <OuterWrapper>
      <Header>
        <Logo />
        {showSignUp && (
          <SignUpText displayOnMobile={false}>
            Neu bei DABubble?
            <PrimaryLink to="/signup">Konto erstellen</PrimaryLink>
          </SignUpText>
        )}
      </Header>
      <ChildWrapper>{children}</ChildWrapper>
      {showSignUp && (
        <SignUpText displayOnMobile>
          Neu bei DABubble?
          <PrimaryLink to="/signup">Konto erstellen</PrimaryLink>
        </SignUpText>
      )}
      <Footer />
    </OuterWrapper>
  );
};

export default SignInLayout;
