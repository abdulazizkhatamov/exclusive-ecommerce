import React from "react";

interface PrimaryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const PrimaryTextInput: React.FC<PrimaryInputProps> = ({
  className = "",
  ...props
}) => {
  return (
    <input
      className={`bg-[#F5F5F5] rounded border-none focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default PrimaryTextInput;
