import styled from 'styled-components';
import { MediaQuery } from '../../enums/breakpoint';

const SignInSubtitle = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: var(--font-size-l);
  ${MediaQuery.M} {
    margin-bottom: 46px;
  }
`;

export default SignInSubtitle;
