import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Ionicons name="leaf-outline" size={64} color="#2ecc71" />
      <Text style={styles.title}>Bem-vindo ao Recicla Arcoverde!</Text>
      <Text style={styles.subtitle}>Conectando você à reciclagem inteligente 🌱</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Map')} // Navegação para a tela Map
      >
        <Text style={styles.buttonText}>olá Erika!!!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f39c12' }]}
        onPress={() => navigation.navigate('Profile')} // Navegação para a tela de perfil (criar a tela de perfil se necessário)
      >
        <Text style={styles.buttonText}>Meu Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    color: '#34495e',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

