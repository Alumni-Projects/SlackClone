import styled from 'styled-components';
import { IconSize } from '../enums/iconSize';
import CloseIcon from '../components/Icon/CloseIcon';
import avatar2 from '../assets/avatar/avatar2.svg';
import IconLink from '../components/Link/IconLink';
import HeaderTitle from '../components/Title/HeaderTitle';
import ProfileUserTitle from '../components/Title/ProfileUserTitle';
import MailIcon from '../components/Icon/MailIcon';
import PrimaryButton from '../components/Button/PrimaryButton';
import ChatIcon from '../components/Icon/ChatIcon';
import { MediaQuery } from '../enums/breakpoint';
import { Color } from '../enums/color';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileContainerInner = styled.div`
  flex-direction: column;
  background: var(--white-color);
  box-shadow: 0 2px 10px 0 rgb(0 0 0 / 8%);
  border-radius: var(--border-radius-m);
  display: flex;
  padding: 20px;
  margin: 30px 0;
  max-width: 300px;

  ${MediaQuery.M} {
    min-width: 500px;
    padding: 40px;
  }
`;

const ProfileSpace = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileDivStart = styled.div`
  display: flex;
  justify-content: start;
  gap: 15px;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 45px;
  }
`;

const ProfileStatus = styled.span`
  width: 16px;
  height: 16px;
  background-color: var(--online-green);
  border-radius: var(--border-radius-xl);
  display: flex;
  color: var(--online-green);
`;

const ProfileEmailTitle = styled.p`
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-extra-bold);
`;

const ProfileStatusText = styled.p`
  font-size: var(--font-size-l);
  color: var(--online-green);
`;

const ProfileImg = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;

  img {
    width: 200px;
  }
`;

const FlexDiv = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;
const ButtonIconCenter = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ProfileMailAdress = styled.div`
  font-size: var(--font-size-m);
  color: var(--mail-blue);
  margin-left: 45px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Dummy = () => {
  return (
    <ProfileContainer>
      <ProfileContainerInner>
        <ProfileSpace>
          <HeaderTitle>Profil</HeaderTitle>
          <IconLink to="/">
            <CloseIcon size={IconSize.Medium} color={Color.GreyDark} />
          </IconLink>
        </ProfileSpace>
        <ProfileImg>
          <img src={avatar2} alt="Default Avatar" />
        </ProfileImg>
        <ProfileUserTitle>Steffen Hoffmann</ProfileUserTitle>
        <ProfileDivStart>
          <FlexDiv>
            <ProfileStatus></ProfileStatus>
            <ProfileStatusText>Aktiv</ProfileStatusText>
          </FlexDiv>
        </ProfileDivStart>
        <ProfileDivStart>
          <FlexDiv>
            <MailIcon size={IconSize.Medium} color={Color.GreyDark} />
            <ProfileEmailTitle>E-Mail-Adresse</ProfileEmailTitle>
          </FlexDiv>
          <ProfileMailAdress>thehoffman@beispiel.com</ProfileMailAdress>
        </ProfileDivStart>
        <ButtonWrapper>
          <PrimaryButton>
            <ButtonIconCenter>
              <ChatIcon size={IconSize.Medium} color={Color.White} />
              Nachricht
            </ButtonIconCenter>
          </PrimaryButton>{' '}
          {}
        </ButtonWrapper>
      </ProfileContainerInner>
    </ProfileContainer>
  );
};

export default Dummy;
