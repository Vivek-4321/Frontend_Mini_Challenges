import React from 'react';

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ value, onChange, disabled }) => {
  return (
    <input
      type="text"
      className="user-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      autoFocus
    />
  );
};

export default UserInput;
