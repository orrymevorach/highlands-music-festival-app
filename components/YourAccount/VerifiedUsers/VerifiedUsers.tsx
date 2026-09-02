import { StyleSheet, Text, View } from 'react-native';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
} from 'utils/style-variables';
import type { ReservationUser } from 'hooks/useReservationData';

type VerifiedUsersProps = {
  members: ReservationUser[];
  currentUserId: string;
};

export default function VerifiedUsers({
  members,
  currentUserId,
}: VerifiedUsersProps) {
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    return 1;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Names on Reservation</Text>
      {sortedMembers.map((member, index) => (
        <View key={member.id} style={styles.row}>
          <Text
            style={[
              styles.name,
              member.id !== currentUserId && styles.nonActiveUser,
            ]}
          >
            {index + 1}. {member.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontFamily: fontSecondaryBold,
    color: black,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 6,
  },
  name: {
    fontFamily: fontSecondary,
    color: darkGreen,
  },
  nonActiveUser: {
    color: mediumGreen,
  },
});
