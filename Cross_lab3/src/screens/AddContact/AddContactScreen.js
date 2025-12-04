import React, { useRef, useState, useCallback } from 'react';
import { View, ScrollView, Alert, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useContacts } from '../../utils/ContactContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { validateContact } from '../../data/contactsData';
import { Colors, Spacing, GlobalStyles } from '../../styles/globalStyles';

export default function AddContactScreen({ navigation, route }) {
  const { addContact, updateContact } = useContacts();
  const existing = route?.params?.contact;
  const isEdit = !!existing;

  const [formData, setFormData] = useState({
    firstName: existing?.firstName || '',
    lastName: existing?.lastName || '',
    email: existing?.email || '',
    phone: existing?.phone || '',
    company: existing?.company || '',
    notes: existing?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const lastNameRef = useRef(); const emailRef = useRef(); const phoneRef = useRef(); const companyRef = useRef(); const notesRef = useRef();

  const handleFieldChange = useCallback((field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  }, [errors]);

  const handleSubmit = useCallback(async () => {
    const { isValid, errors: v } = validateContact(formData);
    if (!isValid) { setErrors(v); return; }
    setLoading(true);
    try {
      if (isEdit) { await updateContact(existing.id, formData); Alert.alert('Success', 'Contact updated'); }
      else { await addContact(formData); Alert.alert('Success', 'Contact added'); }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save contact. Please try again.');
    } finally { setLoading(false); }
  }, [formData, isEdit, existing, addContact, updateContact, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <CustomInput label="First Name" value={formData.firstName} onChangeText={(v) => handleFieldChange('firstName', v)} error={errors.firstName} leftIcon="person" returnKeyType="next" onSubmitEditing={() => lastNameRef.current?.focus()} blurOnSubmit={false} />
          <CustomInput ref={lastNameRef} label="Last Name" value={formData.lastName} onChangeText={(v) => handleFieldChange('lastName', v)} error={errors.lastName} leftIcon="person-outline" returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} blurOnSubmit={false} />
          <CustomInput ref={emailRef} label="Email" value={formData.email} onChangeText={(v) => handleFieldChange('email', v)} error={errors.email} leftIcon="email" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" onSubmitEditing={() => phoneRef.current?.focus()} blurOnSubmit={false} />
          <CustomInput ref={phoneRef} label="Phone" value={formData.phone} onChangeText={(v) => handleFieldChange('phone', v)} error={errors.phone} leftIcon="phone" keyboardType="phone-pad" returnKeyType="next" onSubmitEditing={() => companyRef.current?.focus()} blurOnSubmit={false} />
          <CustomInput ref={companyRef} label="Company" value={formData.company} onChangeText={(v) => handleFieldChange('company', v)} leftIcon="business" returnKeyType="next" onSubmitEditing={() => notesRef.current?.focus()} blurOnSubmit={false} />
          <CustomInput ref={notesRef} label="Notes" value={formData.notes} onChangeText={(v) => handleFieldChange('notes', v)} leftIcon="notes" multiline numberOfLines={4} returnKeyType="done" />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton title={isEdit ? 'Update Contact' : 'Add Contact'} onPress={handleSubmit} loading={loading} disabled={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { ...GlobalStyles.container },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flex: 1 },
  formContainer: { padding: Spacing.md, paddingBottom: Spacing.xl },
  buttonContainer: {
    padding: Spacing.md, paddingTop: Spacing.sm, backgroundColor: Colors.surface,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
});
