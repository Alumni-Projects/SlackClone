import styled from 'styled-components';
import ArrowIcon from '../components/Icon/ArrowIcon';
import MailIcon from '../components/Icon/MailIcon';
import IconLink from '../components/Link/IconLink';
import SignInHeader from '../components/SingInLayout/SignInHeader';
import SignInLayout from '../components/SingInLayout/SignInLayout';
import SignInSubtitle from '../components/SingInLayout/SignInSubtitle';
import SignInTitle from '../components/SingInLayout/SignInTitle';
import { MediaQuery } from '../enums/breakpoint';
import { IconSize } from '../enums/iconSize';
import DisableButton from '../components/Button/DisableButton';
import ButtonBoxEnd from '../components/Button/ButtonBox';
import { Link } from 'react-router-dom';
import Input from '../components/Input/Input';
import { Color } from '../enums/color';

const PrimaryPaddingDiv = styled.div`
  padding: 0;
  ${MediaQuery.M} {
    padding: 0 106px;
  }
`;

const PSWResetText = styled.div`
  color: var(--grey-dark);
  font-size: var(--font-size-l);
  text-align: center;
`;

const PasswordReset = () => {
  return (
    <SignInLayout showSignUp={false}>
      <SignInHeader>
        <IconLink to="/">
          <ArrowIcon size={IconSize.Medium} color={Color.Black} />
        </IconLink>
        <SignInTitle>Passwort zurücksetzen</SignInTitle>
      </SignInHeader>
      <SignInSubtitle>Bitte geben Sie Ihre E-Mail-Adresse ein.</SignInSubtitle>
      <PrimaryPaddingDiv>
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

        <PSWResetText>
          Wir senden Ihnen eine E-Mail, über die Sie Ihr Passwort ändern können.
        </PSWResetText>
        <ButtonBoxEnd>
          <Link to="/pwchange">
            <DisableButton disabled={true}>Weiter</DisableButton>
          </Link>
        </ButtonBoxEnd>
      </PrimaryPaddingDiv>
    </SignInLayout>
  );
};

export default PasswordReset;
