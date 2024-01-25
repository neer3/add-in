import React, { useState } from 'react';
import './Modal.css'; // Import CSS file for styling

const Modal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>{Open Modal}</button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
