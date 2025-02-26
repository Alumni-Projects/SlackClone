import styled from 'styled-components';
import BaseButton from './BaseButton';

const PrimaryButton = styled(BaseButton)`
  background-color: var(--primary-color);
  color: var(--white-color);

  &:hover {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
  }

  &:active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;

export default PrimaryButton;
