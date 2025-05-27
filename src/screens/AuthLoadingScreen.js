import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // ajuste o caminho conforme seu projeto

/**
 * AuthLoadingScreen
 * 
 * Tela de carregamento que verifica se o usuário já está autenticado.
 * 
 * Funcionalidades:
 * - Detecta estado de autenticação do Firebase Auth.
 * - Consulta o Firestore para saber o tipo do usuário.
 * - Redireciona para telas específicas baseadas no tipo do usuário.
 * - Exibe spinner enquanto realiza as verificações.
 * - Tratamento completo de erros.
 * - Evita múltiplas navegações indevidas.
 * 
 * Ideal para garantir que o usuário não precise logar toda vez que abrir o app.
 */

export default function AuthLoadingScreen() {
  const navigation = useNavigation();
  const auth = getAuth();

  // Estado que indica se está carregando as informações do usuário
  const [isLoading, setIsLoading] = useState(true);

  // Estado que armazena o usuário autenticado do Firebase, se houver
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Função para navegar para a tela correta, resetando histórico
   * @param {string} routeName - nome da tela para onde navegar
   */
  const resetAndNavigate = useCallback((routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  }, [navigation]);

  /**
   * Função para buscar o tipo do usuário no Firestore
   * @param {string} uid - UID do usuário Firebase
   * @returns {Promise<string|null>} - tipo do usuário ou null se não encontrado
   */
  const fetchUserType = useCallback(async (uid) => {
    try {
      const userDocRef = doc(db, 'usuarios', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return data.tipo || null;
      } else {
        console.warn(`Documento do usuário ${uid} não encontrado no Firestore.`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário no Firestore:', error);
      return null;
    }
  }, []);

  /**
   * Função principal que executa quando o usuário é autenticado ou não
   * @param {User|null} user - objeto usuário do Firebase ou null
   */
  const handleUserChanged = useCallback(async (user) => {
    setIsLoading(true);
    setCurrentUser(user);

    if (user) {
      // Usuário autenticado, buscar tipo e redirecionar
      const tipo = await fetchUserType(user.uid);

      if (tipo === 'catador') {
        resetAndNavigate('CatadoresTela');
      } else if (tipo === 'doador') {
        resetAndNavigate('DoadoresTela');
      } else {
        Alert.alert(
          'Erro no cadastro',
          'Tipo de usuário inválido ou não definido. Por favor, faça login novamente ou refaça seu cadastro.'
        );
        resetAndNavigate('Welcome');
      }
    } else {
      // Nenhum usuário autenticado, direciona para Welcome/Login
      resetAndNavigate('Welcome');
    }
    setIsLoading(false);
  }, [fetchUserType, resetAndNavigate]);

  useEffect(() => {
    // Escutar estado de autenticação Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleUserChanged(user);
    });

    // Cleanup para evitar memory leaks
    return () => unsubscribe();
  }, [auth, handleUserChanged]);

  /**
   * UI enquanto carrega o estado de autenticação e dados do usuário
   */
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Carregando, aguarde...</Text>
      </View>
    );
  }

  /**
   * Caso extremo: se não estiver carregando e não tiver usuário, mostra mensagem
   * (Na prática, nunca cai aqui, porque sempre redireciona)
   */
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Erro inesperado: usuário não autenticado.</Text>
    </View>
  );
}

// Estilos organizados e limpos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // verde claro para combinar com tema
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#B71C1C',
    fontWeight: '700',
    textAlign: 'center',
  },
});
