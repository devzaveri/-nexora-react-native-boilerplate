import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

{{#if theme}}
import { useTheme, ThemeType } from '../../config/theme';
{{/if}}

{{#if localization}}
import { useTranslation } from 'react-i18next';
{{/if}}

const SettingsScreen: React.FC = () => {
  {{#if theme}}
  const { colors, isDark, toggleTheme } = useTheme();
  {{/if}}
  
  {{#if localization}}
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);
  
  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };
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
      ]}>
        {{#if localization}}
        {t('settings.title')}
        {{else}}
        Settings
        {{/if}}
      </Text>
      
      {{#if theme}}
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {{#if localization}}
          {t('settings.darkTheme')}
          {{else}}
          Dark Theme
          {{/if}}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          {{#if theme}}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={isDark ? colors.accent : colors.card}
          {{/if}}
        />
      </View>
      {{/if}}
      
      {{#if localization}}
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {t('settings.language')}
        </Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'en' && styles.activeLanguage,
              {{#if theme}}
              language === 'en' && { backgroundColor: colors.primary }
              {{/if}}
            ]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={[
              styles.languageText,
              {{#if theme}}
              { color: language === 'en' ? colors.buttonText : colors.text }
              {{/if}}
            ]}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'es' && styles.activeLanguage,
              {{#if theme}}
              language === 'es' && { backgroundColor: colors.primary }
              {{/if}}
            ]}
            onPress={() => changeLanguage('es')}
          >
            <Text style={[
              styles.languageText,
              {{#if theme}}
              { color: language === 'es' ? colors.buttonText : colors.text }
              {{/if}}
            ]}>Español</Text>
          </TouchableOpacity>
        </View>
      </View>
      {{/if}}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    {{#unless theme}}
    backgroundColor: '#F9FAFB',
    {{/unless}}
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    {{#unless theme}}
    color: '#111827',
    {{/unless}}
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLabel: {
    fontSize: 16,
    {{#unless theme}}
    color: '#4B5563',
    {{/unless}}
  },
  languageButtons: {
    flexDirection: 'row',
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    {{#unless theme}}
    backgroundColor: '#E5E7EB',
    {{/unless}}
  },
  activeLanguage: {
    {{#unless theme}}
    backgroundColor: '#3B82F6',
    {{/unless}}
  },
  languageText: {
    fontSize: 14,
    {{#unless theme}}
    color: '#4B5563',
    {{/unless}}
  }
});

export default SettingsScreen;
