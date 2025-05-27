import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, TouchableWithoutFeedback,
  Keyboard, Image, ImageBackground, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoadingRegister(false);
    }, [])
  );

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Por favor', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), senha);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.tipo === 'catador') {
          navigation.reset({ index: 0, routes: [{ name: 'CatadoresTela' }] });
        } else if (userData.tipo === 'doador') {
          navigation.reset({ index: 0, routes: [{ name: 'DoadoresTela' }] });
        } else {
          Alert.alert('Por favor', 'Refaça o cadastro e escolha se é catador ou doador.');
        }
      } else {
        Alert.alert('Erro', 'Usuário não encontrado no banco de dados.');
      }
    } catch (error) {
      Alert.alert('Poxa', 'Verifique seu Email e Senha, algum está incorreto.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    setLoadingRegister(true);
    navigation.navigate('Register');
  };

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={25} color="#4B5563" style={styles.icon} />
                <TextInput
                  placeholder="Digite seu Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={25} color="#4B5563" style={styles.icon} />
                <TextInput
                  placeholder="Digite sua Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { fontWeight: 'bold', fontSize: 16 }]}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={30}
                    color="#4B5563"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>🌱 Entrar</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.registerContainer}>
                <TouchableOpacity onPress={handleNavigateToRegister} disabled={loadingRegister}>
                  {loadingRegister ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.registerLink}>
                      É novo por aqui? <Text style={{ fontWeight: 'bold' }}>Cadastre-se</Text>
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.bottomImage}
                  resizeMode="contain"
                />
              </View>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const shadowStyle = {
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  inputContainer: {
    ...shadowStyle,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 12,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
  },
  buttonContainer: {
    ...shadowStyle,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2E7D32',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  registerContainer: {
    ...shadowStyle,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgb(19, 112, 11)',
  },
  registerLink: {
    color: 'rgb(252, 251, 247)',
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomImage: {
    width: 150,
    height: 150,
    marginTop: 2,
  },
});

export default LoginScreen;
