import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const noticiasIniciais = [
  {
    id: '1',
    titulo: 'O que é Coleta Seletiva?',
    texto: 'A coleta seletiva é o processo de separação e recolhimento dos resíduos recicláveis, como papel, plástico, metal e vidro. Ela facilita o reaproveitamento dos materiais, reduz o volume de lixo nos aterros sanitários e contribui para a preservação do meio ambiente.\n\nA coleta seletiva pode ser feita em casa, no trabalho ou em espaços públicos. O ideal é separar o lixo em pelo menos dois recipientes: um para recicláveis (papel, plástico, metal, vidro) e outro para rejeitos (restos de comida, papel higiênico, etc).',
    imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    data: '22/05/2025',
  },
  {
    id: '2',
    titulo: 'Como separar o lixo corretamente?',
    texto: 'Separe o lixo em pelo menos dois recipientes: um para recicláveis (papel, plástico, metal, vidro) e outro para rejeitos (restos de comida, papel higiênico, etc). Lave embalagens antes de descartar e amasse latinhas e garrafas para economizar espaço.\n\nDica: Embalagens sujas podem contaminar outros materiais recicláveis, tornando-os inutilizáveis. Sempre que possível, limpe-as antes de descartar.',
    imagem: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    data: '20/05/2025',
  },
  {
    id: '3',
    titulo: 'A importância dos catadores',
    texto: 'Os catadores são fundamentais para o sucesso da coleta seletiva. Eles recolhem, separam e encaminham os materiais recicláveis para a indústria, gerando renda e promovendo a sustentabilidade nas cidades.\n\nApoie os catadores da sua região, separe corretamente o lixo e facilite o trabalho desses profissionais essenciais para o meio ambiente.',
    imagem: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    data: '18/05/2025',
  },
  {
    id: '4',
    titulo: 'Benefícios da Reciclagem',
    texto: 'A reciclagem reduz a poluição, economiza energia, diminui a extração de recursos naturais e gera empregos. Cada tonelada de papel reciclado economiza cerca de 22 árvores e milhares de litros de água.\n\nAlém disso, reciclar diminui o volume de resíduos enviados aos aterros sanitários e contribui para um planeta mais limpo.',
    imagem: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    data: '15/05/2025',
  },
  {
    id: '5',
    titulo: 'Dicas para Reciclar Mais',
    texto: 'Evite usar descartáveis, prefira produtos recicláveis, reutilize embalagens e incentive amigos e familiares a separar o lixo. Informe-se sobre os dias e horários da coleta seletiva em sua cidade.\n\nLembre-se: pequenas atitudes fazem grande diferença para o meio ambiente!',
    imagem: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    data: '12/05/2025',
  },
  {
    id: '6',
    titulo: 'O que não pode ser reciclado?',
    texto: 'Alguns materiais não são recicláveis, como papel carbono, papel higiênico, guardanapos sujos, espelhos, cerâmicas, porcelanas, adesivos e embalagens metalizadas. Fique atento ao descartar!',
    imagem: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a?auto=format&fit=crop&w=600&q=80',
    data: '10/05/2025',
  },
  {
    id: '7',
    titulo: 'Reciclagem de eletrônicos',
    texto: 'Equipamentos eletrônicos como celulares, computadores e pilhas não devem ser descartados no lixo comum. Procure pontos de coleta específicos para lixo eletrônico em sua cidade.',
    imagem: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    data: '08/05/2025',
  },
  {
    id: '8',
    titulo: 'Reciclagem de óleo de cozinha',
    texto: 'Nunca jogue óleo de cozinha usado na pia! Ele pode ser reciclado e transformado em sabão ou biodiesel. Guarde o óleo em garrafas PET e entregue em pontos de coleta.',
    imagem: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    data: '06/05/2025',
  },
  {
    id: '9',
    titulo: 'Reciclagem de vidro',
    texto: 'Vidros devem ser descartados inteiros e limpos. Não misture vidro com outros materiais e evite quebrar para não causar acidentes com os catadores.',
    imagem: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    data: '04/05/2025',
  },
  {
    id: '10',
    titulo: 'Reciclagem de papel',
    texto: 'Papéis limpos e secos podem ser reciclados. Evite molhar ou sujar jornais, revistas e folhas para garantir sua reciclagem.',
    imagem: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    data: '02/05/2025',
  },
  {
    id: '11',
    titulo: 'Reciclagem de plástico',
    texto: 'Plásticos como garrafas PET, embalagens de produtos de limpeza e sacolas podem ser reciclados. Lave antes de descartar e amasse para ocupar menos espaço.',
    imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    data: '30/04/2025',
  },
  {
    id: '12',
    titulo: 'Reciclagem de metal',
    texto: 'Latas de alumínio, aço e outros metais são altamente recicláveis. Lave e amasse as latas antes de descartar.',
    imagem: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    data: '28/04/2025',
  },
  {
    id: '13',
    titulo: 'Reciclagem de pilhas e baterias',
    texto: 'Pilhas e baterias não devem ser descartadas no lixo comum. Procure pontos de coleta em supermercados e estabelecimentos autorizados.',
    imagem: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    data: '26/04/2025',
  },
  {
    id: '14',
    titulo: 'Reciclagem de medicamentos',
    texto: 'Medicamentos vencidos ou em desuso devem ser descartados em farmácias que possuem pontos de coleta específicos. Nunca jogue no lixo comum ou no vaso sanitário.',
    imagem: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    data: '24/04/2025',
  },
  {
    id: '15',
    titulo: 'Reciclagem de roupas',
    texto: 'Roupas em bom estado podem ser doadas. As que não servem mais podem ser encaminhadas para projetos de reciclagem têxtil.',
    imagem: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a?auto=format&fit=crop&w=600&q=80',
    data: '22/04/2025',
  },
  {
    id: '16',
    titulo: 'Compostagem doméstica',
    texto: 'Restos de frutas, legumes e verduras podem ser transformados em adubo por meio da compostagem. Isso reduz o lixo orgânico e enriquece o solo.',
    imagem: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    data: '20/04/2025',
  },
  {
    id: '17',
    titulo: 'O que são resíduos perigosos?',
    texto: 'Resíduos perigosos incluem produtos químicos, solventes, tintas, agrotóxicos, pilhas, baterias e lâmpadas fluorescentes. Eles exigem descarte especial para não contaminar o meio ambiente.',
    imagem: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    data: '18/04/2025',
  },
  {
    id: '18',
    titulo: 'Coleta seletiva em condomínios',
    texto: 'Condomínios podem organizar a coleta seletiva com a separação dos resíduos em recipientes próprios e a destinação correta para cooperativas de reciclagem.',
    imagem: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    data: '16/04/2025',
  },
  {
    id: '19',
    titulo: 'Cooperativas de reciclagem',
    texto: 'As cooperativas reúnem catadores e promovem a triagem, prensagem e venda dos materiais recicláveis, gerando renda e inclusão social.',
    imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    data: '14/04/2025',
  },
  {
    id: '20',
    titulo: 'Reduza, Reutilize, Recicle',
    texto: 'A regra dos 3Rs é fundamental para a sustentabilidade: Reduza o consumo, Reutilize sempre que possível e Recicle o que não puder ser reutilizado.',
    imagem: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    data: '12/04/2025',
  },
];

