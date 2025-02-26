import { Link } from 'react-router-dom';
import styled from 'styled-components';

const IconLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 40px;
  width: 40px;

  &:hover {
    background: var(--bg-color);
  }

  &:hover svg {
    fill: var(--purple-3);
  }
`;

export default IconLink;
