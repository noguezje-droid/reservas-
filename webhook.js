// src/routes/webhook.js
// Recibe los mensajes de WhatsApp desde Twilio y los procesa

const express = require('express');
const router = express.Router();
const { processMessage } = require('../agent/claude');
const { handleAction } = require('../agent/actions');

/**
 * POST /webhook/whatsapp
 * Twilio llama este endpoint cada vez que llega un mensaje de WhatsApp
 */
router.post('/whatsapp', async (req, res) => {
  // Twilio envía los datos como form-urlencoded
  const { From, Body } = req.body;

  if (!From || !Body) {
    console.warn('⚠️ Webhook recibido sin From o Body');
    return res.status(400).send('Bad Request');
  }

  // Extraer número limpio (Twilio manda "whatsapp:+521234567890")
  const phoneNumber = From.replace('whatsapp:', '');
  const message = Body.trim();

  console.log(`\n📱 Mensaje de ${phoneNumber}: "${message}"`);

  try {
    // Procesar mensaje con el agente IA
    const { reply, action, data } = await processMessage(phoneNumber, message);

    // Si hay una acción confirmada, ejecutarla
    if (action && data) {
      await handleAction(action, data);
    }

    // Responder a Twilio en formato TwiML (XML que Twilio entiende)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>
    <Body>${escapeXml(reply)}</Body>
  </Message>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);

    console.log(`🤖 Respuesta enviada a ${phoneNumber}: "${reply.substring(0, 80)}..."`);

  } catch (error) {
    console.error('❌ Error procesando mensaje:', error.message);

    // Responder con mensaje de error amigable
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>
    <Body>Disculpa, tuve un problema técnico. Por favor intenta de nuevo en un momento. 🙏</Body>
  </Message>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(errorResponse);
  }
});

/**
 * GET /webhook/whatsapp
 * Endpoint de verificación (útil para confirmar que el servidor está activo)
 */
router.get('/whatsapp', (req, res) => {
  res.json({ status: 'ok', message: 'Agente de reservas activo 🍽️' });
});

/**
 * Escapa caracteres especiales XML para evitar errores en TwiML
 */
const escapeXml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

module.exports = router;
