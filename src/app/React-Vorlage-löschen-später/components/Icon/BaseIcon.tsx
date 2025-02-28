import { Color } from '../../enums/color';
import { IconSize } from '../../enums/iconSize';
import styled from 'styled-components';

export type BaseIconProps = {
  size: IconSize;
  color: Color;
};

const BaseIcon = styled.svg<BaseIconProps>`
  width: var(${(props) => props.size});
  height: var(${(props) => props.size});
  fill: var(${(props) => props.color});
`;

export default BaseIcon;
