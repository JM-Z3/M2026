import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
    </>
  );
}
