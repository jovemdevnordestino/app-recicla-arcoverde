import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { db, auth } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Altere esta linha
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const estadosBR = [
  'Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Distrito Federal','Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul','Minas Gerais','Pará','Paraíba',
  'Paraná','Pernambuco','Piauí','Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul','Rondônia','Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins'
];

const NovaDoacao = () => {
  const [tipoLixo, setTipoLixo] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [telefone, setTelefone] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [region, setRegion] = useState(null);
  const [carregandoLocal, setCarregandoLocal] = useState(true);

  const navigation = useNavigation();
  const tipos = ['Papel', 'Plástico', 'Metal', 'Vidro'];
  const horario = 'Combine com o catador pelo whatsapp';

  // Busca cidade e estado a partir das coordenadas
  const pegarCidade = async (coords) => {
    try {
      const endereco = await Location.reverseGeocodeAsync(coords);
      if (endereco && endereco.length > 0) {
        const local = endereco[0];
        const cidadeObtida =
          local.city || local.town || local.village || local.subregion || local.region || '';
        const estadoObtido = local.region || '';
        setCidade(cidadeObtida);
        setEstado(estadoObtido);
      } else {
        setCidade('');
        setEstado('');
      }
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      setCidade('');
      setEstado('');
    }
  };

  // Ao abrir a tela, tenta pegar a localização atual
  useEffect(() => {
    (async () => {
      setCarregandoLocal(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Ative a localização para usar o mapa.');
        setCarregandoLocal(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocalizacao(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        await pegarCidade(coords);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter a localização inicial.');
      } finally {
        setCarregandoLocal(false);
      }
    })();
  }, []);

  // Botão para usar localização atual
  const usarLocalizacaoAtual = async () => {
    setCarregandoLocal(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocalizacao(coords);
      setRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      await pegarCidade(coords);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    } finally {
      setCarregandoLocal(false);
    }
  };

  // Ao clicar no mapa, marca o local e busca cidade/estado
  const marcarLocalNoMapa = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocalizacao({ latitude, longitude });
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    pegarCidade({ latitude, longitude });
  };

  const formatarTelefone = (texto) => {
    const cleaned = texto.replace(/\D/g, '');
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleTelefoneChange = (text) => {
    const formatado = formatarTelefone(text);
    setTelefone(formatado);
  };

  const enviarDoacao = async () => {
    if (
      !tipoLixo ||
      !cidade ||
      !estado ||
      !bairro ||
      !rua ||
      !numero ||
      !telefone ||
      !localizacao
    ) {
      Alert.alert('Erro', 'Preencha todos os campos e marque uma localização no mapa!');
      return;
    }

    const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}`;
    const user = auth.currentUser;

    try {
      await addDoc(collection(db, 'doacoes'), {
        tipoLixo,
        endereco: enderecoCompleto,
        telefone,
        horario,
        localizacao,
        cidade,
        estado,
        // Cria o campo dataCriacao automaticamente com o timestamp do servidor
        dataCriacao: serverTimestamp(),
        doadorId: user ? user.uid : null
      });
      Alert.alert('Sucesso', 'Doação registrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao registrar doação:', error);
      Alert.alert('Erro', 'Não foi possível registrar a doação.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Selecione o tipo de Material Recicável:</Text>
        {tipos.map((tipo) => (
          <TouchableOpacity
            key={tipo}
            onPress={() => setTipoLixo(tipo)}
            style={[styles.botaoTipo, tipoLixo === tipo && styles.botaoTipoSelecionado]}
          >
            <Text style={tipoLixo === tipo ? styles.textoTipoSelecionado : styles.textoTipo}>{tipo}</Text>
          </TouchableOpacity>
        ))}

        <Text style={{ marginTop: 15, fontWeight: '600' }}>Cidade:</Text>
        <TextInput
          value={cidade}
          editable={false}
          style={[styles.input, { backgroundColor: '#e0e0e0' }]}
          placeholder="Cidade"
          placeholderTextColor="#8aa"
        />

        <Text style={{ fontWeight: '600' }}>Estado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={estado}
            onValueChange={(itemValue) => setEstado(itemValue)}
            mode="dropdown"
            style={styles.picker}
            dropdownIconColor="#0d47a1"
          >
            <Picker.Item label="Selecione o estado" value="" />
            {estadosBR.map((uf) => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>
        </View>
        {estado ? (
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4, marginBottom: 8 }}>
            Estado selecionado: {estado}
          </Text>
        ) : null}

        <Text style={{ fontWeight: '600' }}>Bairro:</Text>
        <TextInput
          value={bairro}
          onChangeText={setBairro}
          style={styles.input}
          placeholder="Digite o bairro"
          placeholderTextColor="#8aa"
        />

        <Text style={{ fontWeight: '600' }}>Rua:</Text>
        <TextInput
          value={rua}
          onChangeText={setRua}
          style={styles.input}
          placeholder="Digite a rua"
          placeholderTextColor="#8aa"
        />

        <Text style={{ fontWeight: '600' }}>Número:</Text>
        <TextInput
          value={numero}
          onChangeText={setNumero}
          style={styles.input}
          placeholder="Número da casa"
          placeholderTextColor="#8aa"
          keyboardType="numeric"
        />

        <Text style={{ fontWeight: '600' }}>Horário de disponibilidade:</Text>
        <Text style={[styles.input, { backgroundColor: '#e0e0e0', color: '#333' }]}>{horario}</Text>

        <Text style={{ fontWeight: '600' }}>Telefone:</Text>
        <TextInput
          value={telefone}
          onChangeText={handleTelefoneChange}
          keyboardType="phone-pad"
          style={styles.input}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#8aa"
          maxLength={15}
        />

        <Text style={styles.textoSecao}>Marque a localização do ponto de coleta (Toque para definir o ponto):</Text>
        <View style={styles.mapaContainer}>
          {carregandoLocal ? (
            <View style={styles.loadingMapa}>
              <ActivityIndicator size="large" color="#1976D2" />
              <Text style={{ color: '#1976D2', marginTop: 8 }}>Carregando mapa...</Text>
            </View>
          ) : (
            <MapView
              style={styles.mapa}
              provider={PROVIDER_GOOGLE}
              region={region}
              onPress={marcarLocalNoMapa}
              showsUserLocation
              loadingEnabled
            >
              {localizacao && <Marker coordinate={localizacao} pinColor="#1976D2" />}
            </MapView>
          )}
        </View>

        <TouchableOpacity onPress={usarLocalizacaoAtual} style={styles.botaoLocalAtual} disabled={carregandoLocal}>
          {carregandoLocal ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.textoBotaoLocal}>Usar minha Localização Atual</Text>
          )}

        </TouchableOpacity>

        
        <TextInput
          multiline
          numberOfLines={4}
          
        />

      </ScrollView>

      <TouchableOpacity onPress={enviarDoacao} style={styles.botaoEnviar}>
        <Text style={styles.textoEnviar}>Enviar Doação</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NovaDoacao;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f9ff',
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0d47a1',
    marginBottom: 8,
    marginTop: 10,
  },
  botaoTipo: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#bbdefb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#90caf9',
  
  },
  botaoTipoSelecionado: {
    backgroundColor: '#1976d2',
    borderColor: '#0d47a1',
  },
  textoTipo: {
    color: '#0d47a1',
    fontWeight: '600',
    textAlign: 'center',
  },
  textoTipoSelecionado: {
    color: '#e3f2fd',
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgb(255, 255, 255)',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    textAlignVertical: 'center',
    paddingHorizontal: 10,
  },
  textoSecao: {
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  mapaContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e3f2fd',
    marginBottom: 10,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapa: {
    width: '100%',
    height: '100%',
  },
  loadingMapa: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
  botaoLocalAtual: {
    marginTop: 5, // Reduzindo a margem superior
    padding: 20, // Reduzindo o espaço interno
    backgroundColor: '#4caf50',
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoLocal: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    textDecorationLine: 'underline',
    paddingTop: 5, // Adicionando espaço extra no topo
  },
  botaoEnviar: {
    backgroundColor: '#0d47a1',
    padding: 18,
    borderRadius: 14,
    margin: 20,
  },
  textoEnviar: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginTop: 2,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#0d47a1',
    fontSize: 16,
  },
});
