import React from 'react';
import styled from 'styled-components';
import avatar1 from '../../assets/avatar/avatar1.svg';
import avatar2 from '../../assets/avatar/avatar2.svg';
import avatar3 from '../../assets/avatar/avatar3.svg';
import avatar4 from '../../assets/avatar/avatar4.svg';
import avatar5 from '../../assets/avatar/avatar5.svg';
import avatar6 from '../../assets/avatar/avatar6.svg';
import { MediaQuery } from '../../enums/breakpoint';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const AvatarImage = styled.img`
  width: 56px;
  height: 56px;
  cursor: pointer;
  border-radius: var(--border-radius-xl);
  ${MediaQuery.M} {
    width: 64px;
    height: 64px;
  }
`;

const AvatarImagesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow-x: auto;
  margin-bottom: 32px;
  ${MediaQuery.M} {
    justify-content: space-between;
  }
`;

const AvatarImages = () => {
  return (
    <AvatarImagesContainer>
      {avatars.map((avatar, index) => (
        <AvatarImage key={index} src={avatar} alt={`Avatar ${index + 1}`} />
      ))}
    </AvatarImagesContainer>
  );
};

export default AvatarImages;
