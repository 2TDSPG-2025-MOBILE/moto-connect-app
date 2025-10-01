import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { useState, useEffect } from "react";
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  View,
  Alert 
} from "react-native";

import { BackgroundStripes } from "../../components/BackgroundStripes";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { Logo } from "../../components/Logo";

colorScheme.set("light");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { navigate } = useNavigation();

  useEffect(() => {
    loadSavedData();
  }, []);

  async function loadSavedData() {
    try {
      const savedEmail = await AsyncStorage.getItem('@user_email');
      const savedRememberMe = await AsyncStorage.getItem('@remember_me');
      
      if (savedEmail && savedRememberMe === 'true') {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Erro ao carregar dados salvos:', error);
    }
  }

  async function saveUserData(userData) {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('@user_email', userData.email);
        await AsyncStorage.setItem('@remember_me', 'true');
      } else {
        await AsyncStorage.removeItem('@user_email');
        await AsyncStorage.removeItem('@remember_me');
      }
      
      await AsyncStorage.setItem('@current_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@login_timestamp', new Date().toISOString());
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  }

  function validateFields() {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function clearFields() {
    setEmail("");
    setPassword("");
    setErrors({});
  }

  async function handleLogin() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados');
      return;
    }

    setIsLoading(true);

    try {
      const { loginUser } = require('../../services/api');
      
      const authResult = await loginUser(email.toLowerCase().trim(), password);
      
      if (authResult.success && authResult.user) {
        const userData = {
          ...authResult.user,
          email: email.toLowerCase().trim(),
          loginTime: new Date().toISOString(),
          isAuthenticated: true,
          token: authResult.token
        };

        await saveUserData(userData);
        await saveLoginHistory(userData);

        console.log("Login realizado:", userData);
        
        Alert.alert(
          'Sucesso', 
          authResult.message || 'Login realizado com sucesso!',
          [{ text: 'OK', onPress: () => navigate("Home") }]
        );
      } else {
        Alert.alert('Erro', authResult.message || 'Email ou senha incorretos');
      }

    } catch (error) {
      console.log('Erro no login:', error);
      Alert.alert('Erro', 'Falha ao realizar login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveLoginHistory(userData) {
    try {
      const existingHistory = await AsyncStorage.getItem('@login_history');
      let history = existingHistory ? JSON.parse(existingHistory) : [];
      
      history.push({
        email: userData.email,
        timestamp: userData.loginTime,
        device: Platform.OS
      });

      // Manter apenas os últimos 10 logins
      if (history.length > 10) {
        history = history.slice(-10);
      }

      await AsyncStorage.setItem('@login_history', JSON.stringify(history));
    } catch (error) {
      console.log('Erro ao salvar histórico:', error);
    }
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
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // Limpar erro quando usuário começar a digitar
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: null }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.email}
              </Text>
            )}

            <CustomInput
              placeholder="Senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                // Limpar erro quando usuário começar a digitar
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: null }));
                }
              }}
              secureTextEntry
              error={errors.password}
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.password}
              </Text>
            )}

            {/* Checkbox Lembrar-me */}
            <TouchableOpacity 
              className="flex-row items-center mt-4 mb-2"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${
                rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
              }`}>
                {rememberMe && (
                  <Text className="text-white text-xs">✓</Text>
                )}
              </View>
              <Text className="text-gray-700 text-sm">
                Lembrar meu email
              </Text>
            </TouchableOpacity>

            <CustomButton
              title={isLoading ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              disabled={isLoading}
            />

            {/* Botão Limpar Campos */}
            <TouchableOpacity 
              className="mt-2 py-2"
              onPress={clearFields}
            >
              <Text className="text-gray-500 text-center text-sm">
                Limpar campos
              </Text>
            </TouchableOpacity>

            {/* Link Cadastre-se */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600 text-sm">
                Não tem conta?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigate("Register")}>
                <Text className="text-blue-600 text-sm font-semibold underline">
                  Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>

            {/* Exibir email salvo dinamicamente */}
            {email && (
              <View className="mt-4 p-3 bg-gray-100 rounded-lg">
                <Text className="text-gray-600 text-xs">
                  Email inserido: {email}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}