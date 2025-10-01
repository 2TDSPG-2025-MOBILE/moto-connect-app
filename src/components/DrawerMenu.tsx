import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const menuItems = [
    {
      title: 'Home',
      icon: 'home-outline',
      iconType: 'Ionicons',
      onPress: () => {
        navigation.navigate('Home');
        onClose();
      }
    },
    {
      title: 'Cadastrar Moto',
      icon: 'motorbike',
      iconType: 'MaterialCommunityIcons',
      onPress: () => {
        navigation.navigate('MotorcycleRegistration');
        onClose();
      }
    },
    {
      title: 'Listagem de Motos',
      icon: 'speedometer',
      iconType: 'MaterialCommunityIcons',
      onPress: () => {
        navigation.navigate('MotorcycleList');
        onClose();
      }
    },
    {
      title: 'Perfil',
      icon: 'person-outline',
      iconType: 'Ionicons',
      onPress: () => {
        // Navegar para tela de perfil quando implementada
        onClose();
      }
    },
    {
      title: 'Configurações',
      icon: 'settings-outline',
      iconType: 'Ionicons',
      onPress: () => {
        // Navegar para tela de configurações quando implementada
        onClose();
      }
    },
    {
      title: 'Sair',
      icon: 'log-out-outline',
      iconType: 'Ionicons',
      onPress: () => {
        navigation.navigate('Login');
        onClose();
      }
    }
  ];

  const renderIcon = (iconName: string, iconType: string) => {
    if (iconType === 'Ionicons') {
      return <Ionicons name={iconName as any} size={24} color="#1E40AF" />;
    } else if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={iconName as any} size={24} color="#1E40AF" />;
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity 
          className="flex-1" 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View className="bg-white w-80 h-full absolute right-0 shadow-lg">
          {/* Header do Drawer */}
          <View className="bg-blue-700 p-6 pt-16">
            <TouchableOpacity 
              className="absolute top-12 right-4"
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-row items-center">
              <View className="bg-white/20 rounded-full p-3 mr-4">
                <Ionicons name="person" size={32} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-bold">
                  Usuário
                </Text>
                <Text className="text-white/80 text-sm">
                  usuario@email.com
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="flex-1 p-4">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-4 px-2 border-b border-gray-100"
                onPress={item.onPress}
              >
                <View className="mr-4">
                  {renderIcon(item.icon, item.iconType)}
                </View>
                <Text className="text-gray-800 text-base font-medium">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View className="p-4 border-t border-gray-200">
            <Text className="text-gray-500 text-xs text-center">
              MotoConnect v1.0.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
