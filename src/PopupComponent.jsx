import React from "react";

const PopupComponent = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PopupComponent;
