import React from 'react'; 

const ContextApi = React.createContext({
    user: null,
    setUser: () => {},
    userPhoto: null,
    setUserPhoto: () => {},
    location: undefined,
    setLocation: () => {},
    suspendActivity: null,
    setSuspendActivity: () => {},
    isSameCity: null,
    setIsSameCity: () => {},
    newNotifications: 0,
    setNewNotifications: (item) => {},
    notifications: 0,
    setNotifications: (item) => {},
  });

  export default ContextApi;