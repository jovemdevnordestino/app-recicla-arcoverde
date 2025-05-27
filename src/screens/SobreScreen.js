import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const autoresIniciais = [
  {
    id: '1',
    nome: 'História ',
    descricao: '  O professor Jean Miranda, da Escola de Referência em Ensino Médio de Arcoverde (EREMA), foi quem sugeriu a ideia em uma de suas aulas da Matéria Eletiva para os alunos presentes, Então, Jeferson de Souza Nogueira, aluno, decidiu tentar. No começo, Jeferson achou que aquilo seria impossível, pois o máximo que ele tinha feito na vida era um site simples. Foi nesse momento que o Programa Florescendo Talentos by Cesar School (PFT) mudou a vida dele e do Projeto. Com o apoio da monitora do PFT na EREMA, Érika Quaresma, e de outro monitor, também do PFT, Dawyd Gomes, Jeferson ganhou motivação e muito conhecimento na área. Então, depois de 23 dias vidrado na tela de um notebook que comprou — com dinheiro fruto de muito trabalho anterior — decidiu apostar tudo nesse projeto que, mudará a vida de todas as pessoas e contribuirá para um Brasil sustentável ecologicamente e inovador, unindo ciência e tecnologia. ',
    foto: require('../../assets/image.png'), // Foto padrão
    contato: 'mailto:jefersonsouza1828@gmail.com'
  },
];

export default function SobreScreen({ navigation }) {
  const [autores, setAutores] = useState(autoresIniciais);
  const [uploading, setUploading] = useState(false);

  function handleVoltar() {
    navigation.goBack();
  }

  const pickImageAndUpload = async (autorId) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      uploadToCloudinary(fileUri, autorId);
    }
  };

  const uploadToCloudinary = async (fileUri, autorId) => {
    setUploading(true);

    const cloudName = 'drsx2clch'; // Substitua pelo seu cloud name
    const uploadPreset = 'recicla_ArcoVerde'; // Substitua pelo seu upload preset

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', uploadPreset); // <- Corrigido aqui

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        const novosAutores = autores.map((autor) =>
          autor.id === autorId ? { ...autor, foto: data.secure_url } : autor
        );
        setAutores(novosAutores);
        Alert.alert('Imagem atualizada com sucesso!');
      } else {
        Alert.alert('Erro no upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  function renderAutor({ item }) {
    return (
      <View style={styles.card}>
        <Image
          source={typeof item.foto === 'string' ? { uri: item.foto } : item.foto}
          style={styles.imagem}
        />
        <Text style={styles.titulo}>{item.nome}</Text>
        <Text style={styles.texto}>{item.descricao}</Text>
        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botaoContato}
            onPress={() => Linking.openURL(item.contato)}
          >
            <Icon name="email" size={18} color="#fff" />
            <Text style={styles.botaoContatoTexto}>Contato</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}
        onPress={handleVoltar}
      >
        <Icon name="arrow-left" size={24} color="#1976d2" style={{ marginTop: 20 }} />
        <Text style={{
          color: '#1976d2',
          fontSize: 16,
          marginTop: 20,
          marginLeft: 6,
          fontWeight: 'bold'
        }}>
          Voltar
        </Text>
      </TouchableOpacity>

      <Text style={styles.tituloTela}>Sobre o App Recicla ArcoVerde</Text>
      <Text style={styles.subtitulo}>Autores</Text>

      {uploading && <ActivityIndicator size="large" color="#1976d2" style={{ marginVertical: 10 }} />}

      <FlatList
        data={autores}
        keyExtractor={item => item.id}
        renderItem={renderAutor}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={{ marginTop: 5, marginBottom: 10, paddingHorizontal: 10 }}>
        <Text style={{
          fontSize: 12,
          color: '#888',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          Este aplicativo foi desenvolvido para promover a reciclagem e a sustentabilidade em Arcoverde e região.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    padding: 16,
  },
  tituloTela: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imagem: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  titulo: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  texto: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
    textAlign: 'center',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  botaoContato: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  botaoContatoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});
