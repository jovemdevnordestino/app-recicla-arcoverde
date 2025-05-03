import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../services/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    registerUser(email, password)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff'
  },
  title: {
    fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center'
  },
  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
    marginBottom: 15, paddingLeft: 10
  },
  button: {
    backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 8, marginBottom: 15
  },
  buttonText: {
    color: '#fff', textAlign: 'center', fontSize: 18
  },
});
