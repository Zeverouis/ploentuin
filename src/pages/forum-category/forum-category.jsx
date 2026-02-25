import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './forum-category.css';
import AdminModal from "../../components/adminModal/admin-modal.jsx";

function ForumCategory({ userRole, isBanned }) {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');

    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        imageUrls: [''],
        selectedFiles: []
    });

    const isAuthorizedToDelete = userRole === 'ADMIN' || userRole === 'MOD';

    const fetchData = async () => {
        try {
            const catRes = await axios.get(`http://localhost:8080/forums/categories/${id}`);
            setCategory(catRes.data.data);

            const postsRes = await axios.get(`http://localhost:8080/forums/categories/${id}/posts`);
            setPosts(postsRes.data.data || []);
        } catch (error) {
            console.error("Error fetching forum data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = async (postId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Verwijder dit topic en alle reacties?")) return;

        try {
            await axios.delete(`http://localhost:8080/forums/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (isBanned) {
            alert("Je kunt geen posts plaatsen omdat je bent verbannen.");
            return;
        }

        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);

        newPost.imageUrls.forEach(url => {
            if (url && url.trim()) formData.append('imageUrls', url);
        });

        newPost.selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            await axios.post(`http://localhost:8080/forums/categories/${id}/posts`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNewPost({ title: '', content: '', imageUrls: [''], selectedFiles: [] });
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Post creation failed", err);
            alert("Post plaatsen mislukt.");
        }
    };

    return (
        <div className="forum-topics-page">
            <div className="forum-topics-header">
                <h1>{category ? category.categoryName : "Loading..."}</h1>
            </div>

            <div className="forum-topics-container">
                <div className="forum-topics-list">
                    {token && (
                        <div className="topic-row-wrapper">
                            {!isBanned ? (
                                <div className="topic-card add-topic-card" onClick={() => setShowModal(true)}>
                                    <span className="add-text">NIEUW TOPIC</span>
                                </div>
                            ) : (
                                <div className="topic-card add-topic-card disabled-card">
                                    <span className="add-text">VERBANNEN</span>
                                </div>
                            )}
                        </div>
                    )}

                    {posts.map(post => (
                        <div key={post.id} className="topic-row-wrapper">
                            <Link to={`/forum/post/${post.id}`} className="topic-card">
                                <span className="topic-title">{post.title}</span>
                                <span className="topic-author">Door: {post.username}</span>
                            </Link>

                            {isAuthorizedToDelete && (
                                <button
                                    className="delete-x"
                                    onClick={(e) => handleDelete(post.id, e)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <AdminModal isOpen={showModal} title="Nieuwe post">
                <form onSubmit={handleCreatePost}>
                    <input
                        placeholder="Titel"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Spreek! Zodat anderen het mogen horen."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        required
                    />

                    <div className="modal-upload-section">
                        <label>Bestanden uploaden:</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setNewPost({ ...newPost, selectedFiles: Array.from(e.target.files) })}
                        />
                    </div>

                    {newPost.imageUrls.map((url, i) => (
                        <div key={i} className="url-input-wrapper">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    const n = [...newPost.imageUrls];
                                    n[i] = e.target.value;
                                    setNewPost({ ...newPost, imageUrls: n });
                                }}
                                placeholder="Afbeelding URL"
                            />
                            <span
                                className="remove-url-icon"
                                onClick={() => setNewPost({ ...newPost, imageUrls: newPost.imageUrls.filter((_, idx) => idx !== i) })}
                            >
                                &times;
                            </span>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="add-url-trigger"
                        onClick={() => setNewPost({ ...newPost, imageUrls: [...newPost.imageUrls, ''] })}
                    >
                        + Voeg URL toe
                    </button>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Annuleren</button>
                        <button type="submit" className="submit-btn">Post</button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}

export default ForumCategory;