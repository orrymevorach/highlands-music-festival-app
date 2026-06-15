import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'Tan Aesop': require('../assets/fonts/TAN-AESOP/TAN-AESOP.ttf'),
    'Neue Haas Light': require('../assets/fonts/Neue Haas/NeueHaasUnicaPro-Light.ttf'),
    'Neue Haas Bold': require('../assets/fonts/Neue Haas/NeueHaasUnicaPro-Bold.ttf'),
    'Neue Haas Regular': require('../assets/fonts/Neue Haas/NeueHaasUnicaPro-Regular.ttf'),
    'Neue Haas Medium': require('../assets/fonts/Neue Haas/NeueHaasUnicaPro-Medium.ttf'),
    'Neue Haas Heavy': require('../assets/fonts/Neue Haas/NeueHaasUnicaPro-Heavy.ttf'),
    Shrikhand: require('../assets/fonts/Shrikhand/Shrikhand-Regular.ttf'),
  });

  return fontsLoaded;
};
