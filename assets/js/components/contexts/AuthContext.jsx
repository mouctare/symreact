import React from 'react';

export default React.createContext({
    // Ici on crée notre context
    isAuthenticated: false,
    setIsAuthenticated: value => {}
});
