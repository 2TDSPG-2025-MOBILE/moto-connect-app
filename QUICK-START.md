# Quick Start - Teste Rápido para Vídeo

## 🚀 Iniciar Backend (.NET)

```bash
cd backend/challenge-moto-connect/src/Api
dotnet run
```

Backend estará em: `http://localhost:5000`

## 📱 Iniciar Frontend (React Native)

**1. Configure a URL da API:**

Crie arquivo `.env` na raiz do projeto:
```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:5000/api
```

**Descubra seu IP:**
- Linux/Mac: `ip addr | grep "inet "` ou `ifconfig`
- Windows: `ipconfig`

Exemplo: `EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api`

**2. Inicie o app:**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm start
```

**3. Abra no celular:**
- Instale o app **Expo Go**
- Escaneie o QR Code
- Celular e computador devem estar na mesma rede Wi-Fi

## ✅ Testar Cadastros

### Cadastro de Usuário
1. Abra o app → **Cadastre-se**
2. Preencha:
   - Email: `teste@exemplo.com`
   - Nome: `Teste Usuario`
   - Registro: `1234`
   - Senha: `Senha123!` (com maiúscula, número e especial)
   - Confirmar Senha: `Senha123!`
3. Clique **Cadastrar**
4. ✅ Deve aparecer "Cadastro realizado com sucesso"

### Cadastro de Moto
1. Faça login (use qualquer email/senha)
2. Menu → **Cadastro de motos**
3. Preencha:
   - Placa: `ABC-1234` ou `ABC1D23`
   - Data: `30/09/2025`
   - Modelo: `E`, `SPORT` ou `POP`
4. Clique **Cadastrar**
5. ✅ Deve aparecer "Moto cadastrada com sucesso"

## 🔍 Verificar no Backend

Acesse: `http://localhost:5000/swagger`

### Endpoints disponíveis:
- `GET /api/User` - Listar usuários
- `GET /api/Vehicles` - Listar motos
- `POST /api/User` - Criar usuário
- `POST /api/Vehicles` - Criar moto

## ⚠️ Troubleshooting Rápido

**Erro de conexão:**
```bash
EXPO_PUBLIC_API_URL=http://SEU_IP_CORRETO:5000/api
```
- Verifique o IP
- Desative firewall temporariamente
- Use `http://` não `https://`

**Backend não inicia:**
```bash
cd backend/challenge-moto-connect/src/Api
dotnet restore
dotnet build
dotnet run
```

**Frontend não conecta:**
- Verifique logs no console do Expo
- Procure por "API Request" e "API Response"
- Se aparecer timeout, IP está errado

## 📹 Para o Vídeo

1. **Mostre o Swagger** (http://localhost:5000/swagger)
2. **Cadastre um usuário** no app
3. **Verifique no Swagger** → GET /api/User
4. **Cadastre uma moto** no app
5. **Verifique no Swagger** → GET /api/Vehicles

**Tudo funcionando = integração backend-frontend OK! ✅**

## 🧪 Testes Unitários (bônus)

```bash
cd backend/challenge-moto-connect/tests/Tests
dotnet test --verbosity detailed
```

Deve passar todos os testes (UserService, VehicleService, Email, Password)

