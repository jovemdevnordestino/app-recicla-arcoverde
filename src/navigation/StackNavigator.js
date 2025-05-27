import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas principais
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TipoUsuarioScreen from '../screens/TipoUsuarioScreen';
import PerfilScreen from '../screens/PerfilScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import NoticiasScreen from "../screens/NoticiasScreen"
import  GameScreen from "../screens/GameScreen"
import SobreScreen from "../screens/SobreScreen"
import ImpactoScreen from "../screens/ImpactoScreen"

// Telas do Catador
import CatadoresTela from '../screens/CatadoresScreens/CatadoresTela';
import DoacoesScreen from '../screens/CatadoresScreens/DoacoesScreen';
// Telas do Doador
import DoadoresTela from '../screens/DoadoresScreens/DoadoresTela';
import NovaDoacao from '../screens/DoadoresScreens/NovaDoacao';
import MinhasDoacoes from '../screens/DoadoresScreens/MinhasDoacoes';



const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{
        animation: 'fade_from_bottom',
        gestureEnabled: true,
        presentation: 'card',
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Telas de Autenticação */}
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, presentation: 'modal' , presentationTime: 1000 }} />
      <Stack.Screen name="Register" component={RegisterScreen}  options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="TipoUsuario" component={TipoUsuarioScreen} options={{ headerShown: false }} />

      {/* Telas do Catador */}
      <Stack.Screen name="CatadoresTela" component={CatadoresTela} options={{ headerShown: false, title: 'Catador' }} />
      <Stack.Screen name="DoacoesDisponiveis" component={DoacoesScreen} options={{ headerShown: false, title: 'Doações Disponíveis' }} />
      {/* Telas do Doador */}
      <Stack.Screen name="DoadoresTela" component={DoadoresTela} options={{ headerShown: false,title: 'Doador de Recicláveis' }} />
      <Stack.Screen name="NovaDoacao" component={NovaDoacao} options={{ headerShown: false, title: 'Nova Doação' }} />
      <Stack.Screen name="MinhasDoacoes" component={MinhasDoacoes} options={{ headerShown: false, title: 'Minhas Doações feitas' }} />

      {/* Telas de Perfil */}
      <Stack.Screen name="PerfilScreen" component={PerfilScreen} options={{headerShown: false, title: 'Meu Perfil' }} />

      
      <Stack.Screen
       name="Noticias" 
       component={ NoticiasScreen } 
       options={{ headerShown: false, title: 'Notícias' }}  />
       
    <Stack.Screen
      name="GameScreen"
      component={GameScreen}
      options={{headerShown: false, title: 'Jogo do Saber' }}
    />
    <Stack.Screen
      name="sobre"
      component={SobreScreen}
      options={{ headerShown: false, title: 'sobre' }}
    />
    <Stack.Screen
      name="Impacto"
      component={ImpactoScreen}
      options={{ headerShown: false, title: 'Impacto' }}
      />
  </Stack.Navigator>
  );
}
