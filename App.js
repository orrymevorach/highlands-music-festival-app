import React, { useEffect } from 'react';
import { useCustomFonts } from './hooks/useFonts';
import { registerForPushNotificationsAsync } from 'firebase/registerForPushNotificationsAsync';
import { AuthProvider } from 'context/AuthContext';
import Navigation from 'components/Navigation/Navigation';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const fontsLoaded = useCustomFonts();

  // placeholder
  const user = null;
  useEffect(() => {
    registerForPushNotificationsAsync(user?.uid || null);
  }, [user?.uid]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
