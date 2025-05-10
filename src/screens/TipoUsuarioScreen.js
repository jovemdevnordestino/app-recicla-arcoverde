// screens/TipoUsuarioScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function TipoUsuarioScreen({ navigation }) {
  const user = auth.currentUser;

  const selecionarTipo = async (tipo) => {
    try {
      await setDoc(doc(db, 'usuarios', user.uid), { tipo }, { merge: true });

      if (tipo === 'catador') {
        navigation.reset({ index: 0, routes: [{ name: 'CatadoresTela' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'DoadoresTela' }] });
      }
    } catch (error) {
      console.error('Erro ao salvar tipo de usuário:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Você é:</Text>
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#2E7D32' }]}
        onPress={() => selecionarTipo('catador')}
      >
        <Text style={styles.textoBotao}>Catador</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#388E3C' }]}
        onPress={() => selecionarTipo('doador')}
      >
        <Text style={styles.textoBotao}>Coletor (Doador)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 22, marginBottom: 30 },
  botao: { padding: 15, marginVertical: 10, borderRadius: 10, width: '100%', alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 18 },
});
