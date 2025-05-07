// import { createContext } from 'react';

// export const ScoreContext = createContext(null);

import React, { createContext, useState } from 'react';
export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
    const [score, setScore] = useState(null);
    const [scoreFactors, setScoreFactors] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const triggerUpdate = () => {
        setUpdateTrigger(prev => prev + 1);
    };

    return (
        <ScoreContext.Provider value={{ 
            score, 
            setScore, 
            scoreFactors, 
            setScoreFactors, 
            updateTrigger, 
            triggerUpdate 
        }}>
            {children}
        </ScoreContext.Provider>
    );
};

export default ScoreProvider;