import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import {
  createFirebaseUser,
  firebaseErrors,
  GENERIC_AUTH_ERROR,
} from '../../firebase/firebaseAuth';
import {
  addFirebaseUid,
  getUserByEmail,
  sendTemporaryPasswordEmail,
} from 'lib/platform';
import { useAuth } from 'context/AuthContext';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
  white,
} from 'utils/style-variables';

// mirrors src/components/createAccountPage/createUser/createUser.jsx's errors
const ERRORS = {
  USER_NOT_FOUND:
    'We do not have a record of this email. Please buy a ticket, or contact info@highlandsmusicfestival.ca',
  PASSWORD_DOES_NOT_MATCH:
    'This password does not match the one that was sent to your email. Please check your email and try again.',
  ENTER_VALID_EMAIL: 'Please enter a valid email address',
  PASSWORDS_DO_NOT_MATCH:
    'The new passwords entered do not match, please try again.',
};

export default function CreateAccount({ onBack }: { onBack?: () => void }) {
  const [email, setEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTempPassword, setIsSendingTempPassword] = useState(false);
  const [tempPasswordSent, setTempPasswordSent] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);

  const handleChangeEmail = (value: string) => {
    setError('');
    setTempPasswordSent(false);
    setEmail(value.toLowerCase());
  };

  const handleResendTemporaryPassword = async () => {
    if (!email) {
      setError(ERRORS.ENTER_VALID_EMAIL);
      return;
    }
    setIsSendingTempPassword(true);
    await sendTemporaryPasswordEmail(email);
    setIsSendingTempPassword(false);
    setTempPasswordSent(true);
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    const user = await getUserByEmail(email);

    if (!user?.id) {
      setError(ERRORS.USER_NOT_FOUND);
      setIsLoading(false);
      return;
    }

    if (temporaryPassword !== user.temporaryPassword) {
      setError(ERRORS.PASSWORD_DOES_NOT_MATCH);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setMatchedUser(user);
  };

  if (matchedUser) {
    return <UpdatePassword user={matchedUser} />;
  }

  return (
    <Layout scroll center>
      <View style={styles.container}>
        <Text style={styles.title}>Create An Account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleChangeEmail}
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
        />

        <Text style={styles.label}>
          Temporary Password <Text style={styles.hint}>(The one sent to your email)</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={temporaryPassword}
          onChangeText={value => {
            setError('');
            setTemporaryPassword(value);
          }}
          secureTextEntry
          textContentType='password'
        />

        <Pressable onPress={handleResendTemporaryPassword} disabled={isSendingTempPassword}>
          {isSendingTempPassword ? (
            <ActivityIndicator color={mediumGreen} style={styles.resendLoader} />
          ) : (
            <Text style={styles.link}>
              {tempPasswordSent ? 'Sent! \u2713' : 'Resend Temporary Password'}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </Pressable>

        {onBack && (
          <Pressable onPress={onBack}>
            <Text style={styles.link}>Back to login</Text>
          </Pressable>
        )}
      </View>
    </Layout>
  );
}

function UpdatePassword({ user }: { user: any }) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError(ERRORS.PASSWORDS_DO_NOT_MATCH);
      return;
    }

    setIsLoading(true);
    const firebaseResponse: any = await createFirebaseUser({
      email: user.emailAddress,
      password,
    });

    if (firebaseResponse.error) {
      setIsLoading(false);
      setError(
        firebaseErrors[firebaseResponse.error.code] || GENERIC_AUTH_ERROR,
      );
      return;
    }

    await addFirebaseUid({
      attendeeId: user.id,
      uid: firebaseResponse.user.uid,
    });

    await login(user);
    setIsLoading(false);
  };

  return (
    <Layout scroll center>
      <View style={styles.container}>
        <Text style={styles.title}>Please update your password</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={value => {
            setError('');
            setPassword(value);
          }}
          secureTextEntry
          textContentType='newPassword'
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={value => {
            setError('');
            setConfirmPassword(value);
          }}
          secureTextEntry
          textContentType='newPassword'
        />

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </Pressable>
      </View>
    </Layout>
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
  hint: {
    fontSize: 12,
    color: mediumGreen,
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
  resendLoader: {
    marginTop: 12,
    alignSelf: 'flex-start',
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
    marginTop: 12,
  },
});
