import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';

export default function CatadoresTela({ navigation }) {
  const [nome, setNome] = useState('Catador');
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;

      if (!user) return;

      setEmailVerificado(user.emailVerified);

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();

        if (dados.tipo !== 'catador') {
          navigation.reset({ index: 0, routes: [{ name: 'TipoUsuarioScreen' }] });
        } else {
          setNome(dados.nome || 'Catador');
        }
      } else {
        console.log('Documento do usuário não encontrado');
      }
    };

    carregarDados();
  }, []);

  const reenviarEmailVerificacao = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setEnviandoEmail(true);
      await sendEmailVerification(user);
      Alert.alert('Sucesso', 'Email de verificação reenviado! Verifique sua caixa de entrada.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reenviar o email de verificação.');
      console.error(error);
    } finally {
      setEnviandoEmail(false);
    }
  };

  return (
    <View style={styles.container}>
      {!emailVerificado && (
        <View style={styles.avisoContainer}>
          <Text style={styles.avisoTexto}>
            Seu e-mail não está verificado.{' '}
            <Text style={styles.link} onPress={reenviarEmailVerificacao} disabled={enviandoEmail}>
              Reenviar link de verificação
            </Text>
          </Text>
        </View>
      )}

      <Text style={styles.boasVindas}>Olá, {nome}</Text>
      <Text style={styles.subtexto}>O que você deseja fazer hoje?</Text>

      <View style={styles.grid}>
        {/* Botão Doações - bloqueado se email não verificado */}
        <TouchableOpacity
          style={[styles.box, !emailVerificado && styles.boxDisabled]}
          onPress={() => emailVerificado && navigation.navigate('DoacoesDisponiveis')}
          activeOpacity={emailVerificado ? 0.7 : 1}
        >
          <FontAwesome5 name="box" size={32} color={emailVerificado ? '#38a169' : '#aaa'} />
          <Text style={[styles.label, !emailVerificado && styles.labelDisabled]}>Doações</Text>
        </TouchableOpacity>

        {/* Botão Perfil - sempre ativo */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('PerfilScreen')}
        >
          <FontAwesome5 name="user" size={32} color="#3182ce" />
          <Text style={styles.label}>Perfil</Text>
        </TouchableOpacity>

        {/* Botão Mapa - bloqueado se email não verificado */}
        <TouchableOpacity
          style={[styles.box, !emailVerificado && styles.boxDisabled]}
          onPress={() => emailVerificado && navigation.navigate('Impacto')}
          activeOpacity={emailVerificado ? 0.7 : 1}
        >
          <FontAwesome5 name="tree" size={32} color={emailVerificado ? 'rgb(10, 88, 39)' : '#aaa'} />
          <Text style={[styles.label, !emailVerificado && styles.labelDisabled]}>Impacto Ambiental</Text>
        </TouchableOpacity>

        {/* Botão Avisos - sempre ativo */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('sobre')}>
          <FontAwesome5 name="bell" size={32} color="#d53f8c" />
          <Text style={styles.label}>Sobre</Text>
        </TouchableOpacity>

        {/* Botão informacoes e noticias  - sempre ativo */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Noticias')}>
          <FontAwesome5 alignItems='center' name="newspaper" size={32} color="#4a5568" />
          <Text style={styles.label}>Informações & Dicas</Text>
        </TouchableOpacity>

        {/* Botão 6 - joguinho */}
                <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('GameScreen')}>
                  <FontAwesome5 name='gamepad' size={32} color='rgb(14, 199, 255)' />
                  <Text style={styles.label}>Jogo                       do Saber</Text>
                </TouchableOpacity>
      </View>

      {/* Remova o ScrollView e o fundo cinza */}
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  avisoContainer: {
    backgroundColor: '#ffe4e1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    
  },
  avisoTexto: {
    color: '#b00020',
    fontSize: 14,
  },
  link: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
  boasVindas: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginTop: 20 },
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
  },
  boxDisabled: {
    backgroundColor: '#e0e0e0',
  },
  label: { marginTop: 10, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  labelDisabled: {
    color: '#aaa',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    width: 300,
    height: 300,
  },
});
