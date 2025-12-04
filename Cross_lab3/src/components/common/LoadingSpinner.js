import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessible>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' }, text: { marginTop: 8 } });
