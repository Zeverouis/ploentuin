import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './planner.css';
import { PlannerIcons } from '../../assets/planner/planner-icons';

const Planner = ({ plannerId }) => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();
    const [dbId, setDbId] = useState(null);
    const activeId = urlId || dbId || plannerId;
    const skipNextLoad = useRef(false);

    const [planner, setPlanner] = useState({
        title: "Mijn Tuin",
        rows: 8,
        columns: 15,
        items: []
    });

    const [catalog, setCatalog] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cellSize, setCellSize] = useState(60);
    const [activeCategory, setActiveCategory] = useState('');
    const [isExportOpen, setIsExportOpen] = useState(false);
    const scrollRef = useRef(null);

    const performSave = async (silent = false) => {
        const token = localStorage.getItem('token');

        if (!token && !silent) {
            alert('je moet ingelogd zijn om de planner op te slaan');
            return null;
        }

        skipNextLoad.current = true;
        const dto = {
            title: planner.title || "Mijn Tuin",
            rows: Number(planner.rows),
            columns: Number(planner.columns),
            items: planner.items.map(i => ({
                row: i.row,
                column: i.column,
                catalogItem: { id: i.catalogItem.id }
            }))
        };

        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        try {
            if (activeId && activeId !== 'new') {
                try {
                    await axios.patch(`http://localhost:8080/planner/${activeId}`, dto, config);
                    if (!silent && token) alert("Planner bijgewerkt!");
                    return activeId;
                } catch (err) {
                    if (err.response?.status !== 403) {
                        console.error(err);
                        if (!silent) alert("Opslaan mislukt.");
                        return null;
                    }
                }
            }

            const res = await axios.post('http://localhost:8080/planner', dto, config);
            const confirmedId = res.data.data.id;
            setDbId(confirmedId);

            if (urlId !== confirmedId.toString()) {
                navigate(`/planner/${confirmedId}`, { replace: true });
            }

            if (!silent && token) alert("Opgeslagen!");
            return confirmedId;
        } catch (e) {
            console.error(e);
            skipNextLoad.current = false;
            if (!silent) alert("Opslaan mislukt.");
            return null;
        }
    };

    const handleExport = async (format) => {
        const idToExport = await performSave(true);
        if (!idToExport) return;

        await new Promise(resolve => setTimeout(resolve, 300));
        const token = localStorage.getItem('token');
        const config = {
            responseType: 'arraybuffer',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        };

        try {
            const extensions = { pdf: 'pdf', word: 'docx', excel: 'xlsx', png: 'png' };
            const ext = extensions[format] || format;
            const res = await axios.get(`http://localhost:8080/planner/${idToExport}/export/${format}`, config);

            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${planner.title.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setIsExportOpen(false);
        } catch (e) {
            console.error(e);
            alert("Export mislukt.");
        }
    };

    useEffect(() => {
        const load = async () => {
            if (skipNextLoad.current) { skipNextLoad.current = false; return; }
            try {
                const catRes = await axios.get('http://localhost:8080/planner/catalog');
                const catData = catRes.data.data || catRes.data;
                setCatalog(catData);
                const types = [...new Set(catData.map(i => i.type))];
                setCategories(types);
                if (types.length > 0) setActiveCategory(types[0]);

                if (urlId && urlId !== 'new') {
                    const token = localStorage.getItem('token');
                    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                    const planRes = await axios.get(`http://localhost:8080/planner/${urlId}`, config);
                    const d = planRes.data.data;
                    if (d) {
                        setPlanner({ title: d.title, rows: d.rows, columns: d.columns, items: d.items || [] });
                    }
                }
            } catch (e) { console.error(e); }
        };
        load().catch(console.error);
    }, [urlId]);

    const updateDim = (dim, val) => setPlanner(p => ({ ...p, [dim]: Math.max(1, p[dim] + val) }));

    const scrollCatalog = (dir) => {
        if (scrollRef.current) {
            const move = dir === 'next' ? 200 : -200;
            scrollRef.current.scrollBy({ top: move, behavior: 'smooth' });
        }
    };

    return (
        <div className="planner-container">
            <header className="planner-header">
                <div className="header-section left">
                    <div className="controls-row">
                        <div className="dimension-controls">
                            <div className="ctrl-group">
                                <span className="dim-label">Rijen</span>
                                <div className="counter-controls">
                                    <button onClick={() => updateDim('rows', -1)}>−</button>
                                    <span className="val-box">{planner.rows}</span>
                                    <button onClick={() => updateDim('rows', 1)}>+</button>
                                </div>
                            </div>
                            <div className="ctrl-group">
                                <span className="dim-label">Kolommen</span>
                                <div className="counter-controls">
                                    <button onClick={() => updateDim('columns', -1)}>−</button>
                                    <span className="val-box">{planner.columns}</span>
                                    <button onClick={() => updateDim('columns', 1)}>+</button>
                                </div>
                            </div>
                        </div>
                        <input className="planner-title-input" value={planner.title} onChange={e => setPlanner({...planner, title: e.target.value})} />
                    </div>
                </div>

                <div className="header-section center">
                    <h1 className="scale-label">1 vakje = {cellSize / 2} cm</h1>
                    <div className="numeric-input-wrapper">
                        <input type="number" value={cellSize} onChange={e => setCellSize(parseInt(e.target.value) || 0)} />
                        <span className="unit">px</span>
                    </div>
                </div>

                <div className="header-section right">
                    <button className="gold-icon-btn" onClick={() => performSave(false)}>
                        <img src={PlannerIcons.save} alt="Save" />
                    </button>
                    <div className="export-wrapper">
                        <button className="gold-icon-btn" onClick={() => setIsExportOpen(!isExportOpen)}>
                            <img src={PlannerIcons.export} alt="Export" />
                        </button>
                        {isExportOpen && (
                            <div className="export-dropdown">
                                <button onClick={() => handleExport('png')}>PNG</button>
                                <button onClick={() => handleExport('pdf')}>PDF</button>
                                <button onClick={() => handleExport('word')}>WORD</button>
                                <button onClick={() => handleExport('excel')}>EXCEL</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="planner-content">
                <div className="grid-outer-viewport">
                    <div className="garden-grid" style={{
                        gridTemplateColumns: `repeat(${planner.columns}, ${cellSize}px)`,
                        gridTemplateRows: `repeat(${planner.rows}, ${cellSize}px)`,
                        width: 'max-content'
                    }}>
                        {[...Array(planner.rows * planner.columns)].map((_, i) => {
                            const r = Math.floor(i / planner.columns);
                            const c = i % planner.columns;
                            const item = planner.items.find(p => p.row === r && p.column === c);
                            return (
                                <div key={`${r}-${c}`} className="grid-tile"
                                     onClick={() => {
                                         if (!selectedItem) return;
                                         const newItems = [...planner.items];
                                         const idx = newItems.findIndex(i => i.row === r && i.column === c);
                                         idx > -1 ? newItems.splice(idx, 1) : newItems.push({ row: r, column: c, catalogItem: selectedItem });
                                         setPlanner({...planner, items: newItems});
                                     }}
                                     style={{ width: cellSize, height: cellSize, backgroundColor: item ? item.catalogItem.colour : '#ffffff' }}>
                                    {item?.catalogItem?.imageUrl && <img src={item.catalogItem.imageUrl} className="tile-icon" alt="" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <aside className="planner-sidebar">
                    <h2 className="sidebar-title">Catalogus</h2>
                    <nav className="category-tabs">
                        {categories.map(cat => (
                            <button key={cat} className={`tab-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                                {cat ? cat.replace('_', ' ').split(' ')[0] : ''}
                            </button>
                        ))}
                    </nav>
                    <div className="catalog-list" ref={scrollRef}>
                        {catalog.filter(i => i.type === activeCategory).map(item => (
                            <div key={item.id} className={`catalog-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                                 onClick={() => setSelectedItem(item)} style={{ borderLeft: `5px solid ${item.colour}` }}>
                                <img src={item.imageUrl} className="catalog-thumb" alt="" />
                                <span className="item-name">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="catalog-pagination">
                        <button className="nav-arrow" onClick={() => scrollCatalog('prev')}><img src={PlannerIcons.arrowLeft} alt="" /></button>
                        <button className="nav-arrow" onClick={() => scrollCatalog('next')}><img src={PlannerIcons.arrowRight} alt="" /></button>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Planner;