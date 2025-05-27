import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function PerfilScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNome(data.nome || '');
          setEmail(data.email || user.email || '');
          setTipo(data.tipo || '');
          setTelefone(data.telefone || '');
          setCidade(data.cidade || '');
          setEstado(data.estado || '');
          setBairro(data.bairro || '');
          setRua(data.rua || '');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatarTelefone = (texto) => {
    const numeros = texto.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  };

  const handleTelefoneChange = (texto) => {
    setTelefone(formatarTelefone(texto));
  };

  const validarTelefone = () => /^(\(\d{2}\)) \d{4,5}-\d{4}$/.test(telefone);

  const handleSalvar = async () => {
    if (!nome || !tipo || !telefone) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (!validarTelefone()) {
      Alert.alert('Erro', 'Telefone inválido. Use o formato: (00) 00000-0000');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, {
        nome,
        tipo,
        telefone,
        cidade,
        estado,
        bairro,
        rua,
      });
      Alert.alert('Sucesso', 'Dados atualizados!');
      // Redirecionar para a tela de acordo com o tipo
      if (tipo === 'doador') {
        navigation.navigate('DoadoresTela');
      } else if (tipo === 'catador') {
        navigation.navigate('CatadoresTela');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar dados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e8b57" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fafafa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil do Usuário</Text>

        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Telefone *</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={handleTelefoneChange}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Text style={styles.label}>Tipo *</Text>
        <View style={styles.tipoContainer}>
          <TouchableOpacity
            style={[styles.tipoButton, tipo === 'catador' && styles.selectedButton]}
            onPress={() => setTipo('catador')}
          >
            <Text style={[styles.tipoText, tipo === 'catador' && { color: '#fff' }]}>Catador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tipoButton, tipo === 'doador' && styles.selectedButton]}
            onPress={() => setTipo('doador')}
          >
            <Text style={[styles.tipoText, tipo === 'doador' && { color: '#fff' }]}>Doador</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={cidade}
          editable={false}
        />

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={estado}
          editable={false}
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={bairro}
          editable={false}
        />

        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={rua}
          editable={false}
        />

        <View style={styles.buttonContainer}>
          <Button title="Salvar alterações" onPress={handleSalvar} color="#2e8b57" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2e8b57',
    textAlign: 'center',
    marginTop: 20,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  tipoButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#2e8b57',
  },
  tipoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
});
