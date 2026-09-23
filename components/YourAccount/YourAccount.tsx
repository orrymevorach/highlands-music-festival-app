import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';
import Layout from 'components/shared/Layout/Layout';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import Button from 'components/shared/Button/Button';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';
import useReservationData from 'hooks/useReservationData';
import ReservationSummary from './ReservationSummary/ReservationSummary';
import VerifiedUsers from './VerifiedUsers/VerifiedUsers';
import BedMap from './BedMap/BedMap';
import { useAuth } from 'context/AuthContext';
import {
  deleteFirebaseUser,
  firebaseErrors,
  reauthenticateFirebaseUser,
} from '../../firebase/firebaseAuth';
import { removeFirebaseUid } from 'lib/platform';
import {
  black,
  blue,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  peach,
} from 'utils/style-variables';
import { PRIVACY_POLICY_URL, SUPPORT_URL } from 'utils/constants';

const BOOK_A_CABIN_URL = 'https://reservations.highlandsmusicfestival.ca';

export default function YourAccount() {
  const { user: authUser, logout } = useAuth();
  const { data, isLoading, error } = useReservationData(authUser?.id ?? null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [reauthenticationPassword, setReauthenticationPassword] = useState('');
  const [showReauthentication, setShowReauthentication] = useState(false);

  const deleteAccount = async () => {
    setIsDeletingAccount(true);

    const deleteResult: any = await deleteFirebaseUser();
    if (deleteResult.error) {
      setIsDeletingAccount(false);

      if (deleteResult.error?.code === 'auth/requires-recent-login') {
        setShowReauthentication(true);
        return;
      }

      Alert.alert(
        'Unable to delete account',
        'We could not delete your account right now. Please contact info@highlandsmusicfestival.ca for help.',
      );
      return;
    }

    if (authUser?.id) {
      await removeFirebaseUid({ attendeeId: authUser.id });
    }

    await logout();
    Alert.alert(
      'Account deleted',
      'Your account has been removed from the app.',
    );
  };

  const handleReauthenticate = async () => {
    if (!authUser?.emailAddress || !reauthenticationPassword) return;

    setIsReauthenticating(true);
    const result: any = await reauthenticateFirebaseUser({
      email: authUser.emailAddress,
      password: reauthenticationPassword,
    });
    setIsReauthenticating(false);

    if (result.error) {
      Alert.alert(
        'Unable to verify password',
        firebaseErrors[result.error.code] ||
          'Please check your password and try again.',
      );
      return;
    }

    setReauthenticationPassword('');
    setShowReauthentication(false);
    await deleteAccount();
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your app login and removes your account from the festival app. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: deleteAccount,
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <Layout center>
        <ActivityIndicator color={darkGreen} />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout center>
        <Text style={styles.message}>{error}</Text>
        <Button isDarkGreen isSmall handleClick={logout}>
          Log Out
        </Button>
      </Layout>
    );
  }

  if (!data?.user?.cabin) {
    return (
      <Layout center>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No cabin reservation</Text>
          <Text style={styles.emptyStateMessage}>
            You haven&apos;t reserved a cabin yet.
          </Text>
          <Button
            isDarkGreen
            classNames={styles.reserveButton}
            href={BOOK_A_CABIN_URL}
          >
            Book Your Cabin Now
          </Button>
          <Pressable onPress={logout} hitSlop={10}>
            <Text style={styles.logoutLink}>Log Out</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
              isDeletingAccount && styles.deleteButtonDisabled,
            ]}
            onPress={handleDeleteAccount}
            disabled={isDeletingAccount}
          >
            <Text style={styles.deleteButtonText}>
              {isDeletingAccount ? 'Deleting account...' : 'Delete account'}
            </Text>
          </Pressable>
        </View>
        <ReauthenticateModal
          visible={showReauthentication}
          password={reauthenticationPassword}
          isLoading={isReauthenticating}
          onChangePassword={setReauthenticationPassword}
          onCancel={() => {
            setShowReauthentication(false);
            setReauthenticationPassword('');
          }}
          onSubmit={handleReauthenticate}
        />
      </Layout>
    );
  }

  const members = data.group.members.length ? data.group.members : [data.user];
  const memberIds = new Set(members.map(({ id }) => id));
  const groupSelectedBeds = data.selectedBeds.filter(
    bed => bed.id && memberIds.has(bed.id),
  );
  const currentUserHasBed = data.selectedBeds.some(
    bed => bed.id === data.user?.id,
  );

  const unitName = Array.isArray(data.user.cabin.unit)
    ? data.user.cabin.unit[0]
    : data.user.cabin.unit;
  const unit = data.cabinAndUnitData?.units.find(
    ({ name }) => name === unitName,
  );
  const unitMapImageUrl = unit?.image?.[0]?.url;

  return (
    <Layout scroll paddingHorizontal={0}>
      <SectionHeading classNames={styles.title}>Your Account</SectionHeading>

      <GroovyCard
        style={styles.card}
        contentStyle={styles.cardContent}
        backgroundColor={blue}
      >
        <ReservationSummary
          cabin={data.user.cabin}
          unitMapImageUrl={unitMapImageUrl}
        />
      </GroovyCard>

      <GroovyCard
        style={styles.card}
        contentStyle={styles.cardContent}
        backgroundColor={peach}
      >
        <VerifiedUsers members={members} currentUserId={data.user.id} />
      </GroovyCard>

      {currentUserHasBed && (
        <GroovyCard style={styles.card} contentStyle={styles.cardContent}>
          <BedMap selectedBeds={groupSelectedBeds} />
        </GroovyCard>
      )}

      <Button
        isDarkGreen
        isSmall
        classNames={styles.logoutButton}
        handleClick={logout}
      >
        Log Out
      </Button>

      <Text style={styles.deleteHelpText}>
        Deleting your account removes your app login and disconnects your
        festival reservation profile. For help with account data deletion, email
        info@highlandsmusicfestival.ca.
      </Text>

      <Pressable
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
        disabled={isDeletingAccount}
      >
        <Text style={styles.deleteButtonText}>
          {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
        </Text>
      </Pressable>

      <View style={styles.legalLinks}>
        <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(SUPPORT_URL)}>
          <Text style={styles.legalLink}>Support</Text>
        </Pressable>
      </View>

      <ReauthenticateModal
        visible={showReauthentication}
        password={reauthenticationPassword}
        isLoading={isReauthenticating}
        onChangePassword={setReauthenticationPassword}
        onCancel={() => {
          setShowReauthentication(false);
          setReauthenticationPassword('');
        }}
        onSubmit={handleReauthenticate}
      />
    </Layout>
  );
}

