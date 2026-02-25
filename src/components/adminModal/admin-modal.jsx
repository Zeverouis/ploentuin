import React from 'react';
import './admin-modal.css'

const AdminModal = ({ isOpen, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content">
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default AdminModal;