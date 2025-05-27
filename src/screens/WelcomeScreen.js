import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  function handlePress() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login'); // Navega após o loading
    }, 300);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.99)" />
      <SafeAreaView style={styles.safeArea}>
        {/* Loader enquanto imagens carregam */}
        {!(bgLoaded && logoLoaded) && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        )}
        <ImageBackground
          source={require('../../assets/fundo.jpg')}
          style={styles.background}
          resizeMode="cover"
          onLoadEnd={() => setBgLoaded(true)}
        >
          <View style={styles.overlay}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              onLoadEnd={() => setLogoLoaded(true)}
            />
            <View>
              <Text style={styles.title}>
                CONTRIBUINDO PARA UM PLANETA SUSTENTÁVEL
              </Text>
            </View>
          </View>

          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handlePress}
            >
              {/*desabilita enquanto carrega*/}
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Clique aqui para entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomButtonContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});
