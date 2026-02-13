import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import './bulletinBoard.css'

function BulletinBoard({title, fetchUrl, linkPrefix}) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8080${fetchUrl}`);
                const data = response.data.data || [];

                const latestEntries = data
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 5);

                setEntries(latestEntries);
            } catch (error) {
                console.error("Woopsiedoopsie no bulletinboard for u!", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [fetchUrl]);

return (
    <div className="bulletin-board">
        <h3 className="bulletin-title">{title}</h3>
        {loading ? (
            <p className="loading-text">Loading...</p>
        ) : (
            <ul className="bulletin-links">
                {entries.map(entry => (
                    <li key={entry.id}>
                        <Link to={`${linkPrefix}/${entry.id}`}>
                            {entry.title}
                        </Link>
                    </li>
                ))}
            </ul>
        )}
    </div>
)}

export default BulletinBoard;

