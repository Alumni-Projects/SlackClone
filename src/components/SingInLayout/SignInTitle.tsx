import styled from 'styled-components';
import { MediaQuery } from '../../enums/breakpoint';

const SignInTitle = styled.h1`
  display: flex;
  justify-content: center;
  text-align: center;
  color: var(--primary-color);
  font-size: var(--font-size-xl);

  ${MediaQuery.M} {
    font-size: var(--font-size-xxl);
  }
`;

export default SignInTitle;
