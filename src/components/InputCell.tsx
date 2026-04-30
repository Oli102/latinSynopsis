import React from "react";

interface InputCellProps {
  value: string;
  correctAnswer: string;
  isCorrect: boolean;
  isRevealed: boolean;
  onChange: (value: string) => void;
  onReveal: () => void;
  disabled: boolean;
}

export const InputCell: React.FC<InputCellProps> = ({
  value,
  correctAnswer,
  isCorrect,
  isRevealed,
  onChange,
  onReveal,
  disabled,
}) => {
  return (
    <div className="input-cell">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`cell-input ${isCorrect && value ? "correct" : ""} ${
          isRevealed ? "revealed" : ""
        }`}
        placeholder="—"
      />
      <div className="cell-controls">
        {isCorrect && value && !isRevealed && (
          <span className="checkmark">✔</span>
        )}
        <button
          className="reveal-btn"
          onClick={onReveal}
          title="Show correct answer"
        >
          👁
        </button>
      </div>
      {isRevealed && <div className="answer-display">{correctAnswer}</div>}
    </div>
  );
};
