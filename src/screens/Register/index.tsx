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

interface Errors {
  email?: string | null;
  fullName?: string | null;
  registrationNumber?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const { navigate } = useNavigation();

  // Calcular progresso do formulário dinamicamente
  useEffect(() => {
    const fields = [email, fullName, registrationNumber, password, confirmPassword];
    const filledFields = fields.filter(field => field.trim().length > 0).length;
    const progress = (filledFields / fields.length) * 100;
    setFormProgress(progress);
  }, [email, fullName, registrationNumber, password, confirmPassword]);

  // Carregar dados salvos (rascunho)
  useEffect(() => {
    loadDraftData();
  }, []);

  // Salvar rascunho automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftData();
    }, 2000); // Salva após 2 segundos de inatividade

    return () => clearTimeout(timer);
  }, [email, fullName, registrationNumber]);

  // Carregar dados de rascunho
  async function loadDraftData() {
    try {
      const draft = await AsyncStorage.getItem('@registration_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        setEmail(draftData.email || '');
        setFullName(draftData.fullName || '');
        setRegistrationNumber(draftData.registrationNumber || '');
      }
    } catch (error) {
      console.log('Erro ao carregar rascunho:', error);
    }
  }

  // Salvar rascunho
  async function saveDraftData() {
    try {
      const draftData = {
        email: email.trim(),
        fullName: fullName.trim(),
        registrationNumber: registrationNumber.trim(),
        lastSaved: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('@registration_draft', JSON.stringify(draftData));
    } catch (error) {
      console.log('Erro ao salvar rascunho:', error);
    }
  }

  // Validação completa de campos
  function validateFields() {
    const newErrors: Errors = {};

    // Validação de email
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    } else if (!email.toLowerCase().includes('mottu')) {
      newErrors.email = 'Deve ser um email da Mottu';
    }

    // Validação de nome
    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Nome deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(fullName)) {
      newErrors.fullName = 'Nome deve conter apenas letras';
    }

    // Validação de número de registro
    if (!registrationNumber.trim()) {
      newErrors.registrationNumber = 'Número de registro é obrigatório';
    } else if (!/^\d+$/.test(registrationNumber)) {
      newErrors.registrationNumber = 'Deve conter apenas números';
    } else if (registrationNumber.length < 4) {
      newErrors.registrationNumber = 'Deve ter pelo menos 4 dígitos';
    }

    // Validação de senha
    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Senha deve ter maiúscula, minúscula e número';
    }

    // Validação de confirmação de senha
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Limpar todos os campos
  function clearFields() {
    setEmail("");
    setFullName("");
    setRegistrationNumber("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    AsyncStorage.removeItem('@registration_draft');
  }

  // Salvar dados do usuário após cadastro
  async function saveUserData(userData) {
    try {
      // Salvar dados do usuário
      await AsyncStorage.setItem('@user_profile', JSON.stringify(userData));
      
      // Salvar preferências padrão
      const defaultPreferences = {
        notifications: true,
        theme: 'light',
        language: 'pt-BR',
        autoSave: true
      };
      await AsyncStorage.setItem('@user_preferences', JSON.stringify(defaultPreferences));
      
      // Remover rascunho após cadastro bem-sucedido
      await AsyncStorage.removeItem('@registration_draft');
      
      // Salvar timestamp do cadastro
      await AsyncStorage.setItem('@registration_timestamp', new Date().toISOString());
      
    } catch (error) {
      console.log('Erro ao salvar dados do usuário:', error);
    }
  }

  // Função de cadastro
  async function handleRegister() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados');
      return;
    }

    setIsLoading(true);

    try {
      // Verificar se email já existe (simulação)
      const existingUsers = await AsyncStorage.getItem('@registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (emailExists) {
        Alert.alert('Erro', 'Este email já está cadastrado');
        setIsLoading(false);
        return;
      }

      // Dados do novo usuário
      const userData = {
        id: Date.now().toString(),
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        registrationNumber: registrationNumber.trim(),
        registrationDate: new Date().toISOString(),
        isActive: true
      };

      // Adicionar à lista de usuários
      users.push(userData);
      await AsyncStorage.setItem('@registered_users', JSON.stringify(users));

      // Salvar dados do usuário atual
      await saveUserData(userData);

      console.log("Cadastro realizado:", userData);
      
      Alert.alert(
        'Sucesso!', 
        'Cadastro realizado com sucesso!\nVocê pode fazer login agora.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              clearFields();
              navigate("Login");
            }
          }
        ]
      );

    } catch (error) {
      console.log('Erro no cadastro:', error);
      Alert.alert('Erro', 'Falha ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
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

          {/* Barra de progresso */}
          <View className="mb-6">
            <Text className="text-gray-600 text-sm mb-2">
              Progresso do cadastro: {Math.round(formProgress)}%
            </Text>
            <View className="w-full h-2 bg-gray-200 rounded-full">
              <View 
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${formProgress}%` }}
              />
            </View>
          </View>

          {/* Formulário */}
          <View>
            <CustomInput
              placeholder="Email da Mottu"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
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
              placeholder="Nome Completo"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors(prev => ({ ...prev, fullName: null }));
                }
              }}
              error={errors.fullName}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.fullName}
              </Text>
            )}

            <CustomInput
              placeholder="Número de registro"
              value={registrationNumber}
              onChangeText={(text) => {
                setRegistrationNumber(text);
                if (errors.registrationNumber) {
                  setErrors(prev => ({ ...prev, registrationNumber: null }));
                }
              }}
              keyboardType="numeric"
              error={errors.registrationNumber}
            />
            {errors.registrationNumber && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.registrationNumber}
              </Text>
            )}

            <CustomInput
              placeholder="Senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
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

            <CustomInput
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: null }));
                }
              }}
              secureTextEntry
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.confirmPassword}
              </Text>
            )}

            <CustomButton
              title={isLoading ? "Cadastrando..." : "Cadastrar"}
              onPress={handleRegister}
              disabled={isLoading}
            />

            {/* Botão Limpar Campos */}
            <TouchableOpacity 
              className="mt-2 py-2"
              onPress={clearFields}
            >
              <Text className="text-gray-500 text-center text-sm">
                Limpar todos os campos
              </Text>
            </TouchableOpacity>

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

            {/* Exibir dados inseridos dinamicamente */}
            {(fullName || registrationNumber) && (
              <View className="mt-4 p-3 bg-gray-100 rounded-lg">
                <Text className="text-gray-600 text-xs font-semibold mb-1">
                  Dados inseridos:
                </Text>
                {fullName && (
                  <Text className="text-gray-600 text-xs">
                    Nome: {fullName}
                  </Text>
                )}
                {registrationNumber && (
                  <Text className="text-gray-600 text-xs">
                    Registro: {registrationNumber}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}