import { createGlobalStyle } from 'styled-components';

import { Fonts } from './fonts';
import { Main } from './main';
import { Colors } from './colors';
import { Spacing } from './spacing';
import { Icons } from './icons';

const GlobalStyle = createGlobalStyle`
  ${Main}
  ${Fonts}
  ${Colors}
  ${Spacing}
  ${Icons}
`;

export default GlobalStyle;
