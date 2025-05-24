import { View, TouchableOpacity } from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes';

export function Menu() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View className="bg-blue-600 flex-row justify-around py-4 px-6">
            <TouchableOpacity
                className="items-center mb-5"
                onPress={() => navigation.navigate('MotorcycleRegistration')}
            >
                <MaterialCommunityIcons name="motorbike" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
                className="items-center"
                onPress={() => navigation.navigate('Home')}
            >
                <Ionicons name="home-outline" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
                className="items-center"
                onPress={() => navigation.navigate('MotorcycleList')}
            >
                <MaterialCommunityIcons name="speedometer" size={28} color="white" />
            </TouchableOpacity>
        </View>

    )
}