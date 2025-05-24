# 🛵 MotoConnect • App Mobile

Aplicativo **React Native + Expo + TypeScript** criado para o **Challenge 2025 – FIAP**.  
O MotoConnect ajuda mecânicos e gestores da Mottu a rastrear, registrar e visualizar manutenções de motocicletas de forma simples e rápida.

---

## ✨ Funcionalidades

- **Login corporativo** (e-mail @mottu.com.br)  
- **Leitura RFID** (mock) para identificar a moto  
- **Relatório de manutenção**  
  - Descrição do serviço  
  - Peças substituídas  
  - Observações adicionais  
- **Lista & Detalhe de motos** filtráveis por status  
- **Armazenamento local** com AsyncStorage  
- **Navegação** com React Navigation (mínimo 5 rotas)  

---

## 🚀 Como executar

```bash
# clone
git clone https://github.com/mateush-souza/challenge-mottu-mobile.git
cd challenge-mottu-mobile

# instale dependências
npm install     # ou yarn

# inicie o projeto
npx expo start  # abre o DevTools
```

Use o Expo Go para escanear o QR Code no seu celular ou rode emulador Android/iOS.

---

## 📂 Estrutura de pastas

```
src/
├─ assets/          # imagens e ícones
├─ components/      # componentes reutilizáveis
├─ screens/         # telas (Home, Login, Report, etc.)
├─ contexts/        # contextos globais (Auth, Moto)
├─ services/        # configs de API (axios)
├─ types/           # tipagens compartilhadas
├─ utils/           # helpers
└─ App.tsx          # ponto de entrada
```

---

## 🛠️ Tecnologias & libs

| Tech | Uso no projeto |
|------|----------------|
| React Native | base do app |
| Expo | build & dev server |
| TypeScript | tipagem estática |
| React Navigation | navegação entre telas |
| AsyncStorage | persistência local |
| Axios | chamadas REST ao backend .NET |
| NativeWind | utility classes estilo Tailwind |

---

## 📅 Roadmap

- [x] Estrutura inicial com TypeScript
- [x] Login + autenticação mock
- [x] AsyncStorage de relatórios
- [ ] Formulário de manutenção
- [ ] Integração real com API .NET
- [ ] Tela de mapa do pátio (fase 2)
- [ ] Upload de fotos no relatório
- [ ] Sincronização offline/online

---

## 🤝 Contribuição

1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 👤 Autor

| Nome | RM |
|------|-----|
| Mateus H. Souza | RM558424 |
| Lucas Fialho | RM557884 |
| Cauan Passos | RM555466 |

---

## 📜 Licença

Projeto acadêmico sem fins comerciais – FIAP Challenge 2025.
