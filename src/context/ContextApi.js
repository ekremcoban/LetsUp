import React from 'react'; 

const ContextApi = React.createContext({
    user: null,
    setUser: () => {},
    userPhoto: null,
    setUserPhoto: () => {},
    location: undefined,
    setLocation: () => {},
    suspendActivity: null,
    setSuspendActivity: () => {}
  });

  export default ContextApi;