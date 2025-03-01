import styled from 'styled-components';
import { MediaQuery } from '../../enums/breakpoint';
import { InputTheme } from '../../enums/inputTheme';
import { ReactNode } from 'react';
import { Color } from '../../enums/color';

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  color: var(--grey-dark);
  transition: border-color 0.3s ease;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
`;

type InputWrapperProps = {
  backgroundColor: string;
  borderColor: string;
};

const InputWrapper = styled.div<InputWrapperProps>`
  position: relative;
  margin-bottom: 28px;
  background-color: var(${(props) => props.backgroundColor});
  border: 1px solid var(${(props) => props.borderColor});
  border-radius: var(--border-radius-xl);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  gap: 16px;

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  ${MediaQuery.M} {
    margin-bottom: 40px;
    gap: 32px;
  }
`;

const themeMap: {
  [key in InputTheme]: { backgroundColor: Color; borderColor: Color };
} = {
  [InputTheme.Primary]: {
    backgroundColor: Color.White,
    borderColor: Color.LightPurple
  },
  [InputTheme.Secondary]: {
    backgroundColor: Color.White,
    borderColor: Color.Primary
  }
};

type Props = React.HTMLProps<HTMLInputElement> & {
  theme?: InputTheme;
  icon: ReactNode;
};

const Input = (props: Props) => {
  const { theme = InputTheme.Primary, icon, ...rest } = props;

  return (
    <InputWrapper {...themeMap[theme]}>
      {icon}
      <StyledInput {...rest} />
    </InputWrapper>
  );
};

export default Input;
