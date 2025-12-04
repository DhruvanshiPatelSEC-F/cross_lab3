import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl, Alert, Linking, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useContacts } from '../../utils/ContactContext';
import ContactListItem from '../../components/common/ContactListItem';
import CustomInput from '../../components/common/CustomInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { searchContacts } from '../../data/contactsData';
import { Colors, Fonts, Spacing, GlobalStyles } from '../../styles/globalStyles';

export default function ContactListScreen({ navigation }) {
  const { contacts, loading, toggleFavorite, refreshContacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'company' | 'recent'

  const displayContacts = useMemo(() => {
    let filtered = searchContacts(contacts, searchTerm);
    filtered.sort((a, b) => {
      if (sortBy === 'name') return (`${a.firstName} ${a.lastName}`.toLowerCase()).localeCompare(`${b.firstName} ${b.lastName}`.toLowerCase());
      if (sortBy === 'company') return (a.company || '').toLowerCase().localeCompare((b.company || '').toLowerCase());
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    return filtered.sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1));
  }, [contacts, searchTerm, sortBy]);

  const handleRefresh = useCallback(async () => { setRefreshing(true); await refreshContacts(); setRefreshing(false); }, [refreshContacts]);
  const handleContactPress = useCallback((c) => navigation.navigate('ContactDetails', { contactId: c.id }), [navigation]);
  const handleFavoritePress = useCallback(async (id) => { await toggleFavorite(id); }, [toggleFavorite]);
  const handleCallPress = useCallback((phone) => Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', 'Phone not supported')), []);
  const handleMessagePress = useCallback((phone) => Linking.openURL(`sms:${phone}`).catch(() => Alert.alert('Error', 'SMS not supported')), []);

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <CustomInput
          label="Search contacts"
          value={searchTerm}
          onChangeText={setSearchTerm}
          leftIcon="search"
          rightIcon={searchTerm ? 'clear' : null}
          onRightIconPress={() => setSearchTerm('')}
          placeholder="Search by name, company, or email"
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {displayContacts.length} contact{displayContacts.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </Text>
      </View>

      <FlatList
        data={displayContacts}
        renderItem={({ item }) => (
          <ContactListItem
            contact={item}
            onPress={handleContactPress}
            onFavoritePress={handleFavoritePress}
            onCallPress={handleCallPress}
            onMessagePress={handleMessagePress}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="contacts" size={80} color={Colors.text.secondary} />
            <Text style={styles.emptyTitle}>No Contacts Found</Text>
            <Text style={styles.emptyText}>{searchTerm ? `No contacts match "${searchTerm}"` : 'Add your first contact to get started'}</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, displayContacts.length === 0 && styles.emptyListContainer]}
        getItemLayout={(_, index) => ({ length: 90, offset: 90 * index, index })}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddContact')}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Add new contact"
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { ...GlobalStyles.container },
  searchContainer: {
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  statsContainer: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  statsText: { fontSize: Fonts.small, color: Colors.text.secondary },
  listContainer: { paddingBottom: 80 },
  emptyListContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyContainer: { ...GlobalStyles.centered, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: Fonts.large, fontWeight: 'bold', color: Colors.text.primary, marginTop: Spacing.md, marginBottom: Spacing.sm },
  emptyText: { fontSize: Fonts.medium, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  floatingButton: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary,
    ...GlobalStyles.centered, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
});
