import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BulletinBoard from '../../components/BulletinBoard/BulletinBoard';
import './database.css';
import { categoryImages } from "../../assets/database/categories/category-images.jsx";

function Database({ userRole }) {
    const [categories, setCategories] = useState([]);
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

    const handleAddCategory = async () => {
        const name = prompt("New category name:");
        if (!name || name.trim() === "") return;

        try {
            await axios.post('http://localhost:8080/info/categories',
                { categoryName: name },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchCategories();
        } catch (err) {
            console.error("Add failed", err);
            alert("Failed to add category. Check console.");
        }
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
                            <div className="pillar-item add-category-card" onClick={handleAddCategory}>
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
        </div>
    );
}

export default Database;