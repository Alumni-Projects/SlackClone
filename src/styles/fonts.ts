import { css } from 'styled-components';

export const Fonts = css`
  @font-face {
    font-family: Nunito;
    src: url('./fonts/Nunito-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    color: var(--primary-color);
  }

  :root {
    --font-size-title-default: 24px;
    --font-size-s: 16px;
    --font-size-m: 18px;
    --font-size-l: 20px;
    --font-size-xl: 32px;
    --font-size-xxl: 46px;
    --font-weight-normal: 400;
    --font-weight-bold: 500;
    --font-weight-extra-bold: 700;
    --font-primary: font-family: 'Nunito';
  }
`;
