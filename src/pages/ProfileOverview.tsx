import CloseIcon from '../components/Icon/CloseIcon';
import { Color } from '../enums/color';
import { IconSize } from '../enums/iconSize';

const ProfileOverview = () => {
  return (
    <div>
      <h3>Profile</h3>
      <CloseIcon size={IconSize.Medium} color={Color.GreyDark} />
    </div>
  );
};

export default ProfileOverview;
