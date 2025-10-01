# Configuração do Ambiente - Moto Connect

## ⚡ Quick Start (Para Testar Rápido)

Veja o arquivo `QUICK-START.md` para iniciar rapidamente o backend e frontend!

## Backend (.NET)

### Requisitos
- .NET 8.0 SDK
- SQL Server ou PostgreSQL (opcional - usa InMemory por padrão)

### Configuração

1. **Restaurar pacotes**
```bash
cd backend/challenge-moto-connect/src/Api
dotnet restore
```

2. **Executar API**
```bash
dotnet run
```

A API estará disponível em: `http://localhost:5000`

**Swagger:** `http://localhost:5000/swagger`

### CORS

O CORS está configurado para aceitar requisições de qualquer origem em desenvolvimento. Para produção, ajuste a política no `Program.cs`:

```csharp
options.AddPolicy("Production", policy =>
{
    policy.WithOrigins("https://seudominio.com")
          .AllowAnyMethod()
          .AllowAnyHeader();
});
```

---

## Frontend (React Native / Expo)

### Requisitos
- Node.js 20.19.4+
- npm ou yarn
- Expo Go (mobile) ou Emulador Android/iOS

### Configuração

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar URL da API**

Crie um arquivo `.env` na raiz do projeto:
```bash
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:5000/api
```

**Importante**: Substitua `SEU_IP_LOCAL` pelo IP da sua máquina na rede local:
- Windows: `ipconfig` → Procure por "IPv4"
- Linux/Mac: `ifconfig` ou `ip addr` → Procure por "inet"

Exemplo: `EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api`

3. **Executar o app**
```bash
npm start
```

4. **Testar no dispositivo**
- Instale o app **Expo Go** no seu celular
- Escaneie o QR Code que aparece no terminal
- Certifique-se de que o celular está na mesma rede Wi-Fi que o computador

---

## Integração Backend + Frontend

### Checklist de Integração

- [ ] Backend rodando em `http://localhost:5000`
- [ ] CORS configurado no backend
- [ ] Frontend com variável `EXPO_PUBLIC_API_URL` configurada
- [ ] Computador e celular na mesma rede
- [ ] Firewall permitindo conexões na porta 5000

### Testar Conexão

No frontend, abra o console do Expo e verifique se aparecem logs:
```
API Request: POST /User
API Response: 201 /User
```

### Troubleshooting

**Erro de conexão**:
- Verifique se o IP está correto
- Desabilite firewall temporariamente
- Use `http://` (não `https://`) para desenvolvimento local

**Erro 400 ao cadastrar**:
- Verifique se os dados atendem às validações:
  - Email: formato válido
  - Senha: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial
  - Placa: formato AAA1234 ou AAA1A23

**Erro CORS**:
- Verifique se `app.UseCors("AllowAll")` está no `Program.cs`
- Reinicie o backend após mudanças

---

## Testes Unitários

### Executar Testes

```bash
cd backend/challenge-moto-connect/tests/Tests
dotnet test
```

### Ver Cobertura

```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

---

## Estrutura de Dados

### User
```json
{
  "email": "usuario@exemplo.com",
  "password": "SenhaForte123!",
  "type": 0
}
```

Types: `0` = Customer, `1` = Admin, `2` = Technician

### Vehicle
```json
{
  "licensePlate": "ABC1234",
  "vehicleModel": "Motorcycle"
}
```

Models: `Motorcycle`, `Scooter`, `ATV`, `Trike`

---

## Produção

### Backend

1. Publicar aplicação
```bash
dotnet publish -c Release -o ./publish
```

2. Configurar variáveis de ambiente no servidor
3. Ajustar CORS para domínio específico
4. Usar HTTPS com certificado válido

### Frontend

1. Configurar `EXPO_PUBLIC_API_URL` para URL de produção
2. Build do app
```bash
eas build --platform android
eas build --platform ios
```

3. Publicar nas lojas (Play Store / App Store)

