// src/index.js
// Punto de entrada principal del servidor

require('dotenv').config();
const express = require('express');
const webhookRouter = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───────────────────────────────────────────────
// Parsear body de Twilio (form-urlencoded) y JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Log de cada request entrante
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ─── Rutas ─────────────────────────────────────────────────────
app.use('/webhook', webhookRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    restaurant: process.env.RESTAURANT_NAME || 'La Mansion',
    version: '1.0.0',
    phase: 'Fase 1 — Claude API',
  });
});

// ─── Validación de variables de entorno ───────────────────────
const validateEnv = () => {
  const required = ['ANTHROPIC_API_KEY=sk-ant-api03-AWqTDnBXjLVogK7vSRB0tPFU5bHpRhvoIsVvTSGt_5qCDNm5WvVidWDON-j27a2sa3wuU_z aMWwmMAzYFplVOQ-Y2OJrgAA', 'RESTAURANT_NAME=La Mansion', 'RESTAURANT_HOURS=Lunes a domingo, 1pm a 11pm'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ Variables de entorno faltantes:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nCopia .env.example como .env y llena los valores.\n');
    process.exit(1);
  }
};

// ─── Iniciar servidor ──────────────────────────────────────────
validateEnv();

app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════');
  console.log(`🍽️  Agente de Reservas — ${process.env.RESTAURANT_NAME}`);
  console.log(`🚀  Servidor corriendo en puerto ${PORT}`);
  console.log(`📡  Webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`⏰  Horario: ${process.env.RESTAURANT_HOURS}`);
  console.log('═══════════════════════════════════════════\n');
});

module.exports = app;
