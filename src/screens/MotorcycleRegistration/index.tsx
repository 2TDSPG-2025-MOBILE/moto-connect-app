import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { Menu } from '../../components/Menu';

interface FormData {
  placa: string;
  dataEntrada: string;
  modelo: string;
}

export default function MotorcycleRegistration() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    placa: '',
    dataEntrada: '',
    modelo: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPlaca = (text: string) => {
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
    } else {
      return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
    }
  };

  const formatData = (text: string) => {
    const numbers = text.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2);
    } else if (numbers.length <= 8) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    }
    return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
  };

  const handlePlacaChange = (text: string) => {
    const formatted = formatPlaca(text);
    handleInputChange('placa', formatted);
  };

  const handleDataChange = (text: string) => {
    const formatted = formatData(text);
    handleInputChange('dataEntrada', formatted);
  };

  const validateForm = (): boolean => {
    if (!formData.placa || formData.placa.length < 7) {
      Alert.alert('Erro', 'Digite uma placa válida (ex: ABC-1234)');
      return false;
    }

    if (!formData.dataEntrada || formData.dataEntrada.length < 10) {
      Alert.alert('Erro', 'Digite uma data válida (DD/MM/AAAA)');
      return false;
    }

    if (!formData.modelo.trim()) {
      Alert.alert('Erro', 'Digite o modelo da moto');
      return false;
    }

    return true;
  };

  const handleCadastrar = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { createVehicle } = require('../../services/api');
      
      const plateClean = formData.placa.replace('-', '').toUpperCase();
      
      const vehicleData = {
        licensePlate: plateClean,
        vehicleModel: formData.modelo || 'E'
      };

      const response = await createVehicle(vehicleData);

      if (response.status >= 200 && response.status < 300) {
        Alert.alert(
          'Sucesso!',
          'Moto cadastrada com sucesso!',
          // [
          //   {
          //     text: 'OK',
          //     onPress: () => {
          //       navigation.navigate('RFIDScreen', { 
          //         motoData: { 
          //           ...formData, 
          //           id: response.data.vehicleId 
          //         } 
          //       });
          //     }
          //   }
          // ]
        );
      } else {
        const errorMsg = response.data?.error || 'Erro ao cadastrar moto';
        Alert.alert('Erro', errorMsg);
      }

    } catch (error: any) {
      console.log('Erro no cadastro de moto:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Falha ao cadastrar moto. Verifique os dados e tente novamente.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />

      <View className="bg-blue-600 pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Voltar
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white text-2xl font-bold mt-4">
          Cadastro de motos
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-12" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-gray-800 text-lg font-semibold mb-6">
            Cadastre a Moto:
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Placa da Moto:</Text>
            <CustomInput
              placeholder="Ex: ABC-1234"
              value={formData.placa}
              onChangeText={handlePlacaChange}
              autoCapitalize="characters"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Data de cadastro:</Text>
            <CustomInput
              placeholder="DD/MM/AAAA"
              value={formData.dataEntrada}
              onChangeText={handleDataChange}
              keyboardType="numeric"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mt-4 font-medium mb-2">Modelo da moto:</Text>

            <View className="bg-white mt-4 rounded-xl px-2 justify-center h-14">
              <Picker
                selectedValue={formData.modelo || 'E'}
                onValueChange={(itemValue) => handleInputChange('modelo', itemValue)}
                style={{
                  color: "white",
                  fontSize: 16,
                  ...Platform.select({
                    android: { paddingLeft: 0 },
                  }),
                }}
                dropdownIconColor="white"
              >
                <Picker.Item key="E" label="E" value="E" />
                <Picker.Item key="SPORT" label="SPORT" value="SPORT" />
                <Picker.Item key="POP" label="POP" value="POP" />
              </Picker>
            </View>
          </View>

          <CustomButton
            title={isLoading ? "Processando..." : "Cadastrar"}
            onPress={handleCadastrar}
          />
        </View>

        <View className="h-8" />
      </ScrollView>

      <Menu />
    </View>
  );
}