import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

const backgroundImage = require('../../assets/login.jpg');

const RegisterScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();
    const trimmedConfirmarSenha = confirmarSenha.trim();

    if (!nome || !trimmedEmail || !trimmedSenha || !trimmedConfirmarSenha) {
      Alert.alert('Atenção novo(a) membro(a):', 'Preencha todos os campos.');
      return;
    }

    if (trimmedSenha !== trimmedConfirmarSenha) {
      Alert.alert('Atenção novo(a) membro(a):', 'As senhas precisam ser iguais.');
      return;
    }

    if (trimmedSenha.length < 6) {
      Alert.alert('Atenção novo(a) membro(a):', 'A senha deve ter pelo menos 6 dígitos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedSenha);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nome,
        email: trimmedEmail,
      });

      Alert.alert('Sucesso', 'Cadastro realizado! Verifique seu e-mail antes de continuar.');

      navigation.reset({
        index: 0,
        routes: [{ name: 'TipoUsuario' }],
      });
    } catch (error) {
      console.log('Erro ao cadastrar:', error);
      Alert.alert('Atenção novo(a) membro(a):', 'Esse Email já está em uso');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.overlay}>
              <Text style={styles.title}>Criar Conta</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#4B5563" style={styles.icon} />
                <TextInput
                  placeholder="Digite seu nome completo*"
                  value={nome}
                  onChangeText={setNome}
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize='words'
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#4B5563" style={styles.icon} />
                <TextInput
                  placeholder="Digite seu Email*"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#4B5563" style={styles.icon} />
                <TextInput
                  placeholder="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize='none'
                  fontWeight='bold'
                  fontSize={16}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={30}
                    color="#4B5563"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#4B5563" style={styles.icon} />
                <TextInput
                  placeholder="Confirmar Senha"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize='none'
                   fontWeight='bold'
                  fontSize={16}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }
              >
                <Text style={styles.registerLink}>
                  Já tem conta? <Text style={{ fontWeight: 'bold' }}>Entrar</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 120,
    alignContent: 'center',
  },
  overlay: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 150,
     flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#065f46',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#10b981',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    color: '#065f46',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RegisterScreen;
