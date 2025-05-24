// src/screens/CadastroErroScreen/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routes';

type ErroScreenRouteProp = RouteProp<RootStackParamList, 'ErrorScreen'>;

export function ErrorScreen() {
  const navigation = useNavigation<import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ErroScreenRouteProp>();
  const motoData  = route.params || {};

  const handleTentarNovamente = () => {
    navigation.navigate('RFIDScreen', { motoData });
  };

  const handleVoltarCadastro = () => {
    navigation.navigate('MotorcycleRegistration');
  };

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
        {/* Ícone de Erro */}
        <View className="bg-red-500 rounded-full p-8 mb-8">
          <Ionicons name="close" size={64} color="white" />
        </View>

        {/* Texto Principal */}
        <Text className="text-white text-2xl font-bold text-center mb-4">
          Ops... Algo deu errado
        </Text>
        
        <Text className="text-white text-base text-center opacity-90 mb-8 max-w-xs">
          Certifique-se de que não há nenhum problema com o cadastro ainda e tente novamente!
        </Text>

        {/* Botões */}
        <View className="w-full max-w-xs space-y-4">
          <TouchableOpacity
            onPress={handleTentarNovamente}
            className="bg-white rounded-full px-6 py-4"
          >
            <Text className="text-blue-600 font-semibold text-center text-base">
              Tentar Novamente
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleVoltarCadastro}
            className="bg-white/20 rounded-full px-6 py-4 mt-3"
          >
            <Text className="text-white font-semibold text-center text-base">
              Voltar ao Cadastro
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}