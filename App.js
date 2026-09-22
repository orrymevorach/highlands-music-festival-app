import React, { useEffect } from 'react';
import { useCustomFonts } from './hooks/useFonts';
import { registerForPushNotificationsAsync } from './firebase/registerForPushNotificationsAsync';
import { AuthProvider } from 'context/AuthContext';
import Navigation from 'components/Navigation/Navigation';
import * as Notifications from 'expo-notifications';
import { useAuth } from 'context/AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PushNotificationRegistration />
      <Navigation />
    </AuthProvider>
  );
}

function PushNotificationRegistration() {
  const { user } = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync(user?.id || null);
  }, [user?.id]);

  return null;
}
