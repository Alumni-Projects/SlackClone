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
import Input from '../components/Input/Input';
import { Color } from '../enums/color';

const PrimarayPaddingDiv = styled.div`
  padding: 0;
  ${MediaQuery.M} {
    padding: 0 106px;
  }
`;
const PasswordChange = () => {
  return (
    <SignInLayout showSignUp={false}>
      <SignInHeader>
        <IconLink to="/pwreset">
          <ArrowIcon size={IconSize.Medium} color={Color.Black} />
        </IconLink>
        <SignInTitle>Passwort zurücksetzen</SignInTitle>
      </SignInHeader>
      <SignInSubtitle>Bitte geben Sie Ihre E-Mail-Adresse ein.</SignInSubtitle>
      <PrimarayPaddingDiv>
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

        <ButtonBoxEnd>
          <DisableButton disabled>Weiter</DisableButton>
        </ButtonBoxEnd>
      </PrimarayPaddingDiv>
    </SignInLayout>
  );
};

export default PasswordChange;
