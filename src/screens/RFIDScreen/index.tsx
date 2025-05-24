// src/screens/RFIDScreen/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../routes';


type RFIDScreenRouteProp = RouteProp<RootStackParamList, 'RFIDScreen'>;

export default function RFIDScreen() {
    const navigation = useNavigation<import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RFIDScreenRouteProp>();
    const { motoData } = route.params || {};
    const [isSearching, setIsSearching] = useState(false);

    const handleBuscarVeiculo = async () => {
        setIsSearching(true);

        // Simular busca RFID
        setTimeout(() => {
            setIsSearching(false);
            // Simular sucesso/erro aleatório para demonstração
            const success = Math.random() > 0.3; // 70% chance de sucesso

            if (success) {
                navigation.navigate('SuccessScreen', { motoData });
            } else {
                navigation.navigate('ErrorScreen', { motoData });
            }
        }, 3000);
    };

    return (
        <View className="flex-1 bg-blue-600">
            <StatusBar style="light" />

            {/* Header */}
            <View className="pt-12 pb-4 px-6">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
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
                {/* Ícone RFID */}
                <View className="rounded-full p-8 mb-8">
                    <View className="p-6 items-center">
                        <Image
                            source={require("../../../assets/images/rfid.png")} // coloque seu ícone aqui
                            style={{ width: 120, height: 90 }}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Texto Principal */}
                <Text className="text-white text-xl font-bold text-center mb-4">
                    Para finalizar o cadastro basta aproximar o celular do veículo
                </Text>

                <Text className="text-white text-sm text-center opacity-90 mb-8 max-w-xs">
                    Certifique-se de que o leitor de RFID esteja ligado!
                </Text>

                {/* Botão personalizado */}
                <View className="w-full max-w-xs">
                    <TouchableOpacity
                        onPress={handleBuscarVeiculo}
                        disabled={isSearching}
                        className={`bg-white rounded-full px-8 py-4 ${isSearching ? 'opacity-70' : ''
                            }`}
                    >
                        <Text className="text-blue-600 font-semibold text-center text-base">
                            {isSearching ? 'Buscando veículo...' : 'Buscar veículo'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isSearching && (
                    <View className="mt-6">
                        <Text className="text-white text-sm text-center opacity-75">
                            Aproxime o dispositivo da moto...
                        </Text>
                        <View className="flex-row justify-center mt-3">
                            <View className="bg-white/30 rounded-full w-2 h-2 mx-1 animate-pulse" />
                            <View className="bg-white/30 rounded-full w-2 h-2 mx-1 animate-pulse" />
                            <View className="bg-white/30 rounded-full w-2 h-2 mx-1 animate-pulse" />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}