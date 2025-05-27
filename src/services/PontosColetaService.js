// src/services/pontosColetaService.js
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const adicionarPontoColeta = async (nome, latitude, longitude, endereco) => {
  try {
    await addDoc(collection(db, 'pontosColeta'), {
      nome,
      latitude,
      longitude,
      endereco,
    });
    console.log('Ponto de coleta adicionado com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar ponto de coleta:', error);
  }
};