export default function NoticiasScreen({ navigation }) {
  const [noticias, setNoticias] = useState(noticiasIniciais);
  const [busca, setBusca] = useState('');

  // Filtra notícias pelo título/texto
  const noticiasFiltradas = noticias.filter(
    n =>
      n.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      n.texto.toLowerCase().includes(busca.toLowerCase())
  );

  // Função para voltar de acordo com o tipo do usuário
  async function handleVoltar() {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigation.goBack();
        return;
      }
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      const tipo = userDoc.exists() ? userDoc.data().tipo : null;
      if (tipo === 'doador') {
        navigation.navigate('DoadoresTela');
      } else if (tipo === 'catador') {
        navigation.navigate('CatadoresTela');
      } else {
        navigation.goBack();
      }
    } catch (e) {
      navigation.goBack();
    }
  }

  function renderNoticia({ item }) {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imagem }} style={styles.imagem} />
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.data}>{item.data}</Text>
        <Text style={styles.texto}>{item.texto}</Text>
        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botaoCompartilhar}
            onPress={() =>
              Linking.openURL(
                `https://wa.me/?text=${encodeURIComponent(item.titulo + ' - ' + item.texto)}`
              )
            }
          >
            <Icon name="whatsapp" size={18} color="#fff" />
            <Text style={styles.botaoCompartilharTexto}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}
          onPress={handleVoltar}
        >
          <Icon name="arrow-left" size={24} color="#1976d2" style={{ marginTop: 20 }} />
          <Text style={{ color: '#1976d2', fontSize: 16, marginTop: 20, marginLeft: 6, fontWeight: 'bold' }}>
            Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.tituloTela}>Informações & Dicas</Text>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar informação..."
          value={busca}
          onChangeText={setBusca}
          placeholderTextColor="#888"
        />

        <FlatList
          data={noticiasFiltradas}
          keyExtractor={item => item.id}
          renderItem={renderNoticia}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.nenhumaNoticia}>Nenhuma informação encontrada.</Text>
          }
          showsVerticalScrollIndicator={false}
        />

        <View style={{ marginTop: 5, marginBottom: 10, paddingHorizontal: 10 }}>
          <Text style={{
            fontSize: 11,
            color: '#888',
            textAlign: 'center',
            fontStyle: 'italic',
            lineHeight: 10,
          }}>
            Fontes das informações: Ministério do Meio Ambiente, IBGE, eCycle, Carta Capital, Toda Matéria, Portal Brasil, Recicla Sampa, EcoD, ONU Meio Ambiente, Wikipedia, e campanhas educativas de prefeituras brasileiras.
          </Text>
        </View>
      </View>
    </>
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
    marginTop:20
  },
  inputBusca: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdb76b',
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
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
    height: 140,
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
  },
  data: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  texto: {
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  botaoCompartilhar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  botaoCompartilharTexto: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
  nenhumaNoticia: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
  },
});