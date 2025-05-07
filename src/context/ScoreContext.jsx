// import { createContext } from 'react';


    // export const ScoreContext = createContext(null);


    import React, { createContext, useState, useEffect } from 'react';


    export const ScoreContext = createContext();
   
    export const ScoreProvider = ({ children }) => {
      const [score, setScore] = useState(null);
      const [scoreFactors, setScoreFactors] = useState(null);
      const [updateTrigger, setUpdateTrigger] = useState(0);
      const [isLoading, setIsLoading] = useState(true); // Track init state
   
      const triggerUpdate = () => {
        setUpdateTrigger(prev => prev + 1);
      };
   
      useEffect(() => {
        const storedScore = localStorage.getItem('score');
        const storedFactors = localStorage.getItem('scoreFactors');
   
        if (storedScore) {
          setScore(JSON.parse(storedScore));
        }
   
        if (storedFactors) {
          setScoreFactors(JSON.parse(storedFactors));
        }
   
        setIsLoading(false); // Done initializing
      }, []);
   
      useEffect(() => {
        if (score !== null) {
          localStorage.setItem('score', JSON.stringify(score));
        }
      }, [score]);
   
      useEffect(() => {
        if (scoreFactors !== null) {
          localStorage.setItem('scoreFactors', JSON.stringify(scoreFactors));
        }
      }, [scoreFactors]);
   
      // Only render children when loading is complete
      if (isLoading) return null;
   
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
   
