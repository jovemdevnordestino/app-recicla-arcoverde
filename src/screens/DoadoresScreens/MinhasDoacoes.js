import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';

const ESTADOS = [
  'Todos os estados', 'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais',
  'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte',
  'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

export default function MinhasDoacoesScreen() {
  const [doacoes, setDoacoes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('Todos os estados');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarDoacoes();
  }, []);

  async function carregarDoacoes() {
    try {
      setErro(null);
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setErro('Usuário não autenticado.');
        console.error('Usuário não autenticado.');
        setDoacoes([]);
        setLoading(false);
        return;
      }

      console.log('Buscando doações para doadorId:', user.uid);

      const doacoesRef = collection(db, 'doacoes');
      const q = query(doacoesRef, where('doadorId', '==', user.uid));
      const snapshot = await getDocs(q);

      let lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Doações encontradas:', lista.length);

      // Busca dados do catador para cada doação aceita
      lista = await Promise.all(
        lista.map(async (doacao) => {
          if (doacao.aceita && doacao.aceitaPor) {
            try {
              const catadorDoc = await getDoc(doc(db, 'usuarios', doacao.aceitaPor));
              if (catadorDoc.exists()) {
                return { ...doacao, catador: catadorDoc.data() };
              }
            } catch (e) {
              console.error('Erro ao buscar dados do catador:', e);
              return doacao;
            }
          }
          return doacao;
        })
      );

      setDoacoes(lista);
    } catch (e) {
      setErro('Erro ao carregar suas doações. Tente novamente.');
      console.error('Erro ao carregar doações:', e);
    } finally {
      setLoading(false);
    }
  }

  // Filtro de estado
  const filtradas = estadoFiltro === 'Todos os estados'
    ? doacoes
    : doacoes.filter(d => (d.estado || '').toLowerCase() === estadoFiltro.toLowerCase());

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

  function abrirWhatsApp(numero) {
    const tel = numero.replace(/\D/g, '');
    const url = `https://wa.me/55${tel}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.')
    );
  }

  function renderDoacao({ item, index }) {
    // Datas de criação e aceite
    const dataPostagem = item.dataCriacao
      ? new Date(item.dataCriacao.seconds ? item.dataCriacao.seconds * 1000 : item.dataCriacao).toLocaleString('pt-BR')
      : '';
    const dataAceite = item.dataAceite
      ? new Date(item.dataAceite.seconds ? item.dataAceite.seconds * 1000 : item.dataAceite).toLocaleString('pt-BR')
      : '';

    return (
      <Animatable.View animation="fadeInUp" delay={index * 80} style={[styles.card, item.aceita && styles.cardAceita]}>
        <View style={styles.header}>
          <Icon name="trash-can-outline" size={26} color="#6d4c41" />
          <Text style={styles.tipo}>{item.tipoLixo || item.tipo}</Text>
        </View>

        {/* Datas em letras miúdas */}
        <View style={{ marginBottom: 4 }}>
          {dataPostagem ? (
            <Text style={styles.dataPequena}>Postada em: {dataPostagem}</Text>
          ) : null}
          {item.aceita && dataAceite ? (
            <Text style={styles.dataPequena}>Aceita em: {dataAceite}</Text>
          ) : null}
        </View>

        {item.aceita && item.catador && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.catadorNome}>
              Aceita por: <Text style={{ fontWeight: 'bold' }}>{item.catador.nome}</Text>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.catadorNome}>Telefone: {item.catador.telefone}</Text>
              {item.catador.telefone && (
                <TouchableOpacity
                  style={{
                    marginLeft: 8,
                    backgroundColor: '#25D366',
                    borderRadius: 16,
                    padding: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => abrirWhatsApp(item.catador.telefone)}
                >
                  <Icon name="whatsapp" size={18} color="#fff" />
                  <Text style={{ color: '#fff', flex: 1, marginLeft: 1, fontSize: 13, height: 20 }}>Abrir WhatsApp</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.catadorNome}>Email: {item.catador.email}</Text>
            <Text style={styles.catadorNome}>Cidade: {item.catador.cidade}</Text>
            <Text style={styles.catadorNome}>Bairro: {item.catador.bairro}</Text>
            <Text style={styles.catadorNome}>Rua: {item.catador.rua}</Text>
            <Text style={styles.catadorNome}>Estado: {item.catador.estado}</Text>
            <Text style={styles.catadorNome}>Tipo: {item.catador.tipo}</Text>
          </View>
        )}

        <InfoRow icon="map-marker" text={item.estado} />
        <InfoRow icon="home" text={item.endereco} />
        <InfoRow icon="phone" text={item.telefone} />

        {item.localizacao &&
          Number.isFinite(item.localizacao.latitude) &&
          Number.isFinite(item.localizacao.longitude) && (
            <MapView
              provider="google"
              style={styles.map}
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
      </Animatable.View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título principal da tela */}
      <Text style={styles.tituloPrincipal}>Minhas Doações</Text>

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
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nenhuma doação encontrada.
              {'\n'}Verifique se você está logado e se já realizou alguma doação.
            </Text>
          }
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
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 10,
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
    color: '#263238',
    fontSize: 15,
    marginBottom: 2,
    marginTop: 2,
  },
  dataPequena: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 1,
    marginLeft: 2,
  },
});
