import React, { useEffect } from 'react';
import Faq from 'components/Faq/Faq';
import { ApolloProvider } from '@apollo/client';
import { contentfulClient } from './contentful/apollo-config';
import Home from 'components/Home/Home';
import Announcements from 'components/Announcements/Announcements';
import Lineup from 'components/LineupAndSchedule/LineupAndSchedule';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { beige, darkGreen, mediumGreen } from 'utils/style-variables';
import { useCustomFonts } from './hooks/useFonts';
import { registerForPushNotificationsAsync } from 'firebase/registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, color, size) => {
  if (routeName === 'Home') {
    return <Ionicons name='home-outline' size={size} color={color} />;
  }

  if (routeName === 'Lineup') {
    return <Ionicons name='musical-notes-outline' size={size} color={color} />;
  }

  return <Ionicons name='help-circle-outline' size={size} color={color} />;
};

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
    <NavigationContainer>
      <ApolloProvider client={contentfulClient}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: darkGreen,
            tabBarInactiveTintColor: mediumGreen,
            tabBarStyle: {
              backgroundColor: beige,
              borderTopWidth: 0,
              height: 64,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarIcon: ({ color, size }) =>
              getTabIcon(route.name, color, size),
          })}
        >
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='Lineup' component={Lineup} />
          <Tab.Screen name='Announcements' component={Announcements} />
          <Tab.Screen name='FAQ' component={Faq} />
        </Tab.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}
