"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardColor: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  cardColor,
  children,
  className = "",
}: ModalProps): React.ReactElement | null => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop — accessible button that closes the modal */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40 cursor-default"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative rounded-2xl w-[90vw] max-w-3xl min-h-[70vh] p-6 ${className}`}
        style={{ backgroundColor: cardColor }}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-brown/70 hover:text-brown text-xl font-bold cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
