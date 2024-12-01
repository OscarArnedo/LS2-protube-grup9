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
            <div className="fixed inset-0 bg-black opacity-70" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto w-full relative border-4 border-blue-300 border-opacity-70 overflow-hidden">
                    <button className="absolute top-2 right-2" onClick={onClose}>
                        &times;
                    </button>
                    <div className="overflow-y-auto max-h-[100vh]">
                        {children}
                    </div>
                </div>
            </div>
        </>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default Modal;
