import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const PlayerComparisonComponent = () => {
    const { state } = useLocation();
    const { selectedPlayers } = state || { selectedPlayers: [] };
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>Back to List</button>
            <h3 className="card-title">Player Comparison</h3>
            {selectedPlayers.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Player</th>
                            <th scope="col">Country</th>
                            <th scope="col">School</th>
                            <th scope="col">WAGR Rank</th>
                            <th scope="col">DG Rank</th>
                            <th scope="col">Sample Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPlayers.map(player => (
                            <tr key={player.player_name}>
                                <td>{player.player_name}</td>
                                <td>{player.Ctry}</td>
                                <td>{player.school}</td>
                                <td>{player.wagr_rank}</td>
                                <td>{player.dg_rank}</td>
                                <td>{player.sample_size}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No players selected for comparison.</p>
            )}
        </div>
    );
};

export default PlayerComparisonComponent;
