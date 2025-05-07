// import { createContext } from 'react';

// export const ScoreContext = createContext(null);

import React, { createContext, useState } from 'react';

export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
    const [score, setScore] = useState(null);
    const [scoreFactors, setScoreFactors] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(false); // New state to trigger update

    const triggerUpdate = () => {
        setUpdateTrigger(prev => !prev); // Toggle the state to force a re-render
    };

    return (
        <ScoreContext.Provider value={{ score, setScore, scoreFactors, setScoreFactors, updateTrigger, triggerUpdate }}>
            {children}
        </ScoreContext.Provider>
    );
};