import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, GlobalStyles } from '../../styles/globalStyles';

export default function CustomButton({ title, onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[GlobalStyles.button, styles.btn, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={GlobalStyles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 10 },
  disabled: { backgroundColor: Colors.text.secondary },
});
