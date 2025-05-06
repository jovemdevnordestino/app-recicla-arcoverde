import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator'; // Importando o StackNavigator

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator /> {/* Navegação de telas no StackNavigator */}
    </NavigationContainer>
  );
}
