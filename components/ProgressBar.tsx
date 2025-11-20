import React from "react";

interface ProgressBarProps {
  value: number;
  label?: string;
  isLoading?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  isLoading,
}) => {
  let colour = "#ef4444";
  if (value >= 80) colour = "#22c55e";
  else if (value >= 60) colour = "#f59e0b";

  return (
    <div className="progress-container">
      {label && <p className="progress-label">{label}</p>}
      <div className="progress-bar">
        <div
          className={`progress-fill ${isLoading ? "loading" : ""}`}
          style={{
            width: isLoading ? "100%" : `${value}%`,
            background: isLoading
              ? "linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)"
              : colour,
          }}
        ></div>
      </div>
      {!isLoading && <p className="progress-value">{value}%</p>}
    </div>
  );
};

export default ProgressBar;
