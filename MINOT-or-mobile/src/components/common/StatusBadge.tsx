import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, BORDER_RADIUS, SPACING } from '../../styles/theme';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'delivered';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'delivered':
        return [styles.badge, styles.deliveredBadge];
      case 'pending':
        return [styles.badge, styles.pendingBadge];
      case 'processing':
        return [styles.badge, styles.processingBadge];
      default:
        return [styles.badge];
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      default:
        return '';
    }
  };

  return (
    <View style={getStatusStyles()}>
      <Text style={styles.badgeText}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: SPACING.tiny,
    paddingHorizontal: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'flex-start',
  },
  deliveredBadge: {
    backgroundColor: COLORS.success,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
  },
  processingBadge: {
    backgroundColor: COLORS.info,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONTS.small,
    fontWeight: FONTS.semiBold,
  },
});

export default StatusBadge;
