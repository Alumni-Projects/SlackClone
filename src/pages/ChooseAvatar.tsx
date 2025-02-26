import styled from 'styled-components';
import SignInLayout from '../components/SingInLayout/SignInLayout';
import { IconSize } from '../enums/iconSize';
import ArrowIcon from '../components/Icon/ArrowIcon';
import IconLink from '../components/Link/IconLink';
import SignInTitle from '../components/SingInLayout/SignInTitle';
import SignInHeader from '../components/SingInLayout/SignInHeader';
import DisableButton from '../components/Button/DisableButton';
import ButtonBoxEnd from '../components/Button/ButtonBox';
import avatar0 from '../assets/avatar/avatar0.svg';
import AvatarImages from '../components/Avatar/AvatarImages';
import SecondaryButton from '../components/Button/SecondaryButton';
import { MediaQuery } from '../enums/breakpoint';
import { Color } from '../enums/color';

const ChooseImageElement = styled.img`
  width: 100px;
  height: 100px;
  margin: 10px;
  cursor: pointer;
  border-radius: var(--border-radius-xl);
`;

const UserName = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--black-color);
  font-weight: var(--font-weight-extra-bold);
  text-align: center;
`;

const AvatarSubText = styled.p`
  font-size: var(--font-size-l);
  text-align: center;
  margin-bottom: 16px;
  margin-top: 8px;
  ${MediaQuery.XS} {
    text-align: left;
  }
`;

const AvatarUploadDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${MediaQuery.XS} {
    flex-direction: row;
  }
`;
const ChooseAvatar = () => {
  return (
    <SignInLayout showSignUp={false}>
      <SignInHeader>
        <IconLink to="/">
          <ArrowIcon size={IconSize.Medium} color={Color.Black} />
        </IconLink>
        <SignInTitle>Wähle deinen Avatar</SignInTitle>
      </SignInHeader>
      <div
        style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}
      >
        <ChooseImageElement src={avatar0} alt="Default Avatar" />
      </div>
      <UserName>Frederik Beck</UserName>
      <AvatarSubText>Aus der Liste wählen</AvatarSubText>
      <AvatarImages></AvatarImages>
      <AvatarUploadDiv>
        <AvatarSubText>eigenes Bild verwenden</AvatarSubText>
        <SecondaryButton>Datei hochladen</SecondaryButton>
      </AvatarUploadDiv>

      <ButtonBoxEnd>
        <DisableButton disabled>Weiter</DisableButton>
      </ButtonBoxEnd>
    </SignInLayout>
  );
};

export default ChooseAvatar;
