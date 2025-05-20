import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';

{{#if theme}}
import { ThemeProvider } from './src/config/theme';
{{/if}}

{{#if localization}}
import { LocalizationProvider } from './src/localization';
{{/if}}

{{#if state}}
{{#if (eq state "redux")}}
import { Provider } from 'react-redux';
import { store } from './src/store';
{{/if}}
{{/if}}

{{#if navigation}}
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation';
{{/if}}

const App = () => {
  return (
    {{#if theme}}
    <ThemeProvider>
    {{/if}}
    {{#if localization}}
    <LocalizationProvider>
    {{/if}}
    {{#if state}}
    {{#if (eq state "redux")}}
    <Provider store={store}>
    {{/if}}
    {{/if}}
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {{#if navigation}}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      {{else}}
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to {{name}}!</Text>
        <Text style={styles.subtitle}>Edit App.js to get started</Text>
      </View>
      {{/if}}
    </SafeAreaView>
    {{#if state}}
    {{#if (eq state "redux")}}
    </Provider>
    {{/if}}
    {{/if}}
    {{#if localization}}
    </LocalizationProvider>
    {{/if}}
    {{#if theme}}
    </ThemeProvider>
    {{/if}}
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    {{#if theme}}
    // Theme is handled by ThemeProvider
    {{else}}
    backgroundColor: '#F3F4F6',
    {{/if}}
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    {{#if theme}}
    // Color is handled by ThemeProvider
    {{else}}
    color: '#1F2937',
    {{/if}}
  },
  subtitle: {
    fontSize: 16,
    {{#if theme}}
    // Color is handled by ThemeProvider
    {{else}}
    color: '#4B5563',
    {{/if}}
  },
});

export default App;
