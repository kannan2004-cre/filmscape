import React, { useState } from "react";

export function Dialog({ children, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="text-lg font-bold border-b pb-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end">{children}</div>;
}
