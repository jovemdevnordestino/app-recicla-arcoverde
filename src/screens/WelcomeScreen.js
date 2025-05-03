import React from 'react';
import { View, Text, Button, StyleSheet, Image, ImageBackground } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/fundo.png')} // sua imagem de fundo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../../assets/LOGO.PNG.png')} // sua logo central
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bem-vindo ao Recicla Arcoverde!</Text>
        <Button
          title="Ir para Login"
          onPress={() => navigation.navigate('Login')}
          color="#2E7D32"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)', // leve camada branca transparente
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
