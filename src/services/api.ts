
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  validateStatus: (status) => status < 500,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('API Error Request:', error.message);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Interfaces para tipagem
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface Vehicle {
  vehicleId?: string;
  licensePlate: string;
  vehicleModel: string;
}

export interface User {
  userID?: string;
  email: string;
  password: string;
  type: number;
}

export interface MaintenanceHistory {
  id: string;
  vehicleId: string;
  description: string;
  date: string;
  cost?: number;
}

// Endpoints de Veículos com paginação
export const getVehicles = (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  return api.get(`/Vehicles?${queryParams.toString()}`);
};

export const createVehicle = (vehicleData: Partial<Vehicle>) => api.post('/Vehicles', vehicleData);
export const getVehicleById = (id: string) => api.get(`/Vehicles/${id}`);
export const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => api.put(`/Vehicles/${id}`, vehicleData);
export const deleteVehicle = (id: string) => api.delete(`/Vehicles/${id}`);

// Endpoints de Usuários com paginação
export const getUsers = (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  return api.get(`/User?${queryParams.toString()}`);
};

export const createUser = (userData: Partial<User>) => api.post('/User', userData);
export const getUserById = (id: string) => api.get(`/User/${id}`);
export const updateUser = (id: string, userData: Partial<User>) => api.put(`/User/${id}`, userData);
export const deleteUser = (id: string) => api.delete(`/User/${id}`);

// Endpoints de Históricos de Manutenção com paginação
export const getMaintenanceHistories = (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  return api.get(`/Histories?${queryParams.toString()}`);
};

export const createMaintenanceHistory = (historyData: Partial<MaintenanceHistory>) => api.post('/Histories', historyData);
export const getMaintenanceHistoryById = (id: string) => api.get(`/Histories/${id}`);
export const updateMaintenanceHistory = (id: string, historyData: Partial<MaintenanceHistory>) => api.put(`/Histories/${id}`, historyData);
export const deleteMaintenanceHistory = (id: string) => api.delete(`/Histories/${id}`);

// Função para autenticação (mock)
export const authenticateUser = async (email: string, password: string) => {
  try {
    // Simulação de autenticação - substituir pela lógica real da API
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    // Fallback para autenticação mock
    if (email && password.length >= 6) {
      return {
        success: true,
        user: {
          id: '1',
          email: email,
          name: 'Usuário Teste'
        },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Credenciais inválidas');
  }
};

export const registerUser = async (userData: { email: string; password: string; type?: number }) => {
  try {
    const userPayload: Partial<User> = {
      email: userData.email,
      password: userData.password,
      type: userData.type || 0
    };
    
    const response = await createUser(userPayload);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        user: response.data
      };
    } else {
      throw new Error(response.data?.error || 'Erro ao registrar usuário');
    }
  } catch (error: any) {
    console.error('Erro no registro:', error);
    throw new Error(error.response?.data?.error || error.message || 'Erro ao registrar usuário');
  }
};

export default api;

