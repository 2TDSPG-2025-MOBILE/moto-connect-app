import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Menu } from '../../components/Menu';
import { DrawerMenu } from '../../components/DrawerMenu';
import { getVehicles } from '../../services/api';

interface Vehicle {
    id: string;
    placa: string;
    modelo?: string;
    marca?: string;
    ano?: number;
    status?: string;
}

interface FilterOptions {
    status: string;
    marca: string;
    ano: string;
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
        status: '',
        marca: '',
        ano: ''
    });

    // Mock data para demonstração
    const mockVehicles: Vehicle[] = Array.from({ length: 45 }, (_, i) => ({
        id: `${i + 1}`,
        placa: `ABC${1234 + i}`,
        modelo: ['CB 600F', 'XJ6', 'MT-07', 'CB 1000R', 'Ninja 650'][i % 5],
        marca: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW'][i % 5],
        ano: 2018 + (i % 6),
        status: ['Disponível', 'Em uso', 'Manutenção'][i % 3]
    }));

    useEffect(() => {
        loadVehicles();
    }, [currentPage]);

    useEffect(() => {
        applyFilters();
    }, [search, filters, vehicles]);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            // Tentativa de carregar da API real
            const response = await getVehicles({ 
                page: currentPage, 
                pageSize: itemsPerPage 
            });
            
            if (response.data && Array.isArray(response.data)) {
                setVehicles(response.data);
                
                // Extrair informações de paginação do header X-Pagination
                const paginationHeader = response.headers['x-pagination'];
                if (paginationHeader) {
                    const paginationInfo = JSON.parse(paginationHeader);
                    setTotalPages(paginationInfo.TotalPages || 1);
                } else {
                    setTotalPages(Math.ceil(response.data.length / itemsPerPage));
                }
            } else {
                throw new Error('Formato de resposta inválido');
            }
        } catch (error) {
            console.log('Erro ao carregar veículos da API, usando dados mock:', error);
            
            // Fallback para dados mock
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = mockVehicles.slice(startIndex, endIndex);
            
            setVehicles(paginatedData);
            setTotalPages(Math.ceil(mockVehicles.length / itemsPerPage));
            
            // Mostrar alerta apenas na primeira tentativa
            if (currentPage === 1) {
                Alert.alert(
                    'Aviso', 
                    'Não foi possível conectar com a API. Usando dados de demonstração.',
                    [{ text: 'OK' }]
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = vehicles;

        // Filtro por busca (placa)
        if (search) {
            filtered = filtered.filter(vehicle => 
                vehicle.placa.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filtro por status
        if (filters.status) {
            filtered = filtered.filter(vehicle => vehicle.status === filters.status);
        }

        // Filtro por marca
        if (filters.marca) {
            filtered = filtered.filter(vehicle => vehicle.marca === filters.marca);
        }

        // Filtro por ano
        if (filters.ano) {
            filtered = filtered.filter(vehicle => vehicle.ano?.toString() === filters.ano);
        }

        setFilteredVehicles(filtered);
    };

    const clearFilters = () => {
        setFilters({ status: '', marca: '', ano: '' });
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
                    key={i}
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
                keyExtractor={(item) => item.id}
                className="flex-1 px-4"
                refreshing={loading}
                onRefresh={loadVehicles}
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between py-4 border-b border-gray-200 bg-white">
                        <View className="flex-row items-center flex-1">
                            <FontAwesome name="motorcycle" size={24} color="#1E40AF" />
                            <View className="ml-3 flex-1">
                                <Text className="text-base font-semibold text-gray-800">
                                    {item.placa}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {item.marca} {item.modelo} - {item.ano}
                                </Text>
                                <View className={`self-start px-2 py-1 rounded-full mt-1 ${
                                    item.status === 'Disponível' ? 'bg-green-100' :
                                    item.status === 'Em uso' ? 'bg-yellow-100' : 'bg-red-100'
                                }`}>
                                    <Text className={`text-xs font-medium ${
                                        item.status === 'Disponível' ? 'text-green-800' :
                                        item.status === 'Em uso' ? 'text-yellow-800' : 'text-red-800'
                                    }`}>
                                        {item.status}
                                    </Text>
                                </View>
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
            <View className="flex-row justify-center items-center py-4 bg-gray-50">
                <View className="flex-row items-center">
                    {renderPaginationButtons()}
                </View>
            </View>

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

                        {/* Filtro por Status */}
                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 mb-2">Status</Text>
                            <View className="flex-row flex-wrap">
                                {['', 'Disponível', 'Em uso', 'Manutenção'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                                            filters.status === status ? 'bg-blue-700' : 'bg-gray-200'
                                        }`}
                                        onPress={() => setFilters(prev => ({ ...prev, status }))}
                                    >
                                        <Text className={`${
                                            filters.status === status ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {status || 'Todos'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Filtro por Marca */}
                        <View className="mb-4">
                            <Text className="text-base font-semibold text-gray-700 mb-2">Marca</Text>
                            <View className="flex-row flex-wrap">
                                {['', 'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW'].map((marca) => (
                                    <TouchableOpacity
                                        key={marca}
                                        className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                                            filters.marca === marca ? 'bg-blue-700' : 'bg-gray-200'
                                        }`}
                                        onPress={() => setFilters(prev => ({ ...prev, marca }))}
                                    >
                                        <Text className={`${
                                            filters.marca === marca ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {marca || 'Todas'}
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
                            {selectedVehicle?.placa}
                        </Text>
                        
                        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
                            <MaterialIcons name="visibility" size={24} color="#1E40AF" />
                            <Text className="ml-3 text-base text-gray-700">Ver Detalhes</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
                            <MaterialIcons name="edit" size={24} color="#1E40AF" />
                            <Text className="ml-3 text-base text-gray-700">Editar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
                            <MaterialIcons name="history" size={24} color="#1E40AF" />
                            <Text className="ml-3 text-base text-gray-700">Histórico</Text>
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
