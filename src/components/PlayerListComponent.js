import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Modal from 'react-modal';
import './PlayerListComponent.css';

Modal.setAppElement('#root');  // Add this line for accessibility

const PlayerListComponent = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [trackedPlayers, setTrackedPlayers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

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
                setFilteredPlayers(results.data);
            } catch (error) {
                console.error("Error fetching and parsing CSV data:", error);
            }
        };
        fetchPlayers();
    }, []);

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        if (country) {
            const filtered = players.filter(player => player.Ctry && player.Ctry.toLowerCase().includes(country.toLowerCase()));
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers(players);
        }
    };

    const handleTrackPlayer = (player) => {
        if (!trackedPlayers.includes(player)) {
            setTrackedPlayers([...trackedPlayers, player]);
        }
    };

    const handleUntrackPlayer = (player) => {
        setTrackedPlayers(trackedPlayers.filter(p => p !== player));
    };

    const openModal = (player) => {
        setSelectedPlayer(player);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedPlayer(null);
    };

    // Top 10 GB&I based on WAGR Rank
    const top10GBI = players
        .filter(player => ['Scotland', 'Wales', 'Ireland', 'England'].includes(player.Ctry))
        .sort((a, b) => parseInt(a.wagr_rank, 10) - parseInt(b.wagr_rank, 10))
        .slice(0, 10);

    return (
        <div className="container">
            <h1>GB&I Player Tracker</h1>
            <div className="top-10-gbi">
                <h3>Top 10 GB&I</h3>
                <ul>
                    {top10GBI.map((player, index) => (
                        <li key={index} onClick={() => openModal(player)}>
                            {player.player_name} - WAGR Rank: {player.wagr_rank}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="filters">
                <label>
                    Country:
                    <select value={selectedCountry} onChange={handleCountryChange}>
                        <option value="">All</option>
                        {Array.from(new Set(players.map(player => player.Ctry)))
                            .map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                    </select>
                </label>
            </div>
            <div className="content">
                <div className="player-list-section">
                    <h3>Player List</h3>
                    <ul className="player-list">
                        {filteredPlayers.map((player, index) => (
                            <li key={index} className="player-item" onClick={() => openModal(player)}>
                                <strong>{player.player_name}</strong><br />
                                Country: {player.Ctry}<br />
                                <button onClick={(e) => { e.stopPropagation(); handleTrackPlayer(player); }}>Track Player</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tracked-players">
                    <h3>Tracked Players</h3>
                    <ul>
                        {trackedPlayers.map((player, index) => (
                            <li key={index} className="player-item" onClick={() => openModal(player)}>
                                <strong>{player.player_name}</strong><br />
                                Country: {player.Ctry}<br />
                                <button onClick={(e) => { e.stopPropagation(); handleUntrackPlayer(player); }}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Player Details"
                className="modal"
                overlayClassName="modal-overlay"
            >
                {selectedPlayer && (
                    <div className="modal-content">
                        <h2>{selectedPlayer.player_name}</h2>
                        <div className="player-details">
                            <p><strong>Sample Size:</strong> {selectedPlayer.sample_size}</p>
                            <p><strong>School:</strong> {selectedPlayer.school}</p>
                            <p><strong>DG Rank:</strong> {selectedPlayer.dg_rank}</p>
                            <p><strong>DG Change:</strong> {selectedPlayer.dg_change}</p>
                            <p><strong>WAGR Rank:</strong> {selectedPlayer.wagr_rank}</p>
                            <p><strong>WAGR Change:</strong> {selectedPlayer.wagr_change}</p>
                            <p><strong>DG Index:</strong> {selectedPlayer.dg_index}</p>
                            <p><strong>Rank:</strong> {selectedPlayer.Rank}</p>
                            <p><strong>Move:</strong> {selectedPlayer.Move}</p>
                            <p><strong>Country:</strong> {selectedPlayer.Ctry}</p>
                        </div>
                        <button onClick={closeModal} className="close-modal-button">Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PlayerListComponent;
