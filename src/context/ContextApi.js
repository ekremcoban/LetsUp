import React from 'react'; 

const ContextApi = React.createContext({
    profile: null,
    setProfile: () => {}
  });

  export default ContextApi;