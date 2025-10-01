import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Menu } from '../../components/Menu';
import { DrawerMenu } from '../../components/DrawerMenu';
import { getVehicles } from '../../services/api';

interface Vehicle {
    vehicleId: string;
    licensePlate: string;
    vehicleModel: string;
}

interface FilterOptions {
    modelo: string;
}

export default function MotorcycleList() {
    const [search, setSearch] = useState('');
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    
    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Filtros
    const [filters, setFilters] = useState<FilterOptions>({
        modelo: ''
    });

    useEffect(() => {
        loadVehicles();
    }, [currentPage]);

    useEffect(() => {
        applyFilters();
    }, [search, filters, vehicles]);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const response = await getVehicles({ 
                page: currentPage, 
                pageSize: itemsPerPage 
            });
            
            if (response.data && Array.isArray(response.data)) {
                setVehicles(response.data);
                
                // Extrair informações de paginação
                const paginationHeader = response.headers['x-pagination'];
                if (paginationHeader) {
                    const paginationInfo = JSON.parse(paginationHeader);
                    setTotalPages(paginationInfo.TotalPages || 1);
                } else {
                    setTotalPages(Math.ceil(response.data.length / itemsPerPage));
                }
            }
        } catch (error) {
            console.log('Erro ao carregar veículos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os veículos.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = vehicles;

        // Filtro por busca (placa)
        if (search) {
            filtered = filtered.filter(vehicle => 
                vehicle.licensePlate.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filtro por modelo
        if (filters.modelo) {
            filtered = filtered.filter(vehicle => vehicle.vehicleModel === filters.modelo);
        }

        setFilteredVehicles(filtered);
    };

    const clearFilters = () => {
        setFilters({ modelo: '' });
        setSearch('');
        setFilterModalVisible(false);
    };

    const handleVehicleAction = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setActionModalVisible(true);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatLicensePlate = (plate: string) => {
        if (plate.length === 7) {
            return `${plate.slice(0, 3)}-${plate.slice(3)}`;
        }
        return plate;
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Botão anterior
        if (currentPage > 1) {
            buttons.push(
                <TouchableOpacity 
                    key="prev"
                    className="bg-gray-300 px-3 py-2 rounded-md mx-1"
                    onPress={() => handlePageChange(currentPage - 1)}
                >
                    <MaterialIcons name="chevron-left" size={20} color="#333" />
                </TouchableOpacity>
            );
        }

        // Páginas numeradas
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <TouchableOpacity 
                    key={`page-${i}`}
                    className={`px-3 py-2 rounded-md mx-1 ${
                        i === currentPage ? 'bg-blue-700' : 'bg-gray-300'
                    }`}
                    onPress={() => handlePageChange(i)}
                >
                    <Text className={`font-medium ${
                        i === currentPage ? 'text-white' : 'text-gray-700'
                    }`}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        // Botão próximo
        if (currentPage < totalPages) {
            buttons.push(
                <TouchableOpacity 
                    key="next"
                    className="bg-gray-300 px-3 py-2 rounded-md mx-1"
                    onPress={() => handlePageChange(currentPage + 1)}
                >
                    <MaterialIcons name="chevron-right" size={20} color="#333" />
                </TouchableOpacity>
            );
        }

        return buttons;
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-blue-700 p-4 rounded-b-2xl">
                <View className="flex-row mt-14 justify-between items-center">
                    <Text className="text-white text-lg font-bold">Listagem de Motos</Text>
                    <TouchableOpacity 
                        className="bg-white/20 rounded-full p-2"
                        onPress={() => setDrawerVisible(true)}
                    >
                        <Ionicons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="text-white mt-2">Encontre a moto desejada abaixo:</Text>
            </View>

            {/* Filtros e Busca */}
            <View className="flex-row justify-between items-center px-4 py-3 bg-gray-50">
                <TouchableOpacity 
                    className="bg-blue-700 px-4 py-2 rounded-md flex-row items-center"
                    onPress={() => setFilterModalVisible(true)}
                >
                    <MaterialIcons name="filter-list" size={18} color="white" />
                    <Text className="text-white font-medium ml-1">Filtrar</Text>
                </TouchableOpacity>
                
                <View className="flex-1 ml-3">
                    <TextInput
                        placeholder="Buscar pela placa..."
                        className="bg-white px-4 py-2 rounded-md border border-gray-200"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* Lista de Veículos */}
            <FlatList
                data={filteredVehicles}
                keyExtractor={(item) => item.vehicleId}
                className="flex-1 px-4"
                refreshing={loading}
                onRefresh={loadVehicles}
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between py-4 border-b border-gray-200 bg-white">
                        <View className="flex-row items-center flex-1">
                            <FontAwesome name="motorcycle" size={24} color="#1E40AF" />
                            <View className="ml-3 flex-1">
                                <Text className="text-base font-semibold text-gray-800">
                                    {formatLicensePlate(item.licensePlate)}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    Modelo: {item.vehicleModel}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            className="p-2"
                            onPress={() => handleVehicleAction(item)}
                        >
                            <Entypo name="dots-three-horizontal" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center py-20">
                        <FontAwesome name="motorcycle" size={48} color="#D1D5DB" />
                        <Text className="text-gray-500 mt-4 text-center">
                            Nenhuma moto encontrada
                        </Text>
                    </View>
                }
            />

            {/* Paginação */}
            {totalPages > 1 && (
                <View className="flex-row justify-center items-center py-4 bg-gray-50">
                    <View className="flex-row items-center">
                        {renderPaginationButtons()}
                    </View>
                </View>
            )}

            <Menu />

            {/* Drawer Menu */}
            <DrawerMenu 
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
            />

            {/* Modal de Filtros */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Filtros</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Filtro por Modelo */}
                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 mb-2">Modelo</Text>
                            <View className="flex-row flex-wrap">
                                {[
                                    { label: 'Todos', value: '' },
                                    { label: 'E', value: 'E' },
                                    { label: 'SPORT', value: 'SPORT' },
                                    { label: 'POP', value: 'POP' }
                                ].map((modelo) => (
                                    <TouchableOpacity
                                        key={modelo.value || 'all'}
                                        className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                                            filters.modelo === modelo.value ? 'bg-blue-700' : 'bg-gray-200'
                                        }`}
                                        onPress={() => setFilters({ modelo: modelo.value })}
                                    >
                                        <Text className={`${
                                            filters.modelo === modelo.value ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {modelo.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Botões de Ação */}
                        <View className="flex-row justify-between mt-6">
                            <TouchableOpacity
                                className="bg-gray-300 px-6 py-3 rounded-lg flex-1 mr-2"
                                onPress={clearFilters}
                            >
                                <Text className="text-gray-700 text-center font-semibold">
                                    Limpar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-blue-700 px-6 py-3 rounded-lg flex-1 ml-2"
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text className="text-white text-center font-semibold">
                                    Aplicar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Ações do Veículo */}
            <Modal
                visible={actionModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setActionModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white rounded-2xl p-6 w-80">
                        <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
                            {selectedVehicle ? formatLicensePlate(selectedVehicle.licensePlate) : ''}
                        </Text>
                        
                        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
                            <MaterialIcons name="visibility" size={24} color="#1E40AF" />
                            <Text className="ml-3 text-base text-gray-700">Ver Detalhes</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
                            <MaterialIcons name="edit" size={24} color="#1E40AF" />
                            <Text className="ml-3 text-base text-gray-700">Editar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center py-3">
                            <MaterialIcons name="delete" size={24} color="#EF4444" />
                            <Text className="ml-3 text-base text-red-500">Excluir</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            className="bg-gray-300 px-6 py-3 rounded-lg mt-4"
                            onPress={() => setActionModalVisible(false)}
                        >
                            <Text className="text-gray-700 text-center font-semibold">
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}