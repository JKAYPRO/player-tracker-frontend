import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerListComponent from './components/PlayerListComponent';
import PlayerProfileComponent from './components/PlayerProfileComponent';
import PlayerComparisonComponent from './components/PlayerComparisonComponent';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<PlayerListComponent />} />
                    <Route path="/player/:playerName" element={<PlayerProfileComponent />} />
                    <Route path="/compare" element={<PlayerComparisonComponent />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
