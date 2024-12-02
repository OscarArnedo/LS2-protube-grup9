import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 z-40" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-start justify-center z-50 mt-12 p-4 sm:p-6 md:p-10">
                <div className="bg-white rounded-lg shadow-lg max-w-full w-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl p-6 relative border-4 border-blue-300 border-opacity-70 overflow-hidden">
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <div className="overflow-y-auto max-h-[80vh] w-full">
                        {children}
                    </div>
                </div>
            </div>
        </>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default Modal;
