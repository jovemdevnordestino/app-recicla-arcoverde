import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function CatadoresTela({ navigation }) {
  useEffect(() => {
    const checkTipo = async () => {
      const user = auth.currentUser;
      const docSnap = await getDoc(doc(db, 'usuarios', user.uid));
      if (docSnap.exists() && docSnap.data().tipo !== 'catador') {
        navigation.reset({ index: 0, routes: [{ name: 'TipoUsuarioScreen' }] });
      }
    };
    checkTipo();
  }, []);

  return (
    <View>
      <Text>Bem-vindo, Catador!</Text>
      {/* ...restante da tela... */}
    </View>
  );
}