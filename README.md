# 🍽️ Agente de Reservas para Restaurantes

Chatbot inteligente para gestión de reservas vía WhatsApp, powered by Claude AI.

---

## Fases del proyecto

| Fase | Estado | Descripción |
|------|--------|-------------|
| Fase 1 | ✅ Lista | Servidor Node.js + Claude API |
| Fase 2 | 🔜 Próxima | Integración Google Sheets |
| Fase 3 | 🔜 Próxima | Integración Google Calendar |
| Fase 4 | 🔜 Próxima | Conexión Twilio + WhatsApp |
| Fase 5 | 🔜 Próxima | Recordatorios automáticos |

---

## Instalación y configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y llena los valores:

```
ANTHROPIC_API_KEY=sk-ant-api03-TU_KEY_AQUI
RESTAURANT_NAME=La Buena Mesa
RESTAURANT_HOURS=Lunes a domingo, 1pm a 11pm
```

### 3. Iniciar el servidor

```bash
# Producción
npm start

# Desarrollo (con auto-reload)
npm run dev
```

El servidor iniciará en `http://localhost:3000`

---

## Estructura del proyecto

```
agente-reservas/
├── src/
│   ├── index.js              # Servidor Express principal
│   ├── agent/
│   │   ├── claude.js         # Lógica de llamadas a Claude API
│   │   ├── prompt.js         # Sistema de instrucciones del agente
│   │   ├── session.js        # Manejo de historial por usuario
│   │   └── actions.js        # Procesamiento de reservas confirmadas
│   └── routes/
│       └── webhook.js        # Endpoint para mensajes de WhatsApp
├── .env.example              # Plantilla de variables de entorno
├── .gitignore
└── package.json
```

---

## Cómo funciona la Fase 1

1. El servidor recibe un mensaje en `POST /webhook/whatsapp`
2. Extrae el número de teléfono y el texto del mensaje
3. Llama a Claude API con el historial de conversación del cliente
4. Claude responde de forma natural y, cuando la reserva está completa, incluye los datos estructurados
5. El servidor detecta la acción (`CREAR_RESERVA` o `MODIFICAR_RESERVA`) y loguea los datos
6. Responde al cliente en formato TwiML para Twilio

> **En Fase 2** el paso 5 guardará los datos en Google Sheets en lugar de solo loguearlos.

---

## Despliegue en Railway (recomendado)

1. Crea cuenta en [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Agrega las variables de entorno en el dashboard de Railway
4. Railway desplegará automáticamente y te dará una URL pública
5. Usa esa URL como webhook en Twilio: `https://tu-app.railway.app/webhook/whatsapp`

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Fase 1 | API key de Anthropic |
| `RESTAURANT_NAME` | ✅ Fase 1 | Nombre del restaurante |
| `RESTAURANT_HOURS` | ✅ Fase 1 | Horario de atención |
| `TWILIO_ACCOUNT_SID` | Fase 4 | SID de cuenta Twilio |
| `TWILIO_AUTH_TOKEN` | Fase 4 | Token de Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Fase 4 | Número WhatsApp de Twilio |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Fase 2/3 | Email de service account Google |
| `GOOGLE_PRIVATE_KEY` | Fase 2/3 | Llave privada de Google |
| `GOOGLE_SHEETS_ID` | Fase 2 | ID de la hoja de cálculo |
| `GOOGLE_CALENDAR_ID` | Fase 3 | ID del calendario |
