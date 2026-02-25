import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './forum-home.css';
import AdminModal from "../../components/adminModal/admin-modal.jsx";
import BulletinBoard from "../../components/bulletinBoard/bulletinBoard.jsx";

function ForumHome({ userRole }) {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const isAdmin = userRole === 'ADMIN';

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8080/forums/categories');
            setCategories(res.data.data || []);
        } catch (err) {
            console.error("Fout bij ophalen forums:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/forums/categories',
                {categoryName: newCategoryName},
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            );
            setNewCategoryName("");
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            alert("Fout bij aanmaken categorie: " + err.response?.data?.message);
        }
    };

    const handleDeleteCategory = async (id, e) => {
        e.preventDefault();
        if (!window.confirm("Alle posts in deze categorie worden ook verwijderd. Doorgaan?")) return;
        try {
            await axios.delete(`http://localhost:8080/forums/categories/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            fetchCategories();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return (
        <div className="forum-home-container">
            <div className="forum-main-content">
                <div className="forum-grid">
                    {isAdmin && (
                        <div className="squircle-wrapper">
                            <div className="forum-squircle add-forum-btn" onClick={() => setShowModal(true)}>
                                <span className="add-text">Add</span>
                            </div>
                        </div>
                    )}
                    {categories.map(cat => (
                        <div key={cat.id} className="squircle-wrapper">
                            <Link to={`/forum/category/${cat.id}`} className="forum-squircle">
                                <span className="cat-name">{cat.categoryName}</span>
                            </Link>
                            {isAdmin && (
                                <button className="del-cat-btn"
                                        onClick={(e) => handleDeleteCategory(cat.id, e)}>×</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="forum-sidebar">
                <BulletinBoard
                    title="New forum"
                    fetchUrl="/forums/posts/latest"
                    linkPrefix="/forum/post"
                    className="forum-home-board"
                />
            </div>

            <AdminModal isOpen={showModal} title="Nieuwe Categorie">
                <form onSubmit={handleAddCategory}>
                    <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Categorie naam"
                        required
                        autoFocus
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Annuleren
                        </button>
                        <button type="submit" className="submit-btn">Aanmaken</button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}

export default ForumHome;