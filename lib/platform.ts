export async function getUserByEmail(email: string) {
  try {
    const { user } = await fetch(
      `${process.env.EXPO_PUBLIC_RESERVATIONS_API_URL}/api/platform/user-by-email?email=${encodeURIComponent(email)}`,
    ).then(res => res.json());
    return user;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export async function getUserByRecordId(recordId: string) {
  try {
    const { record } = await fetch(
      `${process.env.EXPO_PUBLIC_RESERVATIONS_API_URL}/api/airtable/get-user-by-record-id`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: 'Ticket Purchases',
          recordId,
        }),
      },
    ).then(res => res.json());
    return record;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export async function addFirebaseUid({
  attendeeId,
  uid,
}: {
  attendeeId: string;
  uid: string;
}) {
  try {
    await fetch(
      `${process.env.EXPO_PUBLIC_RESERVATIONS_API_URL}/api/airtable/add-firebase-uid`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: 'Ticket Purchases',
          recordId: attendeeId,
          newFields: { 'Firebase UID': uid },
        }),
      },
    ).then(res => res.json());
  } catch (error) {
    console.log('error', error);
  }
}

export async function sendTemporaryPasswordEmail(emailAddress: string) {
  try {
    await fetch(
      `https://highlandsmusicfestival.ca/api/email-templates/send-cabin-reservation-email?emailAddress=${encodeURIComponent(emailAddress)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress }),
      },
    ).then(res => res.json());
  } catch (error) {
    console.log('error', error);
  }
}
