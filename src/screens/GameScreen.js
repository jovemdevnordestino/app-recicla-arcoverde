import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av'; // Adicione esta linha
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const perguntasQuiz = [
  {
    pergunta: 'O que é coleta seletiva?',
    alternativas: [
      'Separação dos resíduos recicláveis dos rejeitos',
      'Jogar todo lixo junto',
      'Queimar o lixo em casa',
      'Levar lixo para o aterro sanitário'
    ],
    correta: 0,
    recompensa: 'Parabéns! Você ganhou 10 pontos!'
  },
  {
    pergunta: 'Qual destes NÃO é reciclável?',
    alternativas: [
      'Papel limpo',
      'Garrafa PET',
      'Papel higiênico usado',
      'Lata de alumínio'
    ],
    correta: 2,
    recompensa: 'Ótimo! Você ganhou 10 pontos!'
  },
  {
    pergunta: 'Por que é importante lavar embalagens antes de reciclar?',
    alternativas: [
      'Para não sujar o caminhão',
      'Para evitar contaminação dos recicláveis',
      'Para deixar o lixo cheiroso',
      'Para gastar água'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com óleo de cozinha usado?',
    alternativas: [
      'Jogar na pia',
      'Jogar no vaso sanitário',
      'Guardar em garrafa PET e levar ao ponto de coleta',
      'Misturar no lixo comum'
    ],
    correta: 2,
    recompensa: 'Você acertou! +10 pontos!'
  },
  {
    pergunta: 'Qual a cor do coletor para papel?',
    alternativas: [
      'Azul',
      'Verde',
      'Amarelo',
      'Vermelho'
    ],
    correta: 0,
    recompensa: 'Acertou! +10 pontos!'
  },
  {
    pergunta: 'Qual a cor do coletor para plástico?',
    alternativas: [
      'Vermelho',
      'Verde',
      'Amarelo',
      'Azul'
    ],
    correta: 0,
    recompensa: 'Acertou! +10 pontos!'
  },
  {
    pergunta: 'Qual a cor do coletor para vidro?',
    alternativas: [
      'Verde',
      'Azul',
      'Vermelho',
      'Preto'
    ],
    correta: 0,
    recompensa: 'Acertou! +10 pontos!'
  },
  {
    pergunta: 'Qual a cor do coletor para metal?',
    alternativas: [
      'Amarelo',
      'Verde',
      'Vermelho',
      'Azul'
    ],
    correta: 0,
    recompensa: 'Acertou! +10 pontos!'
  },
  {
    pergunta: 'O que NÃO deve ser descartado no reciclável?',
    alternativas: [
      'Embalagem de papel limpa',
      'Restos de comida',
      'Garrafa PET',
      'Lata de refrigerante'
    ],
    correta: 1,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com pilhas e baterias usadas?',
    alternativas: [
      'Jogar no lixo comum',
      'Descartar em pontos de coleta específicos',
      'Enterrar no quintal',
      'Jogar no vaso sanitário'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'O que é rejeito?',
    alternativas: [
      'Material que pode ser reciclado',
      'Material que não pode ser reciclado',
      'Material orgânico',
      'Material eletrônico'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um benefício da reciclagem?',
    alternativas: [
      'Aumenta a poluição',
      'Economiza energia',
      'Diminui empregos',
      'Aumenta o lixo nos aterros'
    ],
    correta: 1,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'O que é compostagem?',
    alternativas: [
      'Processo de transformar resíduos orgânicos em adubo',
      'Queimar lixo',
      'Misturar lixo reciclável com orgânico',
      'Jogar lixo no rio'
    ],
    correta: 0,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é reciclável?',
    alternativas: [
      'Espelho quebrado',
      'Papelão limpo',
      'Papel higiênico usado',
      'Cerâmica'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'Por que apoiar catadores é importante?',
    alternativas: [
      'Eles ajudam a poluir',
      'Eles promovem a reciclagem e geram renda',
      'Eles queimam lixo',
      'Eles enterram lixo'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com medicamentos vencidos?',
    alternativas: [
      'Jogar no lixo comum',
      'Descartar em farmácias com coleta',
      'Jogar no vaso sanitário',
      'Queimar'
    ],
    correta: 1,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'O que é o 3R da sustentabilidade?',
    alternativas: [
      'Reduzir, Reutilizar, Reciclar',
      'Reclamar, Rejeitar, Recusar',
      'Recolher, Remover, Repor',
      'Reutilizar, Recolher, Recusar'
    ],
    correta: 0,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um resíduo perigoso?',
    alternativas: [
      'Restos de comida',
      'Pilhas e baterias',
      'Papel limpo',
      'Garrafa PET'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'O que NÃO deve ser feito com óleo de cozinha usado?',
    alternativas: [
      'Guardar em garrafa PET e entregar em ponto de coleta',
      'Jogar na pia',
      'Transformar em sabão',
      'Levar para reciclagem'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'Qual destes materiais é reciclável?',
    alternativas: [
      'Lata de alumínio',
      'Papel higiênico usado',
      'Espelho quebrado',
      'Cerâmica'
    ],
    correta: 0,
    recompensa: 'Parabéns! +10 pontos!'
  },
  // 20 perguntas extras para totalizar 40
  {
    pergunta: 'O que é lixo eletrônico?',
    alternativas: [
      'Restos de comida',
      'Equipamentos eletrônicos descartados',
      'Papel higiênico',
      'Vidro quebrado'
    ],
    correta: 1,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com roupas em bom estado?',
    alternativas: [
      'Jogar fora',
      'Doar',
      'Queimar',
      'Enterrar'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'Qual destes NÃO é um benefício da reciclagem?',
    alternativas: [
      'Reduz a poluição',
      'Economiza energia',
      'Aumenta o lixo nos aterros',
      'Gera empregos'
    ],
    correta: 2,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com vidro quebrado?',
    alternativas: [
      'Misturar com recicláveis',
      'Descartar inteiro e limpo, sem misturar',
      'Jogar no vaso sanitário',
      'Queimar'
    ],
    correta: 1,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'O que é coleta seletiva em condomínios?',
    alternativas: [
      'Misturar todo lixo',
      'Separar resíduos em recipientes próprios',
      'Jogar lixo na rua',
      'Queimar lixo'
    ],
    correta: 1,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um exemplo de reutilização?',
    alternativas: [
      'Usar pote de vidro como porta-temperos',
      'Jogar fora garrafa PET',
      'Queimar papel',
      'Descartar pilhas no lixo comum'
    ],
    correta: 0,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com restos de frutas e verduras?',
    alternativas: [
      'Jogar no lixo comum',
      'Compostar',
      'Jogar no vaso sanitário',
      'Queimar'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'Qual destes NÃO é um resíduo reciclável?',
    alternativas: [
      'Papelão limpo',
      'Cerâmica',
      'Lata de aço',
      'Garrafa PET'
    ],
    correta: 1,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'Por que separar o lixo?',
    alternativas: [
      'Facilita a reciclagem',
      'Aumenta o lixo',
      'Polui o meio ambiente',
      'Dificulta o trabalho dos catadores'
    ],
    correta: 0,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com embalagens sujas?',
    alternativas: [
      'Lavar antes de descartar',
      'Jogar direto no reciclável',
      'Queimar',
      'Misturar com orgânico'
    ],
    correta: 0,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um exemplo de rejeito?',
    alternativas: [
      'Restos de comida',
      'Papel higiênico usado',
      'Garrafa PET',
      'Lata de alumínio'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'O que é uma cooperativa de reciclagem?',
    alternativas: [
      'Grupo de pessoas que queima lixo',
      'Grupo que reúne catadores para triagem e venda de recicláveis',
      'Empresa de coleta de lixo comum',
      'Fábrica de papel'
    ],
    correta: 1,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'Qual destes NÃO deve ser descartado no reciclável?',
    alternativas: [
      'Papel limpo',
      'Garrafa PET',
      'Restos de comida',
      'Lata de alumínio'
    ],
    correta: 2,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com medicamentos vencidos?',
    alternativas: [
      'Jogar no lixo comum',
      'Descartar em farmácias com coleta',
      'Jogar no vaso sanitário',
      'Queimar'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um benefício da coleta seletiva?',
    alternativas: [
      'Aumenta o lixo nos aterros',
      'Reduz a poluição',
      'Diminui empregos',
      'Aumenta a contaminação'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com restos de comida?',
    alternativas: [
      'Compostar',
      'Misturar com recicláveis',
      'Jogar no vaso sanitário',
      'Queimar'
    ],
    correta: 0,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um exemplo de reciclagem?',
    alternativas: [
      'Transformar papel usado em papel novo',
      'Jogar papel no lixo comum',
      'Queimar papel',
      'Enterrar papel'
    ],
    correta: 0,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com eletrônicos velhos?',
    alternativas: [
      'Jogar no lixo comum',
      'Levar a pontos de coleta de eletrônicos',
      'Queimar',
      'Enterrar'
    ],
    correta: 1,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'Qual destes NÃO é um material reciclável?',
    alternativas: [
      'Lata de aço',
      'Cerâmica',
      'Garrafa PET',
      'Papelão limpo'
    ],
    correta: 1,
    recompensa: 'Correto! +10 pontos!'
  },
  {
    pergunta: 'Por que não jogar pilhas no lixo comum?',
    alternativas: [
      'Porque podem contaminar o solo e a água',
      'Porque são recicláveis',
      'Porque são pesadas',
      'Porque ocupam espaço'
    ],
    correta: 0,
    recompensa: 'Parabéns! +10 pontos!'
  },
  {
    pergunta: 'O que é reciclagem?',
    alternativas: [
      'Processo de transformar resíduos em novos produtos',
      'Jogar lixo no aterro',
      'Queimar lixo',
      'Misturar lixo'
    ],
    correta: 0,
    recompensa: 'Ótimo! +10 pontos!'
  },
  {
    pergunta: 'Qual destes é um exemplo de redução?',
    alternativas: [
      'Evitar uso de descartáveis',
      'Jogar lixo na rua',
      'Queimar lixo',
      'Misturar lixo'
    ],
    correta: 0,
    recompensa: 'Muito bem! +10 pontos!'
  },
  {
    pergunta: 'O que fazer com latas de alumínio?',
    alternativas: [
      'Lavar e amassar antes de descartar',
      'Jogar no lixo comum',
      'Queimar',
      'Misturar com orgânico'
    ],
    correta: 0,
    recompensa: 'Correto! +10 pontos!'
  },
];

export default function GameScreen({ navigation }) {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [mostrarRecompensa, setMostrarRecompensa] = useState(false);
  const [recompensaMsg, setRecompensaMsg] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [progressoSalvo, setProgressoSalvo] = useState(null);

  useEffect(() => {
    async function carregarProgresso() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setCarregando(false);
          return;
        }
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const dados = userDoc.data();
          setTipoUsuario(dados.tipo || null);
          if (dados.quizProgresso) {
            setPerguntaAtual(dados.quizProgresso.perguntaAtual || 0);
            setAcertos(dados.quizProgresso.acertos || 0);
            setProgressoSalvo(dados.quizProgresso);
          }
        }
      } catch (e) {
        // erro ao carregar progresso
      }
      setCarregando(false);
    }
    carregarProgresso();
  }, []);

  async function salvarProgresso(novaPergunta, novosAcertos) {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await setDoc(
        doc(db, 'usuarios', user.uid),
        {
          quizProgresso: {
            perguntaAtual: novaPergunta,
            acertos: novosAcertos,
            atualizadoEm: new Date().toISOString(),
          },
        },
        { merge: true }
      );
    } catch (e) {
      // erro ao salvar progresso
    }
  }

  // Funções para tocar som
  async function playAcerto() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/som-acerto.mp3') // coloque o arquivo na pasta assets
      );
      await sound.playAsync();
    } catch (e) {}
  }
  async function playErro() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/som-erro.mp3') // coloque o arquivo na pasta assets
      );
      await sound.playAsync();
    } catch (e) {}
  }

  function handleResponder(idx) {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(idx);
    const correta = perguntasQuiz[perguntaAtual].correta;
    if (idx === correta) {
      setAcertos(acertos + 1);
      setRecompensaMsg(perguntasQuiz[perguntaAtual].recompensa);
      playAcerto();
    } else {
      setRecompensaMsg('Resposta incorreta! Tente a próxima.');
      playErro();
    }
    setMostrarRecompensa(true);

    setTimeout(() => {
      setMostrarRecompensa(false);
      setRespostaSelecionada(null);
      const proximaPergunta = perguntaAtual + 1;
      if (proximaPergunta < perguntasQuiz.length) {
        setPerguntaAtual(proximaPergunta);
        salvarProgresso(proximaPergunta, idx === correta ? acertos + 1 : acertos);
      } else {
        salvarProgresso(0, 0);
        Alert.alert(
          'Quiz finalizado!',
          `Você acertou ${acertos + (idx === correta ? 1 : 0)} de ${perguntasQuiz.length} perguntas!`,
          [
            {
              text: 'OK',
              onPress: () => {
                setPerguntaAtual(0);
                setAcertos(0);
                setRespostaSelecionada(null);
                setProgressoSalvo(null);
              },
            },
          ]
        );
      }
    }, 1200);
  }

  function handleVoltar() {
    if (tipoUsuario === 'catador') {
      navigation.navigate('CatadoresTela');
    } else if (tipoUsuario === 'doador') {
      navigation.navigate('DoadoresTela');
    } else {
      navigation.goBack();
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  const pergunta = perguntasQuiz[perguntaAtual];

  return (
    <View style={styles.container}>
       <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 220 }}
                onPress={handleVoltar}
              >
                <Icon name="arrow-left" size={24} color="#1976d2" style={{ marginTop: 20 }} />
                <Text style={{ color: '#1976d2', fontSize: 16, marginTop: 20, marginLeft: 6, fontWeight: 'bold' }}>
                  Voltar
                </Text>
              </TouchableOpacity>
      <Text style={styles.quizTitulo}>Jogo do Saber</Text>
      <Text style={styles.quizPergunta}>{pergunta.pergunta}</Text>
      {pergunta.alternativas.map((alt, idx) => {
        // Define cor: azul se selecionada e correta, vermelho se selecionada e errada
        let alternativaStyle = styles.quizAlternativa;
        if (respostaSelecionada !== null && idx === respostaSelecionada) {
          if (respostaSelecionada === pergunta.correta) {
            alternativaStyle = [styles.quizAlternativa, styles.quizAlternativaSelecionada];
          } else {
            alternativaStyle = [styles.quizAlternativa, styles.quizAlternativaErrada];
          }
        }
        return (
          <TouchableOpacity
            key={idx}
            style={alternativaStyle}
            onPress={() => handleResponder(idx)}
            disabled={respostaSelecionada !== null}
          >
            <Text style={styles.quizAlternativaTexto}>{alt}</Text>
          </TouchableOpacity>
        );
      })}
      {mostrarRecompensa && (
        <Text style={styles.quizRecompensa}>{recompensaMsg}</Text>
      )}
      <Text style={styles.quizProgresso}>
        Nível {perguntaAtual + 1}
      </Text>
      <Text style={styles.quizPontuacao}>Pontos: {acertos * 10}</Text>
      {progressoSalvo && (
        <Text style={styles.quizSalvo}>
          Progresso salvo! Última vez: {progressoSalvo.atualizadoEm ? new Date(progressoSalvo.atualizadoEm).toLocaleString() : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    padding: 16,
    justifyContent: 'flex-start',
  },
  quizTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  quizPergunta: {
    fontSize: 18,
    color: '#222',
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  quizAlternativa: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    width: '100%',
  },
  quizAlternativaSelecionada: {
    backgroundColor: '#1976d2',
  },
  quizAlternativaErrada: {
    backgroundColor: '#d32f2f',
  },
  quizAlternativaTexto: {
    color: '#222',
    fontSize: 16,
    textAlign: 'center',
  },
  quizRecompensa: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  quizProgresso: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  quizPontuacao: {
    fontSize: 15,
    color: '#1976d2',
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },
  quizSalvo: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});