function ReauthenticateModal({
  visible,
  password,
  isLoading,
  onChangePassword,
  onCancel,
  onSubmit,
}: {
  visible: boolean;
  password: string;
  isLoading: boolean;
  onChangePassword: (password: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm your password</Text>
          <Text style={styles.modalMessage}>
            For security, enter your password to delete your account.
          </Text>
          <TextInput
            autoFocus
            secureTextEntry
            style={styles.modalInput}
            value={password}
            onChangeText={onChangePassword}
            textContentType='password'
          />
          <View style={styles.modalActions}>
            <Pressable onPress={onCancel} disabled={isLoading} hitSlop={10}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onSubmit}
              disabled={!password || isLoading}
              style={isLoading ? styles.modalConfirmDisabled : null}
            >
              <Text style={styles.modalConfirm}>
                {isLoading ? 'Deleting...' : 'Delete account'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  message: {
    fontFamily: fontSecondary,
    color: black,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyState: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontFamily: fontSecondaryBold,
    color: darkGreen,
    fontSize: 22,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontFamily: fontSecondary,
    color: black,
    textAlign: 'center',
  },
  reserveButton: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  logoutLink: {
    fontFamily: fontSecondary,
    color: darkGreen,
    marginTop: 18,
    textDecorationLine: 'underline',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
  },
  deleteHelpText: {
    alignSelf: 'stretch',
    marginBottom: 12,
    fontFamily: fontSecondary,
    color: black,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 28,
    padding: 8,
  },
  deleteButtonPressed: {
    opacity: 0.65,
  },
  deleteButtonDisabled: {
    opacity: 0.65,
  },
  deleteButtonText: {
    fontFamily: fontSecondary,
    color: '#a51d18',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
  },
  legalLink: {
    fontFamily: fontSecondary,
    color: darkGreen,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalContent: {
    backgroundColor: '#fffaf0',
    borderColor: '#422800',
    borderRadius: 8,
    borderWidth: 2,
    padding: 20,
  },
  modalTitle: {
    fontFamily: fontSecondaryBold,
    color: black,
    fontSize: 20,
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: fontSecondary,
    color: black,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalInput: {
    borderColor: darkGreen,
    borderRadius: 6,
    borderWidth: 1,
    color: black,
    fontFamily: fontSecondary,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginTop: 20,
  },
  modalCancel: {
    color: darkGreen,
    fontFamily: fontSecondary,
    textDecorationLine: 'underline',
  },
  modalConfirm: {
    color: '#a51d18',
    fontFamily: fontSecondaryBold,
    textDecorationLine: 'underline',
  },
  modalConfirmDisabled: {
    opacity: 0.5,
  },
});
