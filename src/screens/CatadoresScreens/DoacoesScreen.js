import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs, doc, updateDoc, getDoc, doc as docFirestore, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { updateProfile } from 'firebase/auth';

const ESTADOS = [/* ... lista de estados ... */ 'Todos os estados', 'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];

export default function DoacoesScreen() {
  const [doacoes, setDoacoes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('Todos os estados');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [aceitandoIds, setAceitandoIds] = useState([]);

  useEffect(() => {
    carregarDoacoes();
  }, []);

  async function carregarDoacoes() {
    try {
      setErro(null);
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'doacoes'));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoacoes(lista);
    } catch (e) {
      setErro('Erro ao carregar doações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function aceitarDoacao(id) {
    if (aceitandoIds.includes(id)) return;

    setAceitandoIds(prev => [...prev, id]);
    try {
      const ref = doc(db, 'doacoes', id);
      const user = auth.currentUser;

      // Busca o nome do catador na coleção 'usuarios'
      const usuarioDoc = await getDoc(docFirestore(db, 'usuarios', user.uid));
      const nomeCatador = usuarioDoc.exists() ? usuarioDoc.data().nome : 'Catador';

      await updateDoc(ref, {
        aceita: true,
        aceitaPor: user.uid,
        nomeCatador: nomeCatador
      });

      setDoacoes(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, aceita: true, aceitaPor: user.uid, nomeCatador: nomeCatador }
            : d
        )
      );
      Alert.alert('Sucesso', 'Doação aceita com sucesso!');
    } catch {
      Alert.alert('Erro', 'Erro ao aceitar doação.');
    } finally {
      setAceitandoIds(prev => prev.filter(i => i !== id));
    }
  }

  function formatarTelefoneParaWhatsApp(numero) {
    let tel = numero.replace(/\D/g, '');
    return tel.startsWith('55') ? tel : '55' + tel;
  }

  function abrirWhatsApp(numero) {
    const tel = formatarTelefoneParaWhatsApp(numero);
    const url = `https://wa.me/${tel}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.')
    );
  }

  const filtradas = estadoFiltro === 'Todos os estados'
    ? doacoes
    : doacoes.filter(d => d.estado === estadoFiltro);

  // Ordene as doações por data de criação (mais recente primeiro)
  const filtradasOrdenadas = [...filtradas].sort((a, b) => {
    const dataA = a.dataCriacao?.seconds
      ? a.dataCriacao.seconds
      : (typeof a.dataCriacao === 'number' ? a.dataCriacao : 0);
    const dataB = b.dataCriacao?.seconds
      ? b.dataCriacao.seconds
      : (typeof b.dataCriacao === 'number' ? b.dataCriacao : 0);
    return dataB - dataA;
  });

  function renderDoacao({ item, index }) {
    const isAceita = item.aceita;
    const isLoading = aceitandoIds.includes(item.id);
    const podeFalarNoWhats = isAceita && item.aceitaPor === auth.currentUser?.uid;

    // Supondo que item.dataCriacao e item.dataAceite sejam timestamps do Firestore
    // Se não existirem, ajuste conforme o campo real
    const dataPostagem = item.dataCriacao
      ? new Date(item.dataCriacao.seconds ? item.dataCriacao.seconds * 1000 : item.dataCriacao).toLocaleString('pt-BR')
      : '';
    const dataAceite = item.dataAceite
      ? new Date(item.dataAceite.seconds ? item.dataAceite.seconds * 1000 : item.dataAceite).toLocaleString('pt-BR')
      : '';

    return (
      <Animatable.View animation="fadeInUp" delay={index * 80} style={[styles.card, isAceita && styles.cardAceita]}>
        <View style={styles.header}>
          <Icon name="recycle" size={26} color="rgb(25, 168, 11)" />
          <Text style={styles.tipo}> Material à doação: <Text style={{ color: 'rgb(25, 168, 11)' }}>{item.tipoLixo}</Text> </Text>
        </View>

        {/* Datas em letras miúdas */}
        <View style={{ marginBottom: 4 }}>
          {dataPostagem ? (
            <Text style={styles.dataPequena}>Postada em: {dataPostagem}</Text>
          ) : null}
          {isAceita && dataAceite ? (
            <Text style={styles.dataPequena}>Aceita em: {dataAceite}</Text>
          ) : null}
        </View>

        {item.aceita && item.nomeCatador && (
          <Text style={styles.catadorNome}>
            <Text style={{ fontWeight: 'bold', color: 'rgb(41, 36, 12)' }}>{item.nomeCatador}<Text>Já aceitou</Text></Text>
          </Text>
        )}

        <InfoRow icon="map-marker" text={item.estado} />
        <InfoRow icon="home" text={item.endereco} color="rgb(97, 97, 97)" />
        <InfoRow icon="phone" text={item.telefone} />
        {/* Proteção extra para mapas */}
        {item.localizacao &&
          Number.isFinite(item.localizacao.latitude) &&
          Number.isFinite(item.localizacao.longitude) &&
          !isNaN(item.localizacao.latitude) &&
          !isNaN(item.localizacao.longitude) && (
            <MapView
              style={styles.map}
              provider="google"
              initialRegion={{
                latitude: item.localizacao.latitude,
                longitude: item.localizacao.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={item.localizacao} />
            </MapView>
        )}

        {!!item.telefone && (
          <TouchableOpacity
            style={[styles.btnWhats, !podeFalarNoWhats && { opacity: 0.5 }]}
            onPress={() => podeFalarNoWhats && abrirWhatsApp(item.telefone)}
            disabled={!podeFalarNoWhats}
          >
            <Icon name="whatsapp" size={22} color="#fff" />
            <Text style={styles.btnTxt}>
              {podeFalarNoWhats ? 'Conversar no WhatsApp' : 'Disponível ao Aceitar'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.btnAceitar,
            isAceita && styles.btnAceitoEscuro,
            isAceita && { opacity: 0.7 }
          ]}
          onPress={() => aceitarDoacao(item.id)}
          disabled={isAceita || isLoading}
        >
          <Icon
            name={isAceita ? 'check-circle' : 'check-circle-outline'}
            size={20}
            color="#fff"
          />
          <Text style={styles.btnTxt}>
            {isAceita ? 'Esta Doação já foi  Aceita ' : isLoading ? 'Aguardando...' : 'Clique para Aceitar a Doação'}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.title}>Filtrar por estado:</Animatable.Text>

      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={estadoFiltro}
          onValueChange={setEstadoFiltro}
          style={styles.picker}
          dropdownIconColor="#5d4037"
        >
          {ESTADOS.map(estado => <Picker.Item key={estado} label={estado} value={estado} />)}
        </Picker>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#5d4037" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : erro ? (
        <View style={styles.erro}>
          <Icon name="alert-circle" size={32} color="#d32f2f" />
          <Text style={styles.erroTxt}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={filtradasOrdenadas}
          keyExtractor={item => item.id}
          renderItem={renderDoacao}
          contentContainerStyle={{ paddingBottom: 60 }}
          onRefresh={carregarDoacoes}
          refreshing={refreshing}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma doação encontrada.</Text>}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Recicla ArcoVerde ♻️</Text>
      </View>
    </View>
  );
}

function InfoRow({ icon, text }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
      <Icon name={icon} size={18} color="#795548" />
      <Text style={{ marginLeft: 6, fontSize: 15, color: '#5d4037' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefbe9',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 10,
  },
  pickerWrap: {
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: '#6d4c41',
  },
  card: {
    backgroundColor: '#fffaf0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardAceita: {
    backgroundColor: '#c8e6c9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipo: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#4e342e',
  },
  map: {
    width: '100%',
    height: 150,
    marginTop: 12,
    borderRadius: 10,
    
  },
  btnWhats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(12, 243, 20, 0.98)',
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAceitar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 148, 40, 0.85)',
    borderRadius: 8,
    marginTop: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAceito: {
    backgroundColor: '#4caf50',
  },
  btnAceitoEscuro: {
    backgroundColor: '#263238', // cinza escuro
  },
  btnTxt: {
    color: 'rgb(255, 255, 255)',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6d4c41',
  },
  erro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  erroTxt: {
    marginTop: 10,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#8d6e63',
    textAlign: 'center',
    marginTop: 30,
  },
  footer: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6d4c41',
    fontWeight: '600',
  },
  catadorNome: {
    color: '#6d4c41',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 4,
  },
  dataPequena: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 1,
    marginLeft: 2,
  },
});
