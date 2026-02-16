import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BulletinBoard from '../../components/BulletinBoard/BulletinBoard';
import './database.css';

function Database() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get('http://localhost:8080/info/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        }
        fetchCategories().catch(console.error);
    }, []);

    //TODO: ADD TO CSS BACKGROUND IMAGES FOR PILLARS ALSO LINK PILLARS TO INDIVIDUAL CATEGORIES

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
                    {categories.map(cat => (
                        <Link to={`/database/category/${cat.id}`} key={cat.id} className="pillar-item">
                            {cat.name}
                        </Link>
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