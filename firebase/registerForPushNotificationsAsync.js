import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/init';

export async function registerForPushNotificationsAsync(userId = null) {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log('Missing Expo projectId');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const expoPushToken = tokenData.data;

    const deviceId = Application.getIosIdForVendorAsync
      ? await Application.getIosIdForVendorAsync()
      : Application.androidId;

    if (!deviceId) {
      console.log('Could not determine device ID');
      return null;
    }

    await setDoc(
      doc(firestore, 'pushTokens', deviceId),
      {
        expoPushToken,
        deviceId,
        userId,
        platform: Platform.OS,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return expoPushToken;
  } catch (error) {
    console.log('Error registering push notifications:', error);
    return null;
  }
}
