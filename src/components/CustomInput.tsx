// src/components/CustomInput.tsx
import { TextInput, View } from "react-native";

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export function CustomInput({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences"
}: CustomInputProps) {
  return (
    <View className="mb-4">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="w-full border border-blue-300 rounded-lg px-4 py-4 text-base text-gray-700"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}