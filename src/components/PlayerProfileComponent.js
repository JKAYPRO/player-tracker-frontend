import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../App.css';

const PlayerProfileComponent = () => {
    const { playerName } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [note, setNote] = useState('');
    const [photo, setPhoto] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('/reordered_merged_filtered_player_data.csv');
                const reader = response.body.getReader();
                const result = await reader.read();
                const decoder = new TextDecoder('utf-8');
                const csv = decoder.decode(result.value);
                const results = Papa.parse(csv, { header: true });
                setPlayers(results.data);
            } catch (error) {
                console.error('Error fetching and parsing CSV file:', error);
            }
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (players.length > 0) {
            const foundPlayer = players.find(p => p.player_name === playerName);
            if (foundPlayer) {
                setPlayer(foundPlayer);
                const savedNote = localStorage.getItem(`note_${foundPlayer.player_name}`);
                if (savedNote) setNote(savedNote);
                const savedPhoto = localStorage.getItem(`photo_${foundPlayer.player_name}`);
                if (savedPhoto) setPhoto(savedPhoto);
            }
        }
    }, [players, playerName]);

    const handleSaveNote = () => {
        localStorage.setItem(`note_${player.player_name}`, note);
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target.result);
                localStorage.setItem(`photo_${player.player_name}`, e.target.result);
            };
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
                    <p className="text-center">WAGR Rank: {player.wagr_rank}</p>
                    <p className="text-center">DG Rank: {player.dg_rank}</p>
                    <p className="text-center">School: {player.school}</p>
                    <p className="text-center">Sample Size: {player.sample_size}</p>
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
