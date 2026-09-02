import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import Button from 'components/shared/Button/Button';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  fontTertiary,
  gold,
  white,
} from 'utils/style-variables';

// Sept 25, 2026, 10:00 AM ET falls during daylight saving time (EDT = UTC-4)
const TARGET_DATE = new Date(Date.UTC(2026, 8, 25, 10 + 4, 0, 0));
const BUY_TICKETS_URL = 'https://highlandsmusicfestival.ca/buy-tickets';

function getTimeParts() {
  const totalMs = Math.max(TARGET_DATE.getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  return { days, hours, minutes, seconds, totalMs };
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.timeUnit}>
      <Text style={styles.timeValue}>{pad(value)}</Text>
      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );
}

export default function TicketCountdown() {
  const [parts, setParts] = useState(getTimeParts);

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts()), 1000);
    return () => clearInterval(id);
  }, []);

  const hasSaleStarted = parts.totalMs === 0;

  return (
    <GroovyCard
      style={styles.container}
      contentStyle={styles.content}
      backgroundColor={darkGreen}
    >
      <Text style={styles.badge}>Cheapest Price Ever</Text>
      <Text style={styles.title}>
        {hasSaleStarted
          ? '2027 Tickets are on sale now!'
          : '2027 Tickets go on sale in:'}
      </Text>

      {!hasSaleStarted && (
        <View style={styles.timeRow}>
          {parts.days > 0 && <TimeUnit value={parts.days} label='days' />}
          <TimeUnit value={parts.hours} label='hrs' />
          <TimeUnit value={parts.minutes} label='min' />
          <TimeUnit value={parts.seconds} label='sec' />
        </View>
      )}

      <Text style={styles.subtitle}>
        September 25, 2026 at 10:00 AM {'\u2014'} this will be the lowest ticket
        price we ever offer, so don't miss it.
      </Text>

      {hasSaleStarted && (
        <Button
          isGold
          isSmall
          classNames={styles.buyButton}
          href={BUY_TICKETS_URL}
        >
          Buy Tickets
        </Button>
      )}
    </GroovyCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  badge: {
    fontFamily: fontSecondaryBold,
    fontSize: 12,
    color: darkGreen,
    backgroundColor: gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  title: {
    fontFamily: fontTertiary,
    fontSize: 22,
    color: white,
    textAlign: 'center',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 56,
  },
  timeValue: {
    fontFamily: fontSecondaryBold,
    fontSize: 28,
    color: gold,
  },
  timeLabel: {
    fontFamily: fontSecondary,
    fontSize: 12,
    color: white,
  },
  subtitle: {
    fontFamily: fontSecondary,
    fontSize: 13,
    color: white,
    textAlign: 'center',
  },
  buyButton: {
    marginTop: 16,
  },
});
