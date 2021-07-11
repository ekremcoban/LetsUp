import React from 'react'; 

const ContextApi = React.createContext({
    user: null,
    setUser: () => {},
    userPhoto: null,
    setUserPhoto: () => {},
  });

  export default ContextApi;