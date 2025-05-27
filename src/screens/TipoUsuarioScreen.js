import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TipoUsuarioScreen({ navigation }) {
  const user = auth.currentUser;
  const [telefone, setTelefone] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarLocalizacao();
  }, []);

  const buscarLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa habilitar a localização para continuar.');
        setCarregando(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (geo.length > 0) {
        const data = geo[0];

        // Tentativa robusta para cidade e bairro:
        const city = data.city || data.subregion || data.region || '';
        const bairro = data.subLocality || data.district || data.name || '';
        const street = data.street || '';

        setLocalizacao({ city, bairro, street, region: data.region || '' });
      } else {
        Alert.alert('Erro', 'Não foi possível identificar sua localização.');
      }
    } catch (err) {
      console.error('Erro ao obter localização:', err);
      Alert.alert('Erro', 'Falha ao tentar obter a localização.');
    } finally {
      setCarregando(false);
    }
  };

  const formatarTelefone = (texto) => {
    const numeros = texto.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  };

  const handleTelefoneChange = (texto) => {
    setTelefone(formatarTelefone(texto));
  };

  const validarTelefone = () => /^(\(\d{2}\)) \d{5}-\d{4}$/.test(telefone);

  const salvarTipoUsuario = async (tipo) => {
    if (!telefone || !validarTelefone()) {
      return Alert.alert('Erro', 'Telefone inválido. Use o formato: (00) 00000-0000');
    }

    try {
      setCarregando(true);
      await setDoc(
        doc(db, 'usuarios', user.uid),
        {
          tipo,
          telefone,
          cidade: localizacao?.city || '',
          bairro: localizacao?.bairro || '',
          estado: localizacao?.region || '',
          rua: localizacao?.street || '',
        },
        { merge: true }
      );

      navigation.reset({
        index: 0,
        routes: [{ name: tipo === 'catador' ? 'CatadoresTela' : 'DoadoresTela' }],
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Falha ao salvar as informações do usuário.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.overlay}>
            <Icon name="person-circle-outline" size={80} color="#fff" style={styles.icon} />

            <Text style={styles.title}>
              <Text style={styles.titleBold}>Complete seu perfil{'\n'}</Text>
              <Text style={styles.titleSub}>Informe seu telefone e permita a localização:</Text>
            </Text>

            {carregando ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : localizacao ? (
              <View style={styles.locationBox}>
                <Text style={styles.location}>📍 Cidade: {localizacao.city || 'Não encontrada'}</Text>
                <Text style={styles.location}>📍 Bairro: {localizacao.bairro || 'Não encontrado'}</Text>
                <Text style={styles.location}>📍 Rua: {localizacao.street || 'Não encontrada'}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={buscarLocalizacao}>
                <Text style={styles.refreshLocation}>🔁 Tentar obter localização novamente</Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              value={telefone}
              onChangeText={handleTelefoneChange}
              keyboardType="phone-pad"
              maxLength={15}
            />

            <TouchableOpacity
              style={[styles.button, styles.catador]}
              onPress={() => salvarTipoUsuario('catador')}
            >
              <Text style={styles.buttonText}>Sou Catador</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.doador]}
              onPress={() => salvarTipoUsuario('doador')}
            >
              <Text style={styles.buttonText}>Sou Doador</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    justifyContent: 'center',
  },
  icon: { alignSelf: 'center', marginBottom: 16 },
  title: { textAlign: 'center', marginBottom: 16 },
  titleBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 24,
  },
  titleSub: {
    color: '#eee',
    fontSize: 16,
  },
  locationBox: {
    marginBottom: 16,
  },
  location: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshLocation: {
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  catador: {
    backgroundColor: '#2A922F',
  },
  doador: {
    backgroundColor: '#1295D1',
  },
});
