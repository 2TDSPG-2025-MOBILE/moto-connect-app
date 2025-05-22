import { StatusBar } from "expo-status-bar";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colorScheme } from "nativewind";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

colorScheme.set("light");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { navigate } = useNavigation();

  function handleLogin() {
    // Aqui você pode adicionar a lógica de login
    console.log("Login:", { email, password });
    // navigate("Dashboard"); // Navegar para a próxima tela após login
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Background decorativo */}
      <View className="absolute bottom-0 right-0 w-full h-64">
        {/* Primeira linha diagonal */}
        <View 
          className="absolute bottom-0 right-0 bg-blue-600 h-20 w-full"
          style={{
            transform: [{ skewY: '-10deg' }],
            transformOrigin: 'bottom right'
          }}
        />
        {/* Segunda linha diagonal */}
        <View 
          className="absolute bottom-16 right-0 bg-blue-500 h-16 w-full"
          style={{
            transform: [{ skewY: '-10deg' }],
            transformOrigin: 'bottom right'
          }}
        />
      </View>

      {/* Conteúdo principal */}
      <View className="flex-1 justify-center px-8">
        
        {/* Logo e título */}
        <View className="items-center mb-16">
          {/* Ícone da moto */}
          <View className="bg-blue-600 rounded-full p-4 mb-4">
            <View className="w-16 h-16 items-center justify-center">
              {/* Simulando o ícone da moto com texto */}
              <Text className="text-white text-2xl font-bold">🏍️</Text>
            </View>
          </View>
          
          {/* Título */}
          <Text className="text-2xl font-bold text-gray-800">
            MotoConnect
          </Text>
        </View>

        {/* Formulário */}
        <View className="space-y-4">
          {/* Campo Email */}
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="w-full border border-blue-300 rounded-lg px-4 py-4 text-base text-gray-700"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Senha */}
          <View className="mt-4">
            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              className="w-full border border-blue-300 rounded-lg px-4 py-4 text-base text-gray-700"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity 
            onPress={handleLogin}
            className="w-full bg-blue-600 rounded-lg py-4 mt-6"
          >
            <Text className="text-white text-center text-base font-semibold">
              Entrar
            </Text>
          </TouchableOpacity>

          {/* Link Cadastre-se */}
          <View className="flex-row justify-end mt-4">
            <Text className="text-gray-600 text-sm">
              Não tem conta?{" "}
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 text-sm font-semibold underline">
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}