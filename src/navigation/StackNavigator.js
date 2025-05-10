import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CatadoresTela from '../screens/CatadoresTela';  // Importando a tela CatadoresTela
import DoadoresTela from '../screens/DoadoresTela';  // Importando a tela DoadoresTela
import TipoUsuarioScreen from '../screens/TipoUsuarioScreen'; // Importando a tela TipoUsuarioScreen
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32', // Cor do topo
        },
        headerTintColor: '#fff', // Cor do texto do cabeçalho
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }} // Remover cabeçalho na tela Welcome
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Entrar' }}
      />
      
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Pontos de Coleta' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registro' }}
      />
      <Stack.Screen
        name="CatadoresTela"
        component={CatadoresTela} // Tela para catadores
        options={{ title: 'Catadores' }}
      />
      <Stack.Screen
        name="DoadoresTela"
        component={DoadoresTela} // Tela para doadores
        options={{ title: 'Doadores' }}
      />
      <Stack.Screen
        name="TipoUsuario"
        component={TipoUsuarioScreen}
        options={{ title: 'Tipo de Usuário' }}
      />
    </Stack.Navigator>
  );
}
