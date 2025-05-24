import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routes';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'SuccessScreen'>;

export function SuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute<SuccessScreenRouteProp>();
  const { motoData } = route.params || {};

  useEffect(() => {
    // Auto redirect após 4 segundos
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-blue-600">
      <StatusBar style="light" />
      
      {/* Header */}
      <View className="pt-12 pb-4 px-6">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            Voltar
          </Text>
        </TouchableOpacity>
        
        <Text className="text-white text-2xl font-bold">
          Cadastro de motos
        </Text>
      </View>

      {/* Conteúdo Principal */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Ícone de Sucesso */}
        <View className="bg-green-500 rounded-full p-8 mb-8">
          <Ionicons name="checkmark" size={64} color="white" />
        </View>

        {/* Texto Principal */}
        <Text className="text-white text-2xl font-bold text-center mb-4">
          Cadastro Realizado!
        </Text>
        
        <Text className="text-white text-base text-center opacity-90 mb-2">
          A moto já está disponível na listagem e já pode ir
        </Text>
        <Text className="text-white text-base text-center opacity-90 mb-8">
          para a manutenção!
        </Text>

        {/* Informações da Moto */}
        {motoData && (
          <View className="bg-white/10 rounded-xl p-4 mb-8 w-full max-w-xs">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-sm opacity-75">Placa:</Text>
              <Text className="text-white font-semibold text-lg">{motoData.placa}</Text>
            </View>
            
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-sm opacity-75">Modelo:</Text>
              <Text className="text-white font-semibold">{motoData.modelo}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-white text-sm opacity-75">Data:</Text>
              <Text className="text-white font-semibold">{motoData.dataEntrada}</Text>
            </View>
          </View>
        )}

        <Text className="text-white text-sm text-center opacity-75">
          Redirecionando automaticamente...
        </Text>
      </View>
    </View>
  );
}
