import SignInLayout from '../components/SingInLayout/SignInLayout';
import styled from 'styled-components';
import googleLogo from '../assets/google.svg';
import LockIcon from '../components/Icon/LockIcon';
import MailIcon from '../components/Icon/MailIcon';
import { IconSize } from '../enums/iconSize';
import PrimaryButton from '../components/Button/PrimaryButton';
import SecondaryButton from '../components/Button/SecondaryButton';
import SignInTitle from '../components/SingInLayout/SignInTitle';
import SignInSubtitle from '../components/SingInLayout/SignInSubtitle';
import { MediaQuery } from '../enums/breakpoint';
import SecondaryLink from '../components/Link/SecondaryLink';
import SignInHeader from '../components/SingInLayout/SignInHeader';
import Input from '../components/Input/Input';
import { Color } from '../enums/color';

const LinkPosition = styled.div`
  text-align: center;
`;

type ButtonDivProps = {
  displayOnMobile: boolean; // TODO ich glaube das brauchen wir nicht, da die Component bisher eh nur mit displayOnMobile = false genutzt wird, oder?
};

const ButtonDiv = styled.div<ButtonDivProps>`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-direction: ${(props) => (props.displayOnMobile ? 'row' : 'column')};
  ${MediaQuery.XS} {
    flex-direction: ${(props) => (props.displayOnMobile ? 'column' : 'row')};
  }
`;

const OptionalLogin = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  margin: 20px 0;
  text-transform: uppercase;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--light-purple);
    margin: 0 10px;
  }

  span {
    white-space: nowrap;
    font-size: var(--font-size-m);
    color: var(--black-color);
  }
`;

const PaddedSecondaryLink = styled(SecondaryLink)`
  padding: 8px 12px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--bg-color);
  color: var(--primary-color);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-normal);
  padding: 12px 20px;
  border: 1px solid var(--bg-color);
  width: 100%;
  border-radius: var(--border-radius-l);
  cursor: pointer;
  margin: 43px 0;
  transition:
    background-color 0.3s,
    font-weight 0.2s,
    border 0.2s;

  &:hover {
    border: 1px solid var(--primary-color);
    font-weight: var(--font-weight-extra-bold);
    transform: scale(1.02);
    transform-origin: center;
  }

  img {
    margin-right: 10px;
    width: 36px;
    height: auto;
  }
`;

const SignIn = () => {
  return (
    <SignInLayout>
      <SignInHeader>
        <SignInTitle>Anmeldung</SignInTitle>
      </SignInHeader>
      <SignInSubtitle>
        Wir empfehlen dir, die E-Mail-Adresse zu nutzen, die du bei der Arbeit
        verwendest.
      </SignInSubtitle>

      <form /* onSubmit={handleSubmit} */>
        <Input
          icon={<MailIcon size={IconSize.Medium} color={Color.GreyDark} />}
          type="email"
          id="email"
          name="email"
          placeholder="beispielname@email.com"
          required
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          icon={<LockIcon size={IconSize.Medium} color={Color.GreyDark} />}
          type="password"
          id="password"
          name="password"
          placeholder="Passwort"
          required
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
        />
        <LinkPosition>
          <PaddedSecondaryLink to="/pwreset">
            Passwort vergessen?
          </PaddedSecondaryLink>
        </LinkPosition>
        <OptionalLogin>oder</OptionalLogin>

        <GoogleButton>
          <img src={googleLogo} alt="Google Logo" />
          Anmelden mit Google
        </GoogleButton>

        <ButtonDiv displayOnMobile={false}>
          <PrimaryButton>Anmelden</PrimaryButton>
          <SecondaryButton type="submit">Gäste-Login</SecondaryButton>
        </ButtonDiv>
      </form>
    </SignInLayout>
  );
};

export default SignIn;
