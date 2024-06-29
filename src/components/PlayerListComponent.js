import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const PlayerListComponent = () => {
    const [players, setPlayers] = useState([]);
    const [trackedPlayers, setTrackedPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [countryFilter, setCountryFilter] = useState('');
    const navigate = useNavigate();

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
        const savedTrackedPlayers = JSON.parse(localStorage.getItem('trackedPlayers')) || [];
        setTrackedPlayers(savedTrackedPlayers);
        const savedSelectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];
        setSelectedPlayers(savedSelectedPlayers);
    }, []);

    useEffect(() => {
        localStorage.setItem('trackedPlayers', JSON.stringify(trackedPlayers));
    }, [trackedPlayers]);

    useEffect(() => {
        localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
    }, [selectedPlayers]);

    const handleTrackPlayer = (player) => {
        if (!trackedPlayers.some(tracked => tracked.player_name === player.player_name)) {
            setTrackedPlayers([...trackedPlayers, player]);
        }
    };

    const handleUntrackPlayer = (player) => {
        setTrackedPlayers(trackedPlayers.filter(tracked => tracked.player_name !== player.player_name));
    };

    const handleSelectPlayer = (player) => {
        if (selectedPlayers.includes(player)) {
            setSelectedPlayers(selectedPlayers.filter(p => p !== player));
        } else {
            setSelectedPlayers([...selectedPlayers, player]);
        }
    };

    const filteredPlayers = players.filter(player => countryFilter === '' || player.Ctry === countryFilter);

    return (
        <div className="container mt-5">
            <h1>GB&I Player Tracker</h1>
            <div className="row">
                <div className="col-md-9 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Players</h3>
                            <div className="mb-3">
                                <label htmlFor="countryFilter" className="form-label">Filter by Country:</label>
                                <select
                                    id="countryFilter"
                                    className="form-select"
                                    value={countryFilter}
                                    onChange={e => setCountryFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {Array.from(new Set(players.map(player => player.Ctry))).map(country => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Select</th>
                                        <th scope="col">Player</th>
                                        <th scope="col">Country</th>
                                        <th scope="col">School</th>
                                        <th scope="col">WAGR Rank</th>
                                        <th scope="col">DG Rank</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlayers.map(player => (
                                        <tr key={player.player_name}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlayers.includes(player)}
                                                    onChange={() => handleSelectPlayer(player)}
                                                />
                                            </td>
                                            <td onClick={() => navigate(`/player/${player.player_name}`)}>
                                                {player.player_name}
                                                {trackedPlayers.some(tracked => tracked.player_name === player.player_name) && (
                                                    <span className="badge bg-success ms-2">Tracking</span>
                                                )}
                                            </td>
                                            <td>{player.Ctry}</td>
                                            <td>{player.school}</td>
                                            <td>{player.wagr_rank}</td>
                                            <td>{player.dg_rank}</td>
                                            <td>
                                                {trackedPlayers.some(tracked => tracked.player_name === player.player_name) ? (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUntrackPlayer(player);
                                                        }}
                                                    >
                                                        Untrack
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTrackPlayer(player);
                                                        }}
                                                    >
                                                        Track
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Tracked Players</h3>
                            <ul className="list-group">
                                {trackedPlayers.map(player => (
                                    <li
                                        key={player.player_name}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        onClick={() => navigate(`/player/${player.player_name}`)}
                                    >
                                        {player.player_name}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUntrackPlayer(player);
                                            }}
                                        >
                                            Untrack
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {selectedPlayers.length > 0 && (
                <div className="fixed-bottom mb-4 ms-4">
                    <button
                        className="btn btn-info"
                        onClick={() => navigate('/compare', { state: { selectedPlayers } })}
                    >
                        Compare Selected Players
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlayerListComponent;
