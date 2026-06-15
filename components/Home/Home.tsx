import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';
import logo from '../../assets/Logo-No-Bkgd-min.png';
import * as Notifications from 'expo-notifications';
import Layout from 'components/shared/Layout/Layout';

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export default function Home() {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'c0c22e52-b015-4751-b312-dd4e78fd5236',
      });
      return token;
    };
    getToken();
    fadeIn();
    setTimeout(() => {
      fadeOut();
    }, 3000);
  }, []);

  return (
    <Layout center paddingHorizontal={0}>
      <Animated.View
        style={[
          {
            opacity: fadeAnim, // Bind opacity to animated value
          },
        ]}
      >
        <Image source={logo} style={styles.logo} />
      </Animated.View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 80,
  },
});
