#!/bin/bash

echo "🚀 Iniciando Backend Moto Connect..."
echo ""

cd backend/challenge-moto-connect/src/Api

echo "📦 Restaurando pacotes..."
dotnet restore

echo ""
echo "🔨 Compilando..."
dotnet build

echo ""
echo "✅ Iniciando API..."
echo "📍 Swagger: http://localhost:5000/swagger"
echo "📍 API: http://localhost:5000/api"
echo ""

dotnet run

