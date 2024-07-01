import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../styles/App.css';

const PlayerProfileComponent = () => {
    const { playerName } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [note, setNote] = useState('');
    const [photo, setPhoto] = useState(null);
    const [noteSaved, setNoteSaved] = useState(false);
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const fetchPlayerByName = async (playerName) => {
            try {
                const response = await fetch('/reordered_merged_filtered_player_data.csv');
                const reader = response.body.getReader();
                const result = await reader.read();
                const decoder = new TextDecoder('utf-8');
                const csv = decoder.decode(result.value);
                const results = Papa.parse(csv, { header: true });
                const playerData = results.data.find(player => player.player_name === playerName);
                return playerData;
            } catch (error) {
                console.error('Error fetching and parsing CSV file:', error);
            }
        };

        const fetchPlayer = async () => {
            const playerData = await fetchPlayerByName(playerName);
            setPlayer(playerData);
        };

        fetchPlayer();
    }, [playerName]);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || {};
        if (playerName in savedNotes) {
            setNote(savedNotes[playerName].note);
            setTimestamp(savedNotes[playerName].timestamp);
        }
    }, [playerName]);

    useEffect(() => {
        const savedPhotos = JSON.parse(localStorage.getItem('photos')) || {};
        if (savedPhotos[playerName]) {
            setPhoto(savedPhotos[playerName]);
        }
    }, [playerName]);

    const handleSaveNote = () => {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || {};
        const currentTimestamp = new Date().toLocaleString();
        savedNotes[playerName] = { note, timestamp: currentTimestamp };
        localStorage.setItem('notes', JSON.stringify(savedNotes));
        setNoteSaved(true);
        setTimestamp(currentTimestamp);
        setTimeout(() => setNoteSaved(false), 3000); // Hide the message after 3 seconds
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const savedPhotos = JSON.parse(localStorage.getItem('photos')) || {};
            savedPhotos[playerName] = reader.result;
            localStorage.setItem('photos', JSON.stringify(savedPhotos));
            setPhoto(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    if (!player) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>Back to List</button>
            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-4">
                        {photo && <img src={photo} alt="Player" className="player-photo" />}
                    </div>
                    <h3 className="card-title text-center">{player.player_name}</h3>
                    <p className="text-center">Country: {player.Ctry}</p>
                    <p className="text-center">Current Rank: {player.Rank}</p>
                    <p className="text-center">Divisor: {player.Divisor}</p>
                    <p className="text-center">Points Average: {player["Pts Avg"]}</p>
                    <div className="mb-3">
                        <label htmlFor="playerNote" className="form-label">Notes:</label>
                        <textarea
                            id="playerNote"
                            className="form-control"
                            rows="3"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                        <button className="btn btn-primary mt-2" onClick={handleSaveNote}>Save Note</button>
                        {noteSaved && <p className="text-success mt-2">Note saved successfully at {timestamp}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="playerPhoto" className="form-label">Photo:</label>
                        <input
                            type="file"
                            className="form-control"
                            id="playerPhoto"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfileComponent;
