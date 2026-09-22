import { useEffect, useState } from 'react';

const RESERVATIONS_API_URL = (
  process.env.EXPO_PUBLIC_RESERVATIONS_API_URL ||
  'https://reservations.highlandsmusicfestival.ca'
).replace(/\/$/, '');

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

export type ReservationUnit = {
  id: string;
  name: string;
  image?: { url: string }[];
};

export type UserReservationData = {
  user: ReservationUser | null;
  group: ReservationGroup;
  selectedBeds: ReservationBed[];
  cabinAndUnitData?: {
    units: ReservationUnit[];
  };
};

export default function useReservationData(userId: string | null) {
  const [data, setData] = useState<UserReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchReservationData() {
      try {
        const response = await fetch(
          `${RESERVATIONS_API_URL}/api/platform/user-reservation-data?userId=${encodeURIComponent(userId)}`,
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
  }, [userId]);

  return { data, isLoading, error };
}
