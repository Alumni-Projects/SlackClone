import BaseIcon, { BaseIconProps } from './BaseIcon';

const CloseIcon = ({ color, size }: BaseIconProps) => (
  <BaseIcon
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    color={color}
    size={size}
  >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </BaseIcon>
);

export default CloseIcon;
