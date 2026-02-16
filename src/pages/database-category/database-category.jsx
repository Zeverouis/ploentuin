import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './database-category.css';

function DatabaseCategory() {
    const { id } = useParams();
    const [pages, setPages] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pagesRes = await axios.get(`http://localhost:8080/info/pages/category/${id}`);
                setPages(pagesRes.data.data);

                const catRes = await axios.get(`http://localhost:8080/info/categories`);
                const currentCat = catRes.data.find(cat => cat.id === parseInt(id));
                if (currentCat) {
                    setCategoryName(currentCat.categoryName);
                }
            } catch (error) {
                console.error("Error fetching category data", error);
            }
        };
        fetchData().catch(console.error);
    }, [id]);

    return (
        <div className="category-view-body">
            <div className="category-header-banner">
                <h1>{categoryName || "Laden..."}</h1>
            </div>

            <div className="category-items-grid">
                {pages && pages.map(page => (
                    <Link to={`/database/page/${page.id}`} key={page.id} className="category-item-card">
                        {page.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DatabaseCategory;