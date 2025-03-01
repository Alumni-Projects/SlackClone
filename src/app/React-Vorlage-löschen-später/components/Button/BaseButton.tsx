import styled from 'styled-components';

const BaseButton = styled.button`
  border-radius: var(--border-radius-l);
  border: 2px solid var(--primary-color);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-extra-bold);
  font-size: var(--font-size-m);
  cursor: pointer;
  padding: 12px 25px;
`;

export default BaseButton;
