import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './database-topic.css';

const DataDetailPage = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/info/pages/${id}`);
                setPage(response.data.data);
            } catch (err) {
                console.error("Fout bij ophalen pagina:", err);
            }
        };
        fetchPage();
    }, [id]);

    if (!page) return <div className="loading">Loading...</div>;

    const textSections = [
        { t: page.sectionOneTitle, c: page.sectionOneContent },
        { t: page.sectionTwoTitle, c: page.sectionTwoContent },
        { t: page.sectionThreeTitle, c: page.sectionThreeContent },
        { t: page.sectionFourTitle, c: page.sectionFourContent }
    ].filter(section => section.t);

    return (
        <div className="entity-detail-wrapper">
            <h1 className="entity-page-title">{page.title}</h1>

            <div className="entity-content-layout">
                <div className="entity-text-column">
                    <div className="entity-tldr-box">{page.tldr}</div>

                    {textSections.map((section, idx) => (
                        <div key={idx} className="info-section-text-block">
                            <h2 className="info-section-title">{section.t}</h2>
                            <p className="info-section-text">{section.c}</p>
                        </div>
                    ))}
                </div>

                {page.images && page.images.length > 0 && (
                    <aside className="entity-image-container">
                        {page.images.map((img, idx) => (
                            <div key={idx} className="image-card">
                                <img
                                    src={
                                        img.imageUrl?.startsWith('http')
                                            ? img.imageUrl
                                            : `http://localhost:8080${img.imageUrl}`
                                    }
                                    alt={img.caption || "Afbeelding"}
                                    className="entity-image"
                                    onError={(e) => {
                                        console.error("Image failed to load:", e.target.src);
                                    }}
                                />
                                {img.caption && (
                                    <p className="image-caption-text">{img.caption}</p>
                                )}
                            </div>
                        ))}
                    </aside>
                )}
            </div>
        </div>
    );
};

export default DataDetailPage;