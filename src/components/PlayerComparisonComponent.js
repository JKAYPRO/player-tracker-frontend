import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FlagIcon } from 'react-flag-kit';
import '../styles/App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlayerComparisonComponent = () => {
    const { state } = useLocation();
    const { selectedPlayers } = state || { selectedPlayers: [] };
    const navigate = useNavigate();

    const chartData = {
        labels: selectedPlayers.map(player => player.player_name),
        datasets: [
            {
                label: 'WAGR Rank',
                data: selectedPlayers.map(player => player.wagr_rank),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'DG Rank',
                data: selectedPlayers.map(player => player.dg_rank),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'Divisor',
                data: selectedPlayers.map(player => player.Divisor),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Player Comparison',
            },
        },
    };

    const handleDeselectPlayer = (player) => {
        const newSelectedPlayers = selectedPlayers.filter(p => p.player_name !== player.player_name);
        navigate('/compare', { state: { selectedPlayers: newSelectedPlayers } });
    };

    const getCountryCode = (country) => {
        const countryCodes = {
            'Scotland': 'GB-SCT',
            'Ireland': 'IE',
            'England': 'GB-ENG',
            'Wales': 'GB-WLS'
        };
        return countryCodes[country];
    };

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>Back to List</button>
            <h3 className="card-title">Player Comparison</h3>
            {selectedPlayers.length > 0 ? (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Player</th>
                                <th scope="col">Country</th>
                                <th scope="col">School</th>
                                <th scope="col">WAGR Rank</th>
                                <th scope="col">DG Rank</th>
                                <th scope="col">Divisor</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPlayers.map(player => (
                                <tr key={player.player_name}>
                                    <td>{player.player_name}</td>
                                    <td>
                                        {player.Ctry} <FlagIcon code={getCountryCode(player.Ctry)} size={20} />
                                    </td>
                                    <td>{player.school}</td>
                                    <td>{player.wagr_rank}</td>
                                    <td>{player.dg_rank}</td>
                                    <td>{player.Divisor}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeselectPlayer(player)}
                                        >
                                            Deselect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="chart-container">
                        <Bar data={chartData} options={options} />
                    </div>
                </>
            ) : (
                <p>No players selected for comparison.</p>
            )}
            <button
                className="btn btn-danger mt-4"
                onClick={() => navigate('/compare', { state: { selectedPlayers: [] } })}
            >
                Deselect All
            </button>
        </div>
    );
};

export default PlayerComparisonComponent;
