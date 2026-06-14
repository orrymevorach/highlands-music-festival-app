import React, { useEffect } from 'react';
import Faq from 'components/Faq/Faq';
import { ApolloProvider } from '@apollo/client';
import { contentfulClient } from './contentful/apollo-config';
import Home from 'components/Home/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ApolloProvider client={contentfulClient}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="FAQ" component={Faq} />
        </Stack.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}
