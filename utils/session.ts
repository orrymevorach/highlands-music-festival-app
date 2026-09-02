import AsyncStorage from '@react-native-async-storage/async-storage';

// mirrors the web app's `user_record_id` cookie, but stored via AsyncStorage
// since there's no cookie/SSR concept on mobile
const USER_ID_KEY = 'user_record_id';

export const saveUserId = (userId: string) =>
  AsyncStorage.setItem(USER_ID_KEY, userId);

export const getUserId = () => AsyncStorage.getItem(USER_ID_KEY);

export const clearUserId = () => AsyncStorage.removeItem(USER_ID_KEY);
