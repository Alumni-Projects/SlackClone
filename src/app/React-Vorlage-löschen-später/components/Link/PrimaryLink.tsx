import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PrimaryLink = styled(Link)`
  display: inline-block;
  padding: 8px 16px;
  color: var(--secondary-color);
  border: 1px solid transparent;
  text-decoration: none;
  text-align: center;
  background: transparent;
  border-radius: var(--border-radius-l);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: var(--secondary-color);
    transform: scale(1.05);
    font-weight: var(--font-weight-bold);
  }
`;

export default PrimaryLink;
