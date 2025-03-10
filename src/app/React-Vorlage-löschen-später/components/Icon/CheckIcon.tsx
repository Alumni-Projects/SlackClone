import BaseIcon, { BaseIconProps } from './BaseIcon';

const UserIcon = ({ color, size }: BaseIconProps) => (
  <BaseIcon
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    color={color}
    size={size}
  >
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </BaseIcon>
);

export default UserIcon;
