import React from 'react'; 

const ContextApi = React.createContext({
    user: null,
    setUser: () => {},
    userPhoto: null,
    setUserPhoto: () => {},
    location: undefined,
    setLocation: () => {},
  });

  export default ContextApi;