import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DoadoresTela({ navigation }) {
  const [nome, setNome] = useState('');
  const [emailVerificado, setEmailVerificado] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;

      if (!user) return;

      // Atualizar info do usuário autenticado
      await user.reload(); // para garantir que o status de emailVerified está atualizado
      setEmailVerificado(user.emailVerified);

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();

        if (dados.tipo !== 'doador') {
          navigation.reset({ index: 0, routes: [{ name: 'TipoUsuario' }] });
        } else {
          setNome(dados.nome || 'Doador');
        }
      } else {
        console.log('Documento do usuário não encontrado');
      }
    };

    carregarDados();
  }, []);

  const reenviarEmailVerificacao = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.sendEmailVerification();
        Alert.alert('Email enviado', 'Link de verificação reenviado para seu email.');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível reenviar o email. Tente novamente mais tarde.');
        console.log('Erro ao reenviar email de verificação:', error);
      }
    }
  };

  const navegarComVerificacao = (tela) => {
    if (!emailVerificado) {
      Alert.alert(
        'Email não verificado',
        'Você precisa verificar seu email para acessar essa funcionalidade.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reenviar link', onPress: reenviarEmailVerificacao },
        ],
      );
      return;
    }
    navigation.navigate(tela);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.boasVindas}>Olá, {nome}</Text>
      <Text style={styles.subtexto}>O que deseja fazer hoje?</Text>

      <View style={styles.grid}>
        {/* Botão 1 - Nova Doação */}
        <TouchableOpacity style={styles.box} onPress={() => navegarComVerificacao('NovaDoacao')}>
          <FontAwesome5 name="plus-circle" size={32} color="#388e3c" />
          <Text style={styles.label}>Nova Doação</Text>
        </TouchableOpacity>

        {/* Botão 2 - Minhas Doações */}
        <TouchableOpacity style={styles.box} onPress={() => navegarComVerificacao('MinhasDoacoes')}>
          <FontAwesome5 name="clipboard-list" size={32} color="#1976d2" />
          <Text style={styles.label}>Minhas Doações</Text>
        </TouchableOpacity>

        {/* Botão 3 - Perfil */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('PerfilScreen')}>
          <FontAwesome5 name="user" size={32} color="#6a1b9a" />
          <Text style={styles.label}>Perfil</Text>
        </TouchableOpacity>

        {/* Botão 4 - Impacto Ambiental */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Impacto')}>
          <FontAwesome5 name="tree" size={32} color="rgb(19, 134, 9)" />
          <Text style={styles.label}>Impacto Ambiental</Text>
        </TouchableOpacity>

        {/* Botão 5 - Notícias */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Noticias')}>
          <FontAwesome5 name="newspaper" size={32} color="#4a5568" />
          <Text style={styles.label}>Informações & Dicas</Text>
        </TouchableOpacity>

        {/* Botão 6 - joguinho */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('GameScreen')}>
          <FontAwesome5 name='gamepad' size={32} color='rgb(14, 199, 255)' />
          <Text style={styles.label}>Jogo              do Saber</Text>
        </TouchableOpacity>
      </View>
      {/* Adicione a logo centralizada abaixo dos botões */}
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 300, height: 300}}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  boasVindas: { fontSize: 24, fontWeight: 'bold', color: '#0277BD', marginTop: 20 },
  subtexto: { fontSize: 16, marginTop: 5, color: '#555', marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    position: 'relative',
  },
  label: { marginTop: 10, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
