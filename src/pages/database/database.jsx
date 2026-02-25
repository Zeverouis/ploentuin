import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BulletinBoard from '../../components/BulletinBoard/BulletinBoard';
import './database.css';
import { categoryImages } from "../../assets/database/categories/category-images.jsx";
import AdminModal from "../../components/adminModal/admin-modal.jsx";

function Database({ userRole }) {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const isAdmin = userRole === 'ADMIN';

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const response = await axios.get('http://localhost:8080/info/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    }

    const submitCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/info/categories',
                { categoryName: newCatName },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setNewCatName("");
            setShowModal(false);
            fetchCategories();
        } catch (err) { console.error("Add failed", err); }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Delete category and all its pages?")) return;

        try {
            await axios.delete(`http://localhost:8080/info/categories/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchCategories();
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed.");
        }
    };

    return (
        <div className="database-page-body">
            <div className="database-main-area">
                <BulletinBoard
                    title="New Data"
                    fetchUrl="/info/pages/latest"
                    linkPrefix="/database/page"
                    className="header-black-box"
                />

                <div className="pillars-grid">
                    {isAdmin && (
                        <div className="pillar-wrapper">
                            <div
                                className="pillar-item add-category-card"
                                onClick={() => setShowModal(true)}
                            >
                                <span className="add-text">ADD</span>
                            </div>
                        </div>
                    )}

                    {categories.map(cat => (
                        <div key={cat.id} className="pillar-wrapper">
                            <Link
                                to={`/database/category/${cat.id}`}
                                className="pillar-item"
                                style={{ backgroundImage: `url(${categoryImages[cat.id]})` }}
                            >
                                {cat.categoryName || "Loading..."}
                            </Link>

                            {isAdmin && (
                                <button
                                    onClick={(e) => handleDelete(cat.id, e)}
                                    className="delete-x"
                                    title="Delete Category"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="database-widgets-sidebar">
                <BulletinBoard title="New Groenten" fetchUrl="/info/pages/category/2" linkPrefix="/database/page" />
                <BulletinBoard title="New Fruit" fetchUrl="/info/pages/category/9" linkPrefix="/database/page" />
                <BulletinBoard title="New Tuin Tips" fetchUrl="/info/pages/category/1" linkPrefix="/database/page" />
            </div>

            <AdminModal
                isOpen={showModal}
                title="Nieuwe Database Categorie"
            >
                <form onSubmit={submitCategory}>
                    <input
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Naam van de categorie..."
                        required
                        autoFocus
                    />
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                                setShowModal(false);
                                setNewCatName("");
                            }}
                        >
                            Annuleren
                        </button>
                        <button type="submit" className="submit-btn">
                            Aanmaken
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}

export default Database;