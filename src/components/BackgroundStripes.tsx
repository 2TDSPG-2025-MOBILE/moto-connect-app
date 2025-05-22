import { View } from "react-native";

export function BackgroundStripes() {
  return (
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
  );
}