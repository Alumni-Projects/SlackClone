import SignInLayout from '../components/SingInLayout/SignInLayout';
import { IconSize } from '../enums/iconSize';
import UserIcon from '../components/Icon/UserIcon';
import MailIcon from '../components/Icon/MailIcon';
import LockIcon from '../components/Icon/LockIcon';
import SignInSubtitle from '../components/SingInLayout/SignInSubtitle';
import ArrowIcon from '../components/Icon/ArrowIcon';
import PrivacyCheckbox from '../components/Form/PrivacyCheckbox';
import IconLink from '../components/Link/IconLink';
import SignInTitle from '../components/SingInLayout/SignInTitle';
import SignInHeader from '../components/SingInLayout/SignInHeader';
import DisableButton from '../components/Button/DisableButton';
import ButtonBoxEnd from '../components/Button/ButtonBox';
import Input from '../components/Input/Input';
import { Color } from '../enums/color';

const SignUp = () => {
  return (
    <SignInLayout showSignUp={false}>
      <SignInHeader>
        <IconLink to="/">
          <ArrowIcon size={IconSize.Medium} color={Color.Black} />
        </IconLink>
        <SignInTitle>Konto erstellen</SignInTitle>
      </SignInHeader>
      <SignInSubtitle>
        Mit deinem Namen und deiner E-Mail-Adresse hast du dein neues
        DABubble-Konto.
      </SignInSubtitle>

      <Input
        icon={<UserIcon size={IconSize.Medium} color={Color.GreyDark} />}
        type="text"
        id="Name"
        name="Name"
        placeholder="Name und Nachname"
        required
        // value={password}
        // onChange={(e) => setPassword(e.target.value)}
      />

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

      <PrivacyCheckbox></PrivacyCheckbox>
      <ButtonBoxEnd>
        <DisableButton disabled>Weiter</DisableButton>
      </ButtonBoxEnd>
    </SignInLayout>
  );
};

export default SignUp;
