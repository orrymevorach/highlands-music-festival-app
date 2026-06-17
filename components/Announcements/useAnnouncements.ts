import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase/init';

export function useAnnouncements() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeNotifications = onSnapshot(
      collection(firestore, 'notifications'),
      snapshot => {
        const notifications = formatRecords(snapshot);
        const sortedNotifications = sortByMostRecent(notifications);
        setItems(sortedNotifications);
        setLoading(false);
      },
      error => {
        console.log('Error loading notifications:', error);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeNotifications();
    };
  }, []);

  return { items, loading };
}

export type AnnouncementItem = {
  id: string;
  title?: string;
  body?: string;
  sentAt?: any;
  createdAt?: any;
};

function toMillis(value: any): number {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === 'function') {
    return value.toMillis();
  }

  if (typeof value.seconds === 'number') {
    return value.seconds * 1000;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortByMostRecent(
  notifications: AnnouncementItem[],
): AnnouncementItem[] {
  return [...notifications].sort((a, b) => {
    const aTime = toMillis(a.sentAt) || toMillis(a.createdAt);
    const bTime = toMillis(b.sentAt) || toMillis(b.createdAt);
    return bTime - aTime;
  });
}

function formatRecords(snapshot: any): AnnouncementItem[] {
  return snapshot.docs.map((docSnapshot: any) => ({
    id: docSnapshot.id,
    ...(docSnapshot.data() as Omit<AnnouncementItem, 'id'>),
  }));
}
