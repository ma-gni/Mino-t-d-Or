import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../../styles/theme';
import { Delivery } from '../../types/models';
import StatusBadge from './StatusBadge';

interface DeliveryCardProps {
  delivery: Delivery;
  onPress: (id: number) => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(delivery.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{delivery.clientName}</Text>
        <StatusBadge status={delivery.status} />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.address}>{delivery.address}</Text>
        <Text style={styles.city}>{delivery.postalCode} {delivery.city}</Text>
        
        {delivery.products && delivery.products.length > 0 && (
          <Text style={styles.products}>
            {delivery.products.length} produit{delivery.products.length > 1 ? 's' : ''}
          </Text>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.date}>
          Livraison prévue: {new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  clientName: {
    fontSize: FONTS.large,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
    flex: 1,
  },
  cardContent: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: SPACING.medium,
    marginBottom: SPACING.small,
  },
  address: {
    fontSize: FONTS.regular,
    color: COLORS.dark,
    marginBottom: SPACING.tiny,
  },
  city: {
    fontSize: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SPACING.small,
  },
  products: {
    fontSize: FONTS.medium,
    color: COLORS.primary,
    marginTop: SPACING.small,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  date: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

export default DeliveryCard;
