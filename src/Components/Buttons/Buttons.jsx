import React from "react";
import { FaPlus, FaListUl, FaSearch } from "react-icons/fa";
import { Button } from "./ButtonsStyle";

const Buttons = ({ buttons }) => {
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "FaPlus":
        return <FaPlus />;
      case "FaListUl":
        return <FaListUl />;
      case "FaSearch":
        return <FaSearch />;
      default:
        return null;
    }
  };

  return (
    <Button>
      {buttons.map((btn, index) => (
        <div key={index} className="buttonContainer">
          <button className="botao" onClick={btn.onClick}>
            {renderIcon(btn.icon)}
            <h2>{btn.label}</h2>
          </button>
        </div>
      ))}
    </Button>
  );
};

export default Buttons;
