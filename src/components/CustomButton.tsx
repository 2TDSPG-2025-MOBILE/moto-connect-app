// src/components/CustomButton.tsx
import { TouchableOpacity, Text } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

export function CustomButton({ title, onPress }: CustomButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="w-full bg-blue-600 rounded-lg py-4 mt-6"
    >
      <Text className="text-white text-center text-base font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}