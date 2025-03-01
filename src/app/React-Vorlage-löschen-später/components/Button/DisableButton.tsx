import styled from 'styled-components';
import BaseButton from './BaseButton';

const DisableButton = styled(BaseButton)`
  background-color: var(--grey-dark);
  color: var(--white-color);
  border-color: var(--grey-dark);

  &:hover {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
  }

  &:active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: var(--grey-dark);
    border-color: var(--grey-dark);
    cursor: not-allowed;
  }
`;

export default DisableButton;
