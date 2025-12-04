import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useContacts } from '../../utils/ContactContext';
import { Colors, Fonts, Spacing, GlobalStyles } from '../../styles/globalStyles';
import { formatContactName } from '../../data/contactsData';

export default function ContactDetailsScreen({ route, navigation }) {
  const { contacts, deleteContact, toggleFavorite } = useContacts();
  const contact = useMemo(() => contacts.find((c) => c.id === route.params?.contactId), [contacts, route.params]);

  if (!contact) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Contact not found.</Text>
      </View>
    );
  }

  const fullName = formatContactName(contact);

  return (
    <ScrollView style={GlobalStyles.container} contentContainerStyle={{ padding: Spacing.lg }}>
      <View style={styles.header}>
        {contact.avatar ? (
          <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Icon name="person" size={48} color="#fff" />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.company}>{contact.company || 'No company'}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(contact.id)} style={{ padding: Spacing.sm }}>
          <Icon name={contact.favorite ? 'star' : 'star-border'} size={28} color={contact.favorite ? Colors.secondary : Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={GlobalStyles.card}>
        <Row icon="email" label="Email" value={contact.email} onPress={() => Linking.openURL(`mailto:${contact.email}`)} />
        <Row icon="phone" label="Phone" value={contact.phone} onPress={() => Linking.openURL(`tel:${contact.phone}`)} />
        {contact.notes ? <Row icon="notes" label="Notes" value={contact.notes} pressable={false} /> : null}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md }}>
        <TouchableOpacity style={[GlobalStyles.button, { flex: 1, marginRight: Spacing.sm }]} onPress={() => navigation.navigate('AddContact', { contact })}>
          <Text style={GlobalStyles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[GlobalStyles.button, { flex: 1, backgroundColor: Colors.accent, marginLeft: Spacing.sm }]}
          onPress={() =>
            Alert.alert('Delete contact', `Delete ${fullName}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: async () => { await deleteContact(contact.id); navigation.goBack(); } },
            ])
          }
        >
          <Text style={GlobalStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Row({ icon, label, value, onPress, pressable = true }) {
  return (
    <TouchableOpacity disabled={!pressable} onPress={onPress} style={styles.row} accessibilityRole={pressable ? 'button' : undefined}>
      <Icon name={icon} size={22} color={Colors.text.secondary} style={{ width: 26 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {pressable ? <Icon name="chevron-right" size={22} color={Colors.text.secondary} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarPlaceholder: { backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: Fonts.large, fontWeight: '700', color: Colors.text.primary },
  company: { color: Colors.text.secondary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: Fonts.small, color: Colors.text.secondary },
  value: { fontSize: Fonts.medium, color: Colors.text.primary, marginTop: 2 },
});
