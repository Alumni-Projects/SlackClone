import styled from 'styled-components';
import SecondaryLink from '../Link/SecondaryLink';
import CheckIcon from '../Icon/CheckIcon';
import { IconSize } from '../../enums/iconSize';
import { useState } from 'react';
import { Color } from '../../enums/color';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  font-size: var(--font-size-m);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    padding 0.3s ease,
    border-radius 0.3s ease;

  &:hover {
    background-color: var(--hover-bg-color);
    border-radius: var(--border-radius-xl);
  }

  svg {
    position: absolute;
    margin-right: 8px;
    z-index: 2;
  }
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid var(--secondary-color);
  cursor: pointer;
  position: absolute;
  z-index: 2;

  &:checked {
    z-index: 2;
    border-color: var(--primary-color);
  }

  &:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    transform: translate(-50%, -50%);
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CheckboxIcon = styled(CheckIcon)`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-size-s);
  position: relative;
  cursor: pointer;

  span {
    background: transparent;
    border-radius: var(--border-radius-xl);
    position: absolute;
    left: -4px;
  }

  a {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-bold);
  }

  div {
    margin-left: 42px;
  }

  &:hover {
    span {
      background: var(--bg-color);
      transition: all 0.2s ease;
      width: 32px;
      height: 32px;
      z-index: 1;
    }

    a {
      background-color: var(--bg-color);
      border-radius: var(--border-radius-xl);
    }
  }
`;
const PrivacyCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };

  return (
    <CheckboxContainer>
      <CheckboxLabel>
        <CheckboxInput
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span></span>
        {isChecked && (
          <CheckboxIcon size={IconSize.Medium} color={Color.Primary} />
        )}
        <div>
          Ich stimme der{' '}
          <SecondaryLink to="/privacypolicy">
            Datenschutzerklärung
          </SecondaryLink>{' '}
          zu.
        </div>
      </CheckboxLabel>
    </CheckboxContainer>
  );
};

export default PrivacyCheckbox;
