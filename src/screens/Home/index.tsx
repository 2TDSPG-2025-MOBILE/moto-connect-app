import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";

import { colorScheme } from "nativewind";

import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

colorScheme.set("light");

export default function Home() {
  const { navigate } = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com imagem de fundo */}
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop" }}
          className="h-64 justify-end"
        >
          {/* Overlay escuro */}
          <View className="absolute inset-0 bg-black/40" />
          
          {/* Botão de perfil */}
          <TouchableOpacity className="absolute top-12 right-4 bg-white/20 rounded-full p-2">
            <Ionicons name="person-outline" size={24} color="white" />
          </TouchableOpacity>

          {/* Conteúdo do header */}
          <View className="p-6 pb-8">
            <Text className="text-white text-2xl font-bold mb-2">
              MotoConnect
            </Text>
            <Text className="text-white text-base opacity-90">
              Conectando Motos, Otimizando Pátios
            </Text>
            <Text className="text-white text-sm opacity-80 mt-1">
              Facilitamos o seu dia a dia da melhor maneira
            </Text>
          </View>
        </ImageBackground>

        {/* Seção de saudação */}
        <View className="bg-blue-600 px-6 py-4">
          <Text className="text-white text-lg font-semibold mb-1">
            Olá Mateus, como vai?
          </Text>
          <Text className="text-white text-sm opacity-90">
            Aqui nas opções você pode obter todas as informações das motos que estão no pátio basta acessar as informações abaixo.
          </Text>
        </View>

        {/* Cards de opções */}
        <View className="px-6 py-8">
          <View className="flex-row justify-between">
            {/* Card Cadastro de motos */}
            <TouchableOpacity 
              className="bg-white rounded-2xl p-6 flex-1 mr-3 shadow-sm border border-gray-100"
              onPress={() => console.log("Cadastro de motos")}
            >
              <View className="items-center">
                <View className="bg-blue-100 rounded-full p-4 mb-4">
                  <MaterialCommunityIcons name="motorbike" size={32} color="#2563eb" />
                </View>
                <Text className="text-gray-800 font-semibold text-center">
                  Cadastro de motos
                </Text>
              </View>
            </TouchableOpacity>

            {/* Card Listagem de motos */}
            <TouchableOpacity 
              className="bg-white rounded-2xl p-6 flex-1 ml-3 shadow-sm border border-gray-100"
              onPress={() => console.log("Listagem de motos")}
            >
              <View className="items-center">
                <View className="bg-blue-100 rounded-full p-4 mb-4">
                  <MaterialCommunityIcons name="format-list-bulleted" size={32} color="#2563eb" />
                </View>
                <Text className="text-gray-800 font-semibold text-center">
                  Listagem de motos
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de ajuda */}
        <View className="bg-blue-600 mx-6 rounded-2xl p-6 mb-8">
          <Text className="text-white text-lg font-semibold mb-2">
            Precisa de ajuda?
          </Text>
          <Text className="text-white text-sm opacity-90 mb-4">
            Fale com o nosso time de atendimento 24 horas
          </Text>
          
          <TouchableOpacity 
            className="bg-white rounded-full px-6 py-3 self-start"
            onPress={() => console.log("Fale conosco")}
          >
            <Text className="text-blue-600 font-semibold">
              Fale conosco
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-blue-600 flex-row justify-around py-4 px-6">
        <TouchableOpacity className="items-center">
          <MaterialCommunityIcons name="motorbike" size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center">
          <MaterialCommunityIcons name="speedometer" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}