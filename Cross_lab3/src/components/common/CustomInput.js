import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, Fonts, Spacing, GlobalStyles } from '../../styles/globalStyles';

const CustomInput = forwardRef(
  ({ label, value, onChangeText, error, leftIcon, rightIcon, onRightIconPress, secureTextEntry = false, multiline = false, numberOfLines = 1, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(!secureTextEntry);
    const animatedValue = new Animated.Value(value ? 1 : 0);

    const handleFocus = () => {
      setFocused(true);
      Animated.timing(animatedValue, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    };
    const handleBlur = () => {
      setFocused(false);
      if (!value) Animated.timing(animatedValue, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const labelStyle = {
      position: 'absolute',
      left: leftIcon ? 45 : 15,
      top: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [18, -8] }),
      fontSize: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
      color: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [Colors.text.secondary, focused ? Colors.primary : Colors.text.secondary] }),
      backgroundColor: Colors.background,
      paddingHorizontal: 4,
      zIndex: 1,
    };

    return (
      <View style={styles.container}>
        <View style={[styles.inputContainer, focused && styles.inputContainerFocused, error && styles.inputContainerError]}>
          {leftIcon && <Icon name={leftIcon} size={24} color={focused ? Colors.primary : Colors.text.secondary} style={styles.leftIcon} />}

          <Animated.Text style={labelStyle}>{label}</Animated.Text>

          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
              multiline && styles.multilineInput,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
            accessible
            accessibilityLabel={label}
            accessibilityHint={error ? `${label} field has an error: ${error}` : `${label} input field`}
            {...props}
          />

          {secureTextEntry && (
            <TouchableOpacity style={styles.rightIcon} onPress={() => setShowPassword(!showPassword)} accessible accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}

          {rightIcon && !secureTextEntry && (
            <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress} accessible accessibilityRole="button">
              <Icon name={rightIcon} size={24} color={focused ? Colors.primary : Colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <Text style={styles.errorText} accessible accessibilityRole="alert">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  inputContainer: { position: 'relative', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.surface, minHeight: 56 },
  inputContainerFocused: { borderColor: Colors.primary, borderWidth: 2 },
  inputContainerError: { borderColor: Colors.accent },
  input: { fontSize: Fonts.medium, color: Colors.text.primary, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 12, minHeight: 56 },
  inputWithLeftIcon: { paddingLeft: 50 },
  inputWithRightIcon: { paddingRight: 50 },
  multilineInput: { minHeight: 100, textAlignVertical: 'top' },
  leftIcon: { position: 'absolute', left: 15, top: 16, zIndex: 2 },
  rightIcon: { position: 'absolute', right: 15, top: 16, zIndex: 2 },
  errorText: { ...GlobalStyles.errorText, marginTop: Spacing.xs },
});

export default CustomInput;
