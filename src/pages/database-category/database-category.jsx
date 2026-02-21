import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './database-category.css';

function DatabaseCategory({ userRole }) {
    const { id } = useParams();
    const [pages, setPages] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const isAdmin = userRole === 'ADMIN';

    const [formData, setFormData] = useState({
        title: '', tldr: '',
        sectionOneTitle: '', sectionOneContent: '',
        sectionTwoTitle: '', sectionTwoContent: '',
        sectionThreeTitle: '', sectionThreeContent: '',
        sectionFourTitle: '', sectionFourContent: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const fetchData = async () => {
        try {
            const pagesRes = await axios.get(`http://localhost:8080/info/pages/category/${id}`);
            setPages(pagesRes.data.data || []);

            const catRes = await axios.get(`http://localhost:8080/info/categories`);
            const currentCat = catRes.data.find(cat => cat.id === parseInt(id));
            if (currentCat) setCategoryName(currentCat.categoryName);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleDeletePage = async (pageId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Weet je zeker dat je deze pagina wilt verwijderen?")) return;

        try {
            await axios.delete(`http://localhost:8080/info/pages/${pageId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchData();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (value && value.trim() !== "") {
                data.append(key, value);
            }
        });

        data.append('infoCategoryId', id);

        if (selectedFiles && selectedFiles.length > 0) {
            Array.from(selectedFiles).forEach(file => {
                data.append('images', file);
            });
        }
        try {
            await axios.post('http://localhost:8080/info/pages', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(false);
            fetchData();
            setFormData({ title: '',
                tldr: '',
                sectionOneTitle: '', sectionOneContent: '',
                sectionTwoTitle: '', sectionTwoContent: '',
                sectionThreeTitle: '', sectionThreeContent: '',
                sectionFourTitle: '', sectionFourContent: '' });
            setSelectedFiles([]);
        } catch (err) {
            console.error("Submit failed:", err);
            alert("Fout bij aanmaken pagina");
        }
    };

    return (
        <div className="category-view-body">
            <div className="category-header-banner">
                <h1>{categoryName || "Loading..."}</h1>
            </div>

            <div className="category-items-grid">
                {isAdmin && (
                    <div className="pillar-wrapper">
                        <div className="category-item-card add-page-card" onClick={() => setShowModal(true)}>
                            <span className="add-text">ADD PAGE</span>
                        </div>
                    </div>
                )}

                {pages.map(page => (
                    <div key={page.id} className="pillar-wrapper">
                        <Link to={`/database/page/${page.id}`} className="category-item-card">{page.title}</Link>
                        {isAdmin && <button className="delete-x" onClick={(e) => handleDeletePage(page.id, e)}>×</button>}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
                        <h2>Nieuwe Pagina</h2>
                        <form onSubmit={handleSubmit}>
                            <input name="title" placeholder="Titel (Verplicht)" onChange={handleInputChange} required />
                            <textarea name="tldr" placeholder="TLDR (Verplicht)" onChange={handleInputChange} required />

                            <div className="modal-sections">
                                {[1, 2, 3, 4].map(num => (
                                    <div key={num} className="section-input-group">
                                        <input
                                            name={`section${num === 1 ? 'One' : num === 2 ? 'Two' : num === 3 ? 'Three' : 'Four'}Title`}
                                            placeholder={`Sectie ${num} Titel`}
                                            onChange={handleInputChange}
                                        />
                                        <textarea
                                            name={`section${num === 1 ? 'One' : num === 2 ? 'Two' : num === 3 ? 'Three' : 'Four'}Content`}
                                            placeholder={`Sectie ${num} Inhoud`}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ))}
                            </div>

                            <input type="file" multiple onChange={handleFileChange} accept="image/*" />

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Annuleren</button>
                                <button type="submit" className="submit-btn">Opslaan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatabaseCategory;