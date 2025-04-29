import React from "react";

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  selectedCount,
  zoningType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-indigo-600/20 z-[900]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-[1000]">
        <h2 className="text-indigo-700 text-xl font-semibold mb-4">
          Confirm Zoning Update
        </h2>
        <p className="mb-6">
          Are you sure you want to update{" "}
          <span className="font-bold">{selectedCount}</span> parcel
          {selectedCount !== 1 ? "s" : ""} to{" "}
          <span className="font-bold">{zoningType}</span>?
        </p>
        <div className="flex justify-end space-x-4 gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
