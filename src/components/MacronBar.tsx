import React from "react";

interface MacronBarProps {
  onMacronClick: (char: string) => void;
}

export const MacronBar: React.FC<MacronBarProps> = ({ onMacronClick }) => {
  const macrons = [
    { char: "ā", label: "a" },
    { char: "ē", label: "e" },
    { char: "ī", label: "i" },
    { char: "ō", label: "o" },
    { char: "ū", label: "u" },
    { char: "Ā", label: "A" },
    { char: "Ē", label: "E" },
    { char: "Ī", label: "I" },
    { char: "Ō", label: "O" },
    { char: "Ū", label: "U" },
  ];

  return (
    <div className="macron-bar">
      {macrons.map((item) => (
        <button
          key={item.char}
          className="macron-btn"
          onClick={() => onMacronClick(item.char)}
          title={item.char}
        >
          {item.char}
        </button>
      ))}
    </div>
  );
};
