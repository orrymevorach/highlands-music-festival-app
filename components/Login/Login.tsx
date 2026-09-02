import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import {
  firebaseErrors,
  GENERIC_AUTH_ERROR,
  sendFirebasePasswordResetEmail,
  signInWithFirebaseEmailAndPassword,
} from '../../firebase/firebaseAuth';
import { addFirebaseUid, getUserByEmail } from 'lib/platform';
import { useAuth } from 'context/AuthContext';
import CreateAccount from 'components/CreateAccount/CreateAccount';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
  white,
} from 'utils/style-variables';

// mirrors src/components/loginPage/login/login.jsx's errors map
const ERRORS = {
  USER_NOT_FOUND:
    'We do not have a record of this email. Please buy a ticket, or contact info@highlandsmusicfestival.ca',
  NEEDS_ACCOUNT_SETUP:
    'Please finish setting up your account at reservations.highlandsmusicfestival.ca using the temporary password from your confirmation email.',
};

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleChangeEmail = (value: string) => {
    setError('');
    setEmail(value.toLowerCase());
  };

  const handleChangePassword = (value: string) => {
    setError('');
    setPassword(value);
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    // Step 1: try to log in with firebase
    const firebaseResponse: any = await signInWithFirebaseEmailAndPassword({
      email,
      password,
    });

    const user = await getUserByEmail(email);

    // Firebase account exists but user does not have a ticket
    if (!user) {
      setError(ERRORS.USER_NOT_FOUND);
      setIsLoading(false);
      return;
    }

    // Firebase account exists and user has a ticket, but no firebase UID yet
    if (!user.firebaseUID && firebaseResponse.user?.uid) {
      await addFirebaseUid({
        attendeeId: user.id,
        uid: firebaseResponse.user.uid,
      });
    }

    const isFirebaseLoginSuccessful = Boolean(firebaseResponse.user?.uid);
    const hasFirebaseAccount = Boolean(
      firebaseResponse.user?.uid || user.firebaseUID,
    );

    if (isFirebaseLoginSuccessful) {
      await login(user);
      setIsLoading(false);
      return;
    }

    if (firebaseResponse.error && hasFirebaseAccount) {
      setIsLoading(false);
      setError(
        firebaseErrors[firebaseResponse.error.code] || GENERIC_AUTH_ERROR,
      );
      return;
    }

    // user has a ticket but no firebase account yet (first-time login)
    setError(ERRORS.NEEDS_ACCOUNT_SETUP);
    setIsLoading(false);
  };

  if (showCreateAccount) {
    return <CreateAccount onBack={() => setShowCreateAccount(false)} />;
  }

  return (
    <Layout scroll center>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleChangeEmail}
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={handleChangePassword}
          secureTextEntry
          textContentType='password'
        />

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={white} />
          ) : (
            <Text style={styles.submitButtonText}>Log in</Text>
          )}
        </Pressable>

        <Pressable onPress={() => setShowForgotPassword(true)}>
          <Text style={styles.link}>
            Forgot your password? <Text style={styles.linkBold}>Click here</Text>{' '}
            to reset it.
          </Text>
        </Pressable>

        <Pressable onPress={() => setShowCreateAccount(true)}>
          <Text style={styles.link}>
            Don't have an account?{' '}
            <Text style={styles.linkBold}>Create an account.</Text>
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={showForgotPassword}
        animationType='slide'
        transparent
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      </Modal>
    </Layout>
  );
}

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await sendFirebasePasswordResetEmail({ email });
    setIsLoading(false);
    setShowSuccess(true);
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        {showSuccess ? (
          <>
            <Text style={styles.modalHeader}>
              If an account is associated with that email, a password reset
              link has been sent.
            </Text>
            <Text style={styles.modalText}>
              If you do not receive a password reset link in your inbox,
              check your junk mail. If you are still having issues, please
              reach out to info@highlandsmusicfestival.ca.
            </Text>
            <Pressable style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.modalHeader}>
              Please enter your email to send a password reset link
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize='none'
              keyboardType='email-address'
            />
            <Pressable
              style={styles.modalButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={white} />
              ) : (
                <Text style={styles.modalButtonText}>
                  Send Password Reset Link
                </Text>
              )}
            </Pressable>
            <Pressable onPress={onClose}>
              <Text style={styles.link}>Cancel</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  title: {
    fontFamily: fontSecondaryBold,
    fontSize: 24,
    color: darkGreen,
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    fontFamily: fontSecondary,
    color: '#b3261e',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontFamily: fontSecondary,
    color: black,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: mediumGreen,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fontSecondary,
    color: black,
    backgroundColor: white,
  },
  submitButton: {
    backgroundColor: darkGreen,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontFamily: fontSecondaryBold,
    color: white,
  },
  link: {
    fontFamily: fontSecondary,
    color: mediumGreen,
    textAlign: 'center',
    marginTop: 16,
  },
  linkBold: {
    fontFamily: fontSecondaryBold,
    color: darkGreen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: white,
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    fontFamily: fontSecondaryBold,
    fontSize: 16,
    color: darkGreen,
    marginBottom: 12,
  },
  modalText: {
    fontFamily: fontSecondary,
    color: black,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: darkGreen,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    fontFamily: fontSecondaryBold,
    color: white,
  },
});
