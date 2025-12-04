import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts, Spacing, GlobalStyles } from '../../styles/globalStyles';
import { formatContactName } from '../../data/contactsData';

const safeChar = (s) => (typeof s === 'string' && s.trim() ? s.trim().charAt(0) : '');
const getInitials = (c) => {
  const initials = `${safeChar(c?.firstName)}${safeChar(c?.lastName)}`.toUpperCase();
  return initials || '•';
};

function ContactListItem({ contact, onPress, onFavoritePress, onCallPress, onMessagePress }) {
  const fullName = formatContactName(contact);
  const initials = getInitials(contact);
  const company = contact?.company || 'No company';
  const phone = contact?.phone || '';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(contact)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Contact ${fullName}${company ? `, ${company}` : ''}`}
      accessibilityHint="Tap to view contact details"
    >
      <View style={styles.avatarContainer}>
        {contact?.avatar ? (
          <Image source={{ uri: contact.avatar }} style={styles.avatar} accessible accessibilityRole="image" accessibilityLabel={`${fullName} profile picture`} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        {contact?.favorite ? (
          <View style={styles.favoriteIndicator}>
            <Icon name="star" size={12} color={Colors.secondary} />
          </View>
        ) : null}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
        <Text style={styles.company} numberOfLines={1}>{company}</Text>
        {!!phone && <Text style={styles.phone} numberOfLines={1}>{phone}</Text>}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={() => onFavoritePress?.(contact.id)}
          accessible
          accessibilityRole="button"
          accessibilityLabel={contact?.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon name={contact?.favorite ? 'star' : 'star-border'} size={20} color={contact?.favorite ? Colors.secondary : Colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => phone && onCallPress?.(phone)} accessible accessibilityRole="button" accessibilityLabel={`Call ${fullName}`} disabled={!phone}>
          <Icon name="phone" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => phone && onMessagePress?.(phone)} accessible accessibilityRole="button" accessibilityLabel={`Message ${fullName}`} disabled={!phone}>
          <Icon name="message" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { ...GlobalStyles.card, flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  avatarContainer: { position: 'relative', marginRight: Spacing.md },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: { backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.text.light, fontSize: Fonts.medium, fontWeight: 'bold' },
  favoriteIndicator: {
    position: 'absolute', bottom: -2, right: -2, backgroundColor: Colors.surface, borderRadius: 10, padding: 2,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
  },
  infoContainer: { flex: 1, marginRight: Spacing.sm },
  name: { fontSize: Fonts.medium, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 2 },
  company: { fontSize: Fonts.small, color: Colors.text.secondary, marginBottom: 2 },
  phone: { fontSize: Fonts.small, color: Colors.text.secondary },
  actionsContainer: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: Spacing.sm, marginLeft: Spacing.xs },
  favoriteButton: { marginRight: Spacing.xs },
});

export default memo(ContactListItem);
