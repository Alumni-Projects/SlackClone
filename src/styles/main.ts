import { css } from 'styled-components';

export const Main = css`
  /*
  1. Use a more-intuitive box-sizing model.
    */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /*
    2. Remove default margin
    */
  * {
    margin: 0;
  }

  /*
    Typographic tweaks!
    3. Add accessible line-height
    4. Improve text rendering
    */
  body {
    line-height: 1.5;
    margin: 0;
    font-family: Nunito, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #eceefe;
  }

  @font-face {
    font-family: Nunito;
    src: url('/public/fonts/Nunito-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  /*
    5. Improve media defaults
    */
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  /*
    6. Remove built-in form typography styles
    */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /*
    7. Avoid text overflows
    */

  /* p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
    overflow-wrap: break-word;
    } */

  /*
    8. Create a root stacking context
    */
  #app-root {
    isolation: isolate;
  }
`;
