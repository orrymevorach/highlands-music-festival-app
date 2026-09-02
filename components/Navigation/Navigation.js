import { useEffect } from 'react';
import Faq from 'components/Faq/Faq';
import { ApolloProvider } from '@apollo/client';
import { contentfulClient } from '../../contentful/apollo-config';
import Home from 'components/Home/Home';
import Announcements from 'components/Announcements/Announcements';
import Lineup from 'components/LineupAndSchedule/LineupAndSchedule';
import YourAccount from 'components/YourAccount/YourAccount';
import Login from 'components/Login/Login';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { beige, darkGreen, mediumGreen } from 'utils/style-variables';
import { useAuth } from 'context/AuthContext';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, color, size) => {
  if (routeName === 'Home') {
    return <Ionicons name='home-outline' size={size} color={color} />;
  }

  if (routeName === 'Lineup') {
    return <Ionicons name='musical-notes-outline' size={size} color={color} />;
  }

  if (routeName === 'Account') {
    return <Ionicons name='person-outline' size={size} color={color} />;
  }

  if (routeName === 'Login') {
    return <Ionicons name='log-in-outline' size={size} color={color} />;
  }

  return <Ionicons name='help-circle-outline' size={size} color={color} />;
};

export default function Navigation() {
  const navigationRef = useNavigationContainerRef();
  const { isLoggedIn, isCheckingSession } = useAuth();

  useEffect(() => {
    if (!navigationRef.isReady()) return;
    navigationRef.navigate(isLoggedIn ? 'Account' : 'Login');
  }, [isLoggedIn]);

  if (isCheckingSession) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
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
          {isLoggedIn ? (
            <Tab.Screen name='Account' component={YourAccount} />
          ) : (
            <Tab.Screen name='Login' component={Login} />
          )}
          <Tab.Screen name='FAQ' component={Faq} />
        </Tab.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}
