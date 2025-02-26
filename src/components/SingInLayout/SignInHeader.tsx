import styled from 'styled-components';
import { MediaQuery } from '../../enums/breakpoint';

const SignInHeader = styled.div`
  display: flex;
  margin-bottom: 15px;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${MediaQuery.M} {
    margin-bottom: 30px;
    gap: 0;
  }

  a {
    position: relative;
    left: 0;
    ${MediaQuery.S} {
      position: absolute;
    }
  }
`;

export default SignInHeader;
