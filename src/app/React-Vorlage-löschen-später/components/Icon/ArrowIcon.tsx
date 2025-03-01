import BaseIcon, { BaseIconProps } from './BaseIcon';

const ArrowIcon = ({ color, size }: BaseIconProps) => (
  <BaseIcon
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    color={color}
    size={size}
  >
    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
  </BaseIcon>
);

export default ArrowIcon;
