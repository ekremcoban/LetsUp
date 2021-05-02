import React, { FC, useState, useEffect, ReactNode } from 'react';

import { initilizeGlobals } from 'globals/initialize';

interface IInitializeSettingsProps {
  children: ReactNode;
}

const InitializeSettings: FC<IInitializeSettingsProps> = (
  props: IInitializeSettingsProps
) => {
  const [isSettingsInitialized, setSettingsInitialized] = useState<boolean>(
    false
  );

  useEffect(() => {
    initilizeGlobals();
    setSettingsInitialized(true);
  }, []);

  return <>{isSettingsInitialized ? props.children : undefined}</>;
};

export { InitializeSettings };
