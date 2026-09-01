import { useEffect, useState } from 'react';
import { TEST_USER_ID } from 'utils/constants';

export type ReservationBed = {
  bedName: string;
  id?: string;
  name?: string;
  emailAddress?: string;
};

export type ReservationCabin = {
  id: string;
  name: string;
  unit?: string[];
  category?: string[];
  additionalInformation?: string[];
};

export type ReservationUser = {
  id: string;
  name: string;
  emailAddress: string;
  cabin: ReservationCabin | null;
};

export type ReservationGroup = {
  id: string;
  members: ReservationUser[];
};

export type UserReservationData = {
  user: ReservationUser | null;
  group: ReservationGroup;
  selectedBeds: ReservationBed[];
};

export default function useReservationData() {
  const [data, setData] = useState<UserReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReservationData() {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_RESERVATIONS_API_URL}/api/platform/user-reservation-data?userId=${TEST_USER_ID}`,
        ).then(res => res.json());

        if (response.message) {
          setError(response.message);
        } else {
          setData(response);
        }
      } catch (fetchError) {
        console.log('error', fetchError);
        setError('Unable to load your reservation. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchReservationData();
  }, []);

  return { data, isLoading, error };
}
