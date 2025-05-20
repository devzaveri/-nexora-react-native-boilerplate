import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

{{#if auth}}
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../hooks/useAuth';
{{/if}}

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  {{#if auth}}
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  {{/if}}
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
