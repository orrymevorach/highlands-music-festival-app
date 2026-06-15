import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  charcoal,
  darkGreen,
  fontSecondaryBold,
  fontTertiary,
  yellow,
} from 'utils/style-variables';

import singleTicket from 'assets/emojis/single-ticket.png';
import groupTicket from 'assets/emojis/tickets.png';
import cabin from 'assets/emojis/cabin.png';
import yurt from 'assets/emojis/yurt.png';
import Button from 'components/shared/Button/Button';

const DESKTOP_COMPACT_BREAKPOINT = 1200;
const TABLET_BREAKPOINT = 1024;
const MOBILE_BREAKPOINT = 768;
const BUY_TICKETS_URL = 'https://highlandsmusicfestival.ca/tickets';

const openTicketsLink = async () => {
  const supported = await Linking.canOpenURL(BUY_TICKETS_URL);
  if (supported) {
    await Linking.openURL(BUY_TICKETS_URL);
  }
};

export default function PricingContainer() {
  const { width } = useWindowDimensions();

  const isMobile = width <= MOBILE_BREAKPOINT;
  const isTablet = width <= TABLET_BREAKPOINT;
  const isDesktopCompact = width <= DESKTOP_COMPACT_BREAKPOINT;

  const titleFontSize = isMobile
    ? 24
    : isTablet
      ? 32
      : isDesktopCompact
        ? 24
        : 32;

  const lineFontSize = isMobile
    ? 16
    : isTablet
      ? 20
      : isDesktopCompact
        ? 16
        : 20;
  const emojiSize = isMobile ? 35 : isTablet ? 45 : isDesktopCompact ? 40 : 45;
  const subTextSize = isMobile
    ? 12
    : isTablet
      ? 14
      : isDesktopCompact
        ? 12
        : 14;

  return (
    <View
      style={[
        styles.ticketPricing,
        isTablet ? styles.ticketPricingTablet : null,
        isMobile ? styles.ticketPricingMobile : null,
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            fontSize: titleFontSize,
            marginTop: isMobile ? 5 : 10,
          },
        ]}
      >
        2026 Tickets On Sale Now
      </Text>

      <View style={[styles.line, { marginVertical: isMobile ? 3 : 5 }]}>
        <Image
          source={singleTicket}
          style={[styles.emoji, { width: emojiSize, height: emojiSize }]}
        />
        <Text style={[styles.lineText, { fontSize: lineFontSize }]}>
          GA Tickets on sale
        </Text>
      </View>

      <View style={[styles.line, { marginVertical: isMobile ? 3 : 5 }]}>
        <Image
          source={groupTicket}
          style={[styles.emoji, { width: emojiSize, height: emojiSize }]}
        />
        <Text style={[styles.lineText, { fontSize: lineFontSize }]}>
          Ticket Bundles
        </Text>
        <Text
          style={[
            styles.subText,
            {
              fontSize: subTextSize,
              marginLeft: isMobile ? 8 : 10,
              paddingBottom: isMobile ? 5 : 7,
            },
          ]}
        >
          New this year
        </Text>
      </View>

      <View style={[styles.line, { marginVertical: isMobile ? 3 : 5 }]}>
        <Image
          source={cabin}
          style={[styles.emoji, { width: emojiSize, height: emojiSize }]}
        />
        <Text style={[styles.lineText, { fontSize: lineFontSize }]}>
          Cabins Available
        </Text>
        <Text
          style={[
            styles.subText,
            {
              fontSize: subTextSize,
              marginLeft: isMobile ? 8 : 10,
              paddingBottom: isMobile ? 5 : 7,
            },
          ]}
        >
          Limited quantities
        </Text>
      </View>

      <View style={[styles.line, { marginVertical: isMobile ? 3 : 5 }]}>
        <Image
          source={yurt}
          style={[styles.emoji, { width: emojiSize, height: emojiSize }]}
        />
        <Text style={[styles.lineText, { fontSize: lineFontSize }]}>
          Yurts Available
        </Text>
        <Text
          style={[
            styles.subText,
            {
              fontSize: subTextSize,
              marginLeft: isMobile ? 8 : 10,
              paddingBottom: isMobile ? 5 : 7,
            },
          ]}
        >
          New this year
        </Text>
      </View>

      <Button handleClick={openTicketsLink} isBlue>
        BUY TICKETS
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  ticketPricing: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  ticketPricingTablet: {
    marginVertical: 20,
  },
  ticketPricingMobile: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    marginBottom: 4,
    color: charcoal,
    fontWeight: '700',
    fontFamily: fontTertiary,
    textAlign: 'center',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  lineText: {
    color: charcoal,
    fontFamily: fontSecondaryBold,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  emoji: {
    marginRight: 10,
  },
  subText: {
    color: 'rgb(207, 45, 45)',
    fontFamily: fontTertiary,
    alignSelf: 'center',
    letterSpacing: 0,
    textAlign: 'center',
  },
  button: {
    marginTop: 14,
    alignSelf: 'center',
    backgroundColor: darkGreen,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: yellow,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
