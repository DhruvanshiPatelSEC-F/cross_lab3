import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomEmpty({ title = 'No data', subtitle = 'Try again later.' }) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${title}. ${subtitle}`}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{subtitle}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { marginTop: 6, color: '#666' },
});
