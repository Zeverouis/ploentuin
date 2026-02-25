import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { TopicIcons } from "../../assets/Forum/topic/topic-icons.jsx";
import './profile.css';
import AdminModal from "../../components/adminModal/admin-modal.jsx";

const ProfilePage = ({ token, currentUsername, currentUserEmail }) => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [loading, setLoading] = useState(true);

    const [newEmail, setNewEmail] = useState('');
    const [passwords, setPasswords] = useState({ current: '', next: '' });
    const [newAvatar, setNewAvatar] = useState('');
    const [aboutText, setAboutText] = useState('');

    const isOwner = currentUsername === username;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/users/public/${username}`);
                setProfileData(res.data.data);
                setAboutText(res.data.data.about || '');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const closeModal = () => {
        setActiveModal(null);
        setNewEmail('');
        setPasswords({ current: '', next: '' });
        setNewAvatar('');
        setAboutText(profileData?.about || '');
    };

    const handleUpdateEmail = async () => {
        try {
            await axios.patch(`http://localhost:8080/users/email`,
                { email: newEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Email succesvol geüpdatet!");
            closeModal();
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Fout bij updaten email");
        }
    };

    const handleChangePassword = async () => {
        try {
            await axios.patch(`http://localhost:8080/users/${currentUsername}/change-password`,
                {
                    currentPassword: passwords.current,
                    newPassword: passwords.next
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Wachtwoord succesvol gewijzigd!");
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || "Fout bij wijzigen wachtwoord");
        }
    };

    const handleUpdateAvatar = async () => {
        try {
            await axios.patch(`http://localhost:8080/users/avatar`,
                { avatarUrl: newAvatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Avatar bijgewerkt!");
            closeModal();
            window.location.reload();
        } catch (err) {
            alert("Fout bij updaten avatar");
        }
    };

    const handleUpdateAbout = async () => {
        try {
            await axios.patch(`http://localhost:8080/users/about`,
                { about: aboutText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Over mij bijgewerkt!");
            closeModal();
            window.location.reload();
        } catch (err) {
            alert("Fout bij updaten over mij");
        }
    };

    if (loading || !profileData) return null;

    return (
        <div className="profile-layout">
            <aside className="profile-left">
                <div className="avatar-square-container">
                    <img src={profileData.avatarUrl} alt="Avatar" className="profile-img-main" />
                    {isOwner && (
                        <button className="pencil-btn-only" onClick={() => setActiveModal('avatar')}>
                            <img src={TopicIcons.editPencil} alt="edit" />
                        </button>
                    )}
                </div>

                <div className="identity-info">
                    <h2 className="profile-username-display">{profileData.username}</h2>
                    {isOwner && (
                        <div className="owner-settings">
                            <button className="text-action-link" onClick={() => setActiveModal('password')}>
                                Change password <img src={TopicIcons.editPencil} alt="edit" />
                            </button>
                            <button className="text-action-link" onClick={() => setActiveModal('email')}>
                                {currentUserEmail} <img src={TopicIcons.editPencil} alt="edit" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <main className="profile-right">
                <h2 className="section-header">Mijn planners</h2>
                <div className="planners-display-area">
                    {profileData.planners?.length > 0 ? (
                        <div className="planner-gallery">
                            {profileData.planners.map(p => (
                                <Link key={p.id} to={`/planner/${p.id}`} className="planner-card">
                                    <div className="planner-png-box">
                                        <div className="png-visual-mock">
                                            <div className="mock-dot"></div>
                                            <div className="mock-dot gold"></div>
                                        </div>
                                    </div>
                                    <span className="planner-card-label">{p.title}</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data-msg">Geen planners gevonden.</p>
                    )}
                </div>

                <section className="about-me-card">
                    {isOwner && (
                        <button className="pencil-btn-about-top" onClick={() => setActiveModal('about')}>
                            <img src={TopicIcons.editPencil} alt="edit" />
                        </button>
                    )}
                    <div className="about-text-left">
                        <p className="about-content-text">
                            {profileData.about || `Welkom op het profiel van ${profileData.username}.`}
                        </p>
                    </div>
                </section>
            </main>

            <AdminModal isOpen={activeModal === 'email'} title="Email aanpassen" onClose={closeModal}>
                <div className="modal-content-inner">
                    <input
                        type="email"
                        placeholder="Nieuw emailadres..."
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={closeModal}>Annuleren</button>
                        <button type="button" className="submit-btn" onClick={handleUpdateEmail}>Opslaan</button>
                    </div>
                </div>
            </AdminModal>

            <AdminModal isOpen={activeModal === 'password'} title="Wachtwoord wijzigen" onClose={closeModal}>
                <div className="modal-content-inner">
                    <input
                        type="password"
                        placeholder="Huidig wachtwoord..."
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Nieuw wachtwoord..."
                        value={passwords.next}
                        onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={closeModal}>Annuleren</button>
                        <button type="button" className="submit-btn" onClick={handleChangePassword}>Opslaan</button>
                    </div>
                </div>
            </AdminModal>

            <AdminModal isOpen={activeModal === 'avatar'} title="Avatar wijzigen" onClose={closeModal}>
                <div className="modal-content-inner">
                    <input
                        type="text"
                        placeholder="Nieuwe Avatar URL..."
                        value={newAvatar}
                        onChange={(e) => setNewAvatar(e.target.value)}
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={closeModal}>Annuleren</button>
                        <button type="button" className="submit-btn" onClick={handleUpdateAvatar}>Opslaan</button>
                    </div>
                </div>
            </AdminModal>

            <AdminModal isOpen={activeModal === 'about'} title="Over mij aanpassen" onClose={closeModal}>
                <div className="modal-content-inner">
                    <textarea
                        placeholder="Vertel iets over jezelf..."
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        rows="6"
                    />
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={closeModal}>Annuleren</button>
                        <button type="button" className="submit-btn" onClick={handleUpdateAbout}>Opslaan</button>
                    </div>
                </div>
            </AdminModal>
        </div>
    );
};

export default ProfilePage;