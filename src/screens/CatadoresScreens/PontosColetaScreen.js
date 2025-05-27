import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import MapView, { Marker } from 'react-native-maps';

const PontosColetaScreen = () => {
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDoacoes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'doacoes'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoacoes(lista);
      } catch (error) {
        console.error('Erro ao buscar doações:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDoacoes();
  }, []);

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#0d47a1" />
        <Text>Carregando pontos de coleta...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.titulo}>Pontos de Coleta</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <Text style={styles.tipo}>{item.tipoLixo}</Text>
            <Text style={styles.info}>{item.endereco}</Text>
            <Text style={styles.info}>📞 {item.telefone}</Text>
            <Text style={styles.info}>🕒 {item.horario}</Text>
            {item.localizacao && (
              <MapView
                style={styles.mapa}
                initialRegion={{
                  ...item.localizacao,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={item.localizacao} pinColor="#388e3c" />
              </MapView>
            )}
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    margin: 20,
    color: '#0d47a1',
  },
  card: {
    backgroundColor: '#e3f2fd',
    margin: 15,
    borderRadius: 16,
    padding: 15,
    elevation: 4,
  },
  imagem: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  tipo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976d2',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  mapa: {
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PontosColetaScreen;