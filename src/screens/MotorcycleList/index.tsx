import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { Menu } from '../../components/Menu';

export default function MotorcycleList() {
    const [search, setSearch] = useState('');

    const motos = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        placa: `AW${35678 + i}`
    }));

    return (
        <View className="flex-1 bg-white">
            <View className="bg-blue-700 p-4 rounded-b-2xl">
                <View className="flex-row mt-14 justify-between items-center">
                    <Text className="text-white text-lg font-bold">Listagem de Motos</Text>
                    <TouchableOpacity className="absolute right-4 bg-white/20 rounded-full p-2">
                        <Ionicons name="person-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="text-white mt-2">Encontre a moto desejada abaixo:</Text>
            </View>

            <View className="flex-row justify-between items-center px-4 py-2">
                <TouchableOpacity className="bg-blue-700 px-4 py-2 rounded-md">
                    <Text className="text-white font-medium">Filtrar</Text>
                </TouchableOpacity>
                <TextInput
                    placeholder="Buscar pela placa..."
                    className="bg-gray-100 px-4 py-2 rounded-md flex-1 ml-2"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={motos.filter((m) => m.placa.includes(search.toUpperCase()))}
                keyExtractor={(item) => item.id.toString()}
                className="px-4"
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
                        <View className="flex-row items-center space-x-3">
                            <FontAwesome name="motorcycle" size={24} color="#00509D" />
                            <Text className="text-base">{item.placa}</Text>
                        </View>
                        <TouchableOpacity>
                            <Entypo name="dots-three-horizontal" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View className="flex-row justify-center items-center space-x-2 mt-2 mb-4">
                {[1, 2, 3, 4].map((page) => (
                    <TouchableOpacity key={page} className="bg-blue-700 px-3 py-1 rounded-full">
                        <Text className="text-white font-medium">{page}</Text>
                    </TouchableOpacity>
                ))}
                <Text className="text-lg text-gray-600">...</Text>
            </View>

            <Menu />
        </View>
    );
}
