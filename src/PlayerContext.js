// src/PlayerContext.js
import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [trackedPlayers, setTrackedPlayers] = useState([]);

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
    }, []);

    useEffect(() => {
        localStorage.setItem('trackedPlayers', JSON.stringify(trackedPlayers));
    }, [trackedPlayers]);

    return (
        <PlayerContext.Provider value={{ players, trackedPlayers, setTrackedPlayers }}>
            {children}
        </PlayerContext.Provider>
    );
};
