import styled from 'styled-components';
import BaseButton from './BaseButton';

const SecondaryButton = styled(BaseButton)`
  background-color: var(--white-color);
  color: var(--primary-color);

  &:hover {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    color: var(--white-color);
  }

  &:active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;

export default SecondaryButton;
