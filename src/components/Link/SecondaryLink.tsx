import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SecondaryLink = styled(Link)`
  text-align: center;
  text-decoration: none;
  color: var(--secondary-color);
  font-size: var(--font-size-m);
  transition: all 0.3s ease;

  &:hover {
    font-weight: var(--font-weight-bold);
    background-color: var(--bg-color);
    border-radius: var(--border-radius-xl);
    color: var(--primary-color);
  }
`;

export default SecondaryLink;
