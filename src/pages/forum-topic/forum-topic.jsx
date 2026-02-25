import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TopicIcons } from "../../assets/Forum/topic/topic-icons.jsx";
import './forum-topic.css';
import AdminModal from "../../components/adminModal/admin-modal.jsx";

function ForumTopic({ userRole, currentUserId, isBanned, currentUsername }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [editData, setEditData] = useState({
        id: null, content: '', title: '', type: '', imageUrls: [], selectedFiles: []
    });

    const [newComment, setNewComment] = useState({
        content: '', imageUrls: [''], selectedFiles: []
    });

    const isAdmin = userRole === 'ADMIN';
    const isAdminOrMod = userRole === 'ADMIN' || userRole === 'MOD';

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/forums/posts/${id}`);
            setPost(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fout bij ophalen:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleUpdateRole = async (targetUsername, currentRole) => {
        if (!isAdmin) return;
        const newRole = currentRole === 'MOD' ? 'USER' : 'MOD';

        try {
            await axios.patch(`http://localhost:8080/users/${targetUsername}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActiveDropdown(null);
            fetchData();
        } catch (err) {
            alert("Fout bij updaten rol.");
        }
    };

    const handleBanUser = async (targetUsername, targetIsCurrentlyBanned) => {
        if (!isAdmin) return;
        if (targetUsername === currentUsername) {
            alert("Je kunt jezelf niet verbannen!");
            return;
        }
        const actionText = targetIsCurrentlyBanned ? "ontbannen" : "verbannen";
        if (!window.confirm(`Weet je zeker dat je ${targetUsername} wilt ${actionText}?`)) return;

        try {
            await axios.patch(`http://localhost:8080/users/${targetUsername}/ban`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Ban actie mislukt.");
        }
    };

    const handleGoToProfile = (username) => {
        navigate(`/profile/${username}`);
    };

    const renderImage = (img) => {
        if (!img || !img.imageUrl) return null;
        return img.imageUrl.startsWith('http') ? img.imageUrl : `http://localhost:8080${img.imageUrl}`;
    };

    const handleDeletePost = async () => {
        if (!window.confirm("Weet je zeker dat je dit topic wilt verwijderen?")) return;
        try {
            await axios.delete(`http://localhost:8080/forums/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/forum');
        } catch (err) {
            alert("Verwijderen mislukt.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Reactie verwijderen?")) return;
        try {
            await axios.delete(`http://localhost:8080/forums/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert("Verwijderen van reactie mislukt.");
        }
    };

    const openEdit = (item, type) => {
        setEditData({
            id: item.id,
            title: item.title || '',
            content: item.content || '',
            type: type,
            existingImages: item.images || [],
            imageUrls: [''],
            selectedFiles: []
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', editData.content);
        if (editData.type === 'POST') formData.append('title', editData.title);
        editData.imageUrls.forEach(url => { if (url?.trim()) formData.append('imageUrls', url); });
        editData.selectedFiles.forEach(file => formData.append('images', file));

        try {
            const endpoint = editData.type === 'POST' ? `posts/${editData.id}` : `comments/${editData.id}`;
            await axios.patch(`http://localhost:8080/forums/${endpoint}`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setIsEditModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Opslaan mislukt.");
        }
    };

    const handleAddCommentSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', newComment.content);
        newComment.imageUrls.forEach(url => { if (url?.trim()) formData.append('imageUrls', url); });
        newComment.selectedFiles.forEach(file => formData.append('images', file));

        try {
            await axios.post(`http://localhost:8080/forums/posts/${id}/comments`, formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setIsAddModalOpen(false);
            setNewComment({ content: '', imageUrls: [''], selectedFiles: [] });
            fetchData();
        } catch (err) {
            alert("Reactie plaatsen mislukt.");
        }
    };

    const renderAuthorSection = (item, itemId) => (
        <div className="author-container">
            <div className="avatar-wrapper">
                <img
                    src={item.avatarUrl}
                    alt="avatar"
                    className="small-author-avatar"
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === itemId ? null : itemId);
                    }}
                />
                {activeDropdown === itemId && (
                    <div className="role-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button className="dropdown-btn" onClick={() => handleGoToProfile(item.username)}>
                            Profiel
                        </button>
                        {isAdmin && (
                            <button className="dropdown-btn role-toggle-btn" onClick={() => handleUpdateRole(item.username, item.role)}>
                                {item.role === 'MOD' ? 'Verwijder Mod' : 'Maak Mod'}
                            </button>
                        )}
                    </div>
                )}
            </div>
            <span className="author-tag">Door: {item.username} ({item.role})</span>
        </div>
    );

    if (loading) return <div className="forum-topic-page"><h1>Loading...</h1></div>;
    if (!post) return <div className="forum-topic-page"><h1>Post niet gevonden.</h1></div>;

    return (
        <div className="forum-topic-page" onClick={() => setActiveDropdown(null)}>
            <div className="forum-topic-container">
                <div className="main-post">
                    <div className="post-actions">
                        {isAdmin && (
                            <img
                                src={TopicIcons.banIcon}
                                alt="ban"
                                className={`action-icon ban-btn ${post.userBanned ? 'is-banned' : ''}`}
                                onClick={() => handleBanUser(post.username, post.userBanned)}
                            />
                        )}
                        {(String(post.userId) === String(currentUserId) && !isBanned) && (
                            <img src={TopicIcons.editPencil} alt="edit" className="action-icon" onClick={() => openEdit(post, 'POST')} />
                        )}
                        {(isAdminOrMod || String(post.userId) === String(currentUserId)) && (
                            <img src={TopicIcons.deleteX} alt="delete" className="action-icon" onClick={() => handleDeletePost()} />
                        )}
                    </div>
                    <h1 className="post-title">{post.title}</h1>
                    <p className="post-content">{post.content}</p>
                    {post.images && post.images.length > 0 && (
                        <div className="forum-image-gallery">
                            {post.images.map((img, idx) => (
                                <img key={idx} src={renderImage(img)} alt="upload" className="forum-display-image" />
                            ))}
                        </div>
                    )}
                    {renderAuthorSection(post, 'main')}
                </div>

                {token && (
                    <div className="add-comment-wrapper">
                        {!isBanned ? (
                            <button className="submit-btn" onClick={() => setIsAddModalOpen(true)}>Reageer</button>
                        ) : (
                            <p className="banned-alert">Je bent verbannen.</p>
                        )}
                    </div>
                )}

                <div className="comment-section">
                    {post.comments && post.comments.map(comment => (
                        <div key={comment.id} className="comment-bar">
                            <div className="comment-actions">
                                {isAdmin && (
                                    <img
                                        src={TopicIcons.banIcon}
                                        alt="ban"
                                        className={`action-icon ban-btn ${comment.userBanned ? 'is-banned' : ''}`}
                                        onClick={() => handleBanUser(comment.username, comment.userBanned)}
                                    />
                                )}
                                {(String(comment.userId) === String(currentUserId) && !isBanned) && (
                                    <img src={TopicIcons.editPencil} alt="edit" className="action-icon" onClick={() => openEdit(comment, 'COMMENT')} />
                                )}
                                {(isAdminOrMod || String(comment.userId) === String(currentUserId)) && (
                                    <img src={TopicIcons.deleteX} alt="delete" className="action-icon" onClick={() => handleDeleteComment(comment.id)} />
                                )}
                            </div>
                            <p className="comment-content">{comment.content}</p>
                            {comment.images && comment.images.length > 0 && (
                                <div className="forum-image-gallery">
                                    {comment.images.map((img, idx) => (
                                        <img key={idx} src={renderImage(img)} alt="comment upload" className="forum-display-image" />
                                    ))}
                                </div>
                            )}
                            {renderAuthorSection(comment, comment.id)}
                        </div>
                    ))}
                </div>
            </div>

            <AdminModal isOpen={isEditModalOpen} title="Bewerken" onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleEditSubmit}>
                    {editData.type === 'POST' && (
                        <input type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} placeholder="Titel" required />
                    )}
                    <textarea rows="5" value={editData.content} onChange={(e) => setEditData({...editData, content: e.target.value})} placeholder="Inhoud..." required />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Annuleren</button>
                        <button type="submit" className="submit-btn">Opslaan</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal isOpen={isAddModalOpen} title="Nieuwe Reactie" onClose={() => setIsAddModalOpen(false)}>
                <form onSubmit={handleAddCommentSubmit}>
                    <textarea
                        placeholder="Spreek! Zodat anderen het mogen horen."
                        value={newComment.content}
                        onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                        required
                    />

                    <div className="modal-upload-section">
                        <label>Bestanden uploaden:</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setNewComment({ ...newComment, selectedFiles: Array.from(e.target.files) })}
                        />
                    </div>

                    {newComment.imageUrls.map((url, i) => (
                        <div key={i} className="url-input-wrapper">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    const n = [...newComment.imageUrls];
                                    n[i] = e.target.value;
                                    setNewComment({ ...newComment, imageUrls: n });
                                }}
                                placeholder="Afbeelding URL"
                            />
                            <span
                                className="remove-url-icon"
                                onClick={() => setNewComment({ ...newComment, imageUrls: newComment.imageUrls.filter((_, idx) => idx !== i) })}
                            >
                                &times;
                            </span>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="add-url-trigger"
                        onClick={() => setNewComment({ ...newComment, imageUrls: [...newComment.imageUrls, ''] })}
                    >
                        + Voeg URL toe
                    </button>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Annuleren</button>
                        <button type="submit" className="submit-btn">Reageer</button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}

export default ForumTopic;