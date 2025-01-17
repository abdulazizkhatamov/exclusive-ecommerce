// RangeSlider.tsx
import React from "react";
import style from "@/components/custom/inputs/PrimaryRangeInput/RangeSliderInput.module.css";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  label,
}) => {
  return (
    <div className="mb-6">
      {label && <h3 className="text-sm font-medium mb-2">{label}</h3>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full ${style.customRange}`}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
