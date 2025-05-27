import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Adicione esta linha

// Dados reais aproximados por fonte ambiental
const IMPACTO_MATERIAIS = {
  Plástico: {
    cor: '#34D399',
    imagem: 'https://img.icons8.com/color/96/plastic.png',
    co2: 6, // kg CO2 evitado por kg reciclado
    energia: 14, // kWh economizado por kg
    agua: 80, // litros por kg
  },
  Papel: {
    cor: '#60A5FA',
    imagem: 'https://img.icons8.com/color/96/paper.png',
    co2: 1.8,
    energia: 4,
    agua: 26,
  },
  Vidro: {
    cor: '#F87171',
    imagem: 'https://img.icons8.com/color/96/wine-bottle.png', // Ícone de vidro (garrafa)
    co2: 0.3,
    energia: 1.2,
    agua: 1.5,
  },
  Alumínio: {
    cor: '#FBBF24',
    imagem: 'https://img.icons8.com/fluency/96/sheet-metal.png', // Ícone de alumínio
    co2: 9,
    energia: 14,
    agua: 20,
  },
};

const materiaisIniciais = [
  { nome: 'Plástico', quantidade: '' },
  { nome: 'Papel', quantidade: '' },
  { nome: 'Vidro', quantidade: '' },
  { nome: 'Alumínio', quantidade: '' },
];

const ImpactoScreen = ({ navigation }) => {
  const [materiais, setMateriais] = useState(materiaisIniciais);
  const [resultado, setResultado] = useState(null);

  const calcularImpacto = () => {
    let total = { co2: 0, energia: 0, agua: 0 };
    let detalhes = [];

    materiais.forEach((item) => {
      const qtd = parseFloat(item.quantidade.replace(',', '.')) || 0;
      const dados = IMPACTO_MATERIAIS[item.nome];
      if (qtd > 0) {
        const co2 = dados.co2 * qtd;
        const energia = dados.energia * qtd;
        const agua = dados.agua * qtd;
        total.co2 += co2;
        total.energia += energia;
        total.agua += agua;
        detalhes.push({
          ...item,
          cor: dados.cor,
          imagem: dados.imagem,
          co2,
          energia,
          agua,
        });
      }
    });

    setResultado({ total, detalhes });
    Keyboard.dismiss();
  };

  const handleChange = (idx, valor) => {
    const novos = materiais.map((item, i) =>
      i === idx ? { ...item, quantidade: valor } : item
    );
    setMateriais(novos);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Botão de voltar azul no topo */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 40 : 10, marginBottom: 12 }}
      >
        <Icon name="arrow-left" size={22} color="#1976d2" />
        <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 18, marginLeft: 6 }}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Calcule seu Impacto Ambiental</Text>
      <Text style={styles.subText}>
        Informe quanto você reciclou de cada material (em kg):
      </Text>

      {materiais.map((item, idx) => (
        <View key={item.nome} style={styles.inputBox}>
          <Image source={{ uri: IMPACTO_MATERIAIS[item.nome].imagem }} style={styles.image} />
          <Text style={styles.inputLabel}>{item.nome}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            value={item.quantidade}
            onChangeText={(valor) => handleChange(idx, valor)}
            maxLength={6}
          />
          <Text style={styles.inputUnit}>kg</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={calcularImpacto}>
        <Text style={styles.buttonText}>Calcular Impacto</Text>
      </TouchableOpacity>

      {resultado && (
        <View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Resumo do Impacto</Text>
            <Text style={styles.summaryText}>
              🌱 CO₂ evitado: <Text style={styles.bold}>{resultado.total.co2.toFixed(2)} kg</Text>
            </Text>
            <Text style={styles.summaryText}>
              ⚡ Energia economizada: <Text style={styles.bold}>{resultado.total.energia.toFixed(2)} kWh</Text>
            </Text>
            <Text style={styles.summaryText}>
              💧 Água preservada: <Text style={styles.bold}>{resultado.total.agua.toFixed(2)} litros</Text>
            </Text>
            <Text style={styles.subText}>
              Isso equivale a deixar um carro desligado por mais de {(resultado.total.co2/2.3).toFixed(1)} horas ou plantar {(resultado.total.co2/21).toFixed(1)} árvores!
            </Text>
          </View>

          {resultado.detalhes.map((item) => (
            <View key={item.nome} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.imagem }} style={styles.image} />
                <View>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardSubtitle}>{item.quantidade} kg reciclados</Text>
                </View>
              </View>
              <Text style={styles.metricLabel}>CO₂ evitado: <Text style={{color: item.cor}}>{item.co2.toFixed(2)} kg</Text></Text>
              <Text style={styles.metricLabel}>Energia economizada: <Text style={{color: item.cor}}>{item.energia.toFixed(2)} kWh</Text></Text>
              <Text style={styles.metricLabel}>Água preservada: <Text style={{color: item.cor}}>{item.agua.toFixed(2)} litros</Text></Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.curiosityBox}>
        <Text style={styles.curiosityTitle}>Curiosidades</Text>
        <Text style={styles.curiosityText}>
          ♻️ Reciclar 1 kg de plástico evita cerca de 6 kg de CO₂ e economiza 14 kWh de energia.
        </Text>
        <Text style={styles.curiosityText}>
          💡 Reciclar 1 kg de metal economiza até 14 kWh de energia.
        </Text>
        <Text style={styles.curiosityText}>
          🍃 O vidro leva até 1.000 anos para se decompor na natureza.
        </Text>
        <Text style={styles.curiosityText}>
          📄 Reciclar papel economiza 26 litros de água por kg.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ℹ️ Dados aproximados de fontes ambientais como ABRELPE, CEMPRE, eCycle e EPA.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: '#222',
    width: 70,
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdb76b',
    padding: 8,
    fontSize: 16,
    width: 70,
    marginLeft: 8,
    color: '#222',
    textAlign: 'right',
  },
  inputUnit: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#064E3B',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  curiosityBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  curiosityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  curiosityText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  textoBotaoVoltar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
});

export default ImpactoScreen;
