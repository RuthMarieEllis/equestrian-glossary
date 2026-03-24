import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1B2A4A',
          },
          headerTintColor: '#F4EFE6',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            letterSpacing: 0.8,
          },
          headerBackTitleVisible: false,
          contentStyle: {
            backgroundColor: '#F4EFE6',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'EQUESTRIAN GLOSSARY' }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({
            title: (route.params?.name || 'Category').toUpperCase(),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
