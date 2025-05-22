import { useNavigation } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";

import { colorScheme } from "nativewind";

import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { BackgroundStripes } from "../../components/BackgroundStripes";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { Logo } from "../../components/Logo";

colorScheme.set("light");

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const { navigate } = useNavigation();

  function handleRegister() {
    console.log("Cadastro:", { 
      email, 
      fullName, 
      registrationNumber, 
      password 
    });
    // Aqui você pode adicionar a lógica de cadastro
    // navigate("Login"); // Voltar para login após cadastro
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      
      {/* Background decorativo */}
      <BackgroundStripes />

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Conteúdo principal */}
        <View className="flex-1 justify-center px-8 py-10">
          
          {/* Logo e título */}
          <Logo />

          {/* Formulário */}
          <View>
            <CustomInput
              placeholder="Email da Mottu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              placeholder="Nome Completo"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput
              placeholder="Número de registro"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              keyboardType="numeric"
            />

            <CustomInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomButton
              title="Cadastrar"
              onPress={handleRegister}
            />

            {/* Link Voltar para Login */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600 text-sm">
                Já tem conta?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigate("Login")}>
                <Text className="text-blue-600 text-sm font-semibold underline">
                  Entrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}