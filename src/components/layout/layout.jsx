import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Layout({
                    loggedIn,
                    setLoggedIn,
                    currentUsername,
                    currentUserAvatar,
                    navbarOpen,
                    setNavbarOpen
                }) {
    const location = useLocation();
    const isPlannerPage = location.pathname.includes('/planner');
    const [dbData, setDbData] = useState([]);
    const [forumData, setForumData] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        const fetchAllNavData = async () => {
            try {
                const [dbCatsRes, forumCatsRes] = await Promise.all([
                    axios.get('http://localhost:8080/info/categories'),
                    axios.get('http://localhost:8080/forums/categories')
                ]);

                const dbCats = dbCatsRes.data;
                const forumCats = forumCatsRes.data.data;

                const dbWithPages = await Promise.all(dbCats.map(async (cat) => {
                    const pagesRes = await axios.get(`http://localhost:8080/info/pages/category/${cat.id}`);
                    return { ...cat, pages: pagesRes.data.data || [] };
                }));

                const forumWithPosts = await Promise.all(forumCats.map(async (cat) => {
                    const postsRes = await axios.get(`http://localhost:8080/forums/categories/${cat.id}/posts`);
                    return { ...cat, posts: postsRes.data.data || [] };
                }));

                setDbData(dbWithPages);
                setForumData(forumWithPosts);
            } catch (err) {
                console.error("Nav fetch failed", err);
            }
        };

        if (navbarOpen) fetchAllNavData();
    }, [navbarOpen]);

    const toggleDropdown = (name) => setOpenDropdown(openDropdown === name ? null : name);

    return (
        <>
            <Header
                websiteName="Ploentuin"
                logoUrl="/logo.svg"
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                currentUsername={currentUsername}
                currentUserAvatar={currentUserAvatar}
                navbarToggle={!isPlannerPage}
                navbarIconUrl
                onToggleNavbar={() => setNavbarOpen(!navbarOpen)}
            />

            <main className="main-content">
                <div className="main-layout">
                    {(navbarOpen && !isPlannerPage) && (
                        <nav className="navbar">
                            <ul>
                                <li><Link to="/" classname="navbar-links" onClick={() => setNavbarOpen(false)}>Home</Link></li>

                                <li className="nav-dropdown-item">
                                    <div className="nav-category-toggle" onClick={() => toggleDropdown('db')}>
                                        Databank {openDropdown === 'db' ? '▴' : '▾'}
                                    </div>
                                    {openDropdown === 'db' && (
                                        <ul className="nav-sub-list">
                                            {dbData.map(cat => (
                                                <li key={cat.id} className="nav-group">
                                                    <span className="nav-group-label">{cat.categoryName}</span>
                                                    {cat.pages.map(page => (
                                                        <Link key={page.id} to={`/database/page/${page.id}`} onClick={() => setNavbarOpen(false)}>
                                                             {page.title}
                                                        </Link>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>

                                <li className="nav-dropdown-item">
                                    <div className="nav-category-toggle" onClick={() => toggleDropdown('forum')}>
                                        Community {openDropdown === 'forum' ? '▴' : '▾'}
                                    </div>
                                    {openDropdown === 'forum' && (
                                        <ul className="nav-sub-list">
                                            {forumData.map(cat => (
                                                <li key={cat.id} className="nav-group">
                                                    <span className="nav-group-label">{cat.categoryName || cat.name}</span>
                                                    {cat.posts.map(post => (
                                                        <Link key={post.id} to={`/forum/post/${post.id}`} onClick={() => setNavbarOpen(false)}>
                                                             {post.title}
                                                        </Link>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>

                                <li><Link to="/planner" onClick={() => setNavbarOpen(false)}>Planner</Link></li>
                            </ul>
                        </nav>
                    )}

                    <Outlet />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Layout;