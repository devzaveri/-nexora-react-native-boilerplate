import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

{{#if theme}}
import { useTheme } from '../../config/theme';
{{/if}}

const HomeScreen = ({ navigation }) => {
  {{#if theme}}
  const { colors } = useTheme();
  {{/if}}
  
  return (
    <View style={[
      styles.container,
      {{#if theme}}
      { backgroundColor: colors.background }
      {{/if}}
    ]}>
      <Text style={[
        styles.title,
        {{#if theme}}
        { color: colors.text }
        {{/if}}
      ]}>Welcome to {{name}}</Text>
      
      <Text style={[
        styles.subtitle,
        {{#if theme}}
        { color: colors.textSecondary }
        {{/if}}
      ]}>This is the Home Screen</Text>
      
      <TouchableOpacity
        style={[
          styles.button,
          {{#if theme}}
          { backgroundColor: colors.primary }
          {{/if}}
        ]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={[
          styles.buttonText,
          {{#if theme}}
          { color: colors.buttonText }
          {{/if}}
        ]}>Go to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    {{#unless theme}}
    backgroundColor: '#F9FAFB',
    {{/unless}}
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    {{#unless theme}}
    color: '#111827',
    {{/unless}}
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    {{#unless theme}}
    color: '#4B5563',
    {{/unless}}
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    {{#unless theme}}
    backgroundColor: '#3B82F6',
    {{/unless}}
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    {{#unless theme}}
    color: '#FFFFFF',
    {{/unless}}
  }
});

export default HomeScreen;
