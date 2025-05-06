import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../services/firebase'; // Certifique-se de que o caminho está correto
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importando método de login do Firebase

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isCatador, setIsCatador] = useState(null); // Armazenar o tipo de usuário

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, insira um e-mail e senha.");
      return;
    }

    try {
      // Lógica de autenticação do Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert("Sucesso", "Login realizado com sucesso!");

      // Redirecionar dependendo do tipo de usuário
      if (isCatador === true) {
        navigation.navigate('CatadoresTela'); // Navegar para a tela do catador
      } else if (isCatador === false) {
        navigation.navigate('DoadoresTela'); // Navegar para a tela do doador
      } else {
        Alert.alert("Erro", "Por favor, selecione se você é catador ou doador.");
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert("Erro", "Usuário não encontrado.");
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert("Erro", "Senha incorreta.");
      } else {
        Alert.alert("Erro", "Erro ao realizar login.");
      }
    }
  };

  const handleSelectUserType = (type) => {
    setIsCatador(type === 'catador');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        onChangeText={setSenha}
        value={senha}
        secureTextEntry
      />

      <View style={styles.userTypeContainer}>
        <Text style={styles.subtitle}>Você é:</Text>
        <View style={styles.userTypeButtons}>
          <Button 
            title="Catador" 
            onPress={() => handleSelectUserType('catador')} 
            color={isCatador ? '#2E7D32' : '#7f8c8d'}
          />
          <Button 
            title="Doador" 
            onPress={() => handleSelectUserType('doador')} 
            color={!isCatador ? '#2E7D32' : '#7f8c8d'}
          />
        </View>
      </View>

      <Button title="Entrar" onPress={handleLogin} color="#2E7D32" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  userTypeContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#34495e',
  },
});
