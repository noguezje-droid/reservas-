// src/agent/claude.js
// Lógica central del agente: envía mensajes a Claude y procesa respuestas

const Anthropic = require('@anthropic-ai/sdk');
const { getSystemPrompt } = require('./prompt');
const { addToHistory, getOrCreateSession } = require('./session');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Procesa un mensaje del cliente y retorna la respuesta del agente
 * @param {string} phoneNumber - Número de teléfono del cliente
 * @param {string} incomingMessage - Mensaje recibido del cliente
 * @returns {object} { reply: string, action: string|null, data: object|null }
 */
const processMessage = async (phoneNumber, incomingMessage) => {
  const restaurantName = process.env.RESTAURANT_NAME || 'El Restaurante';
  const restaurantHours = process.env.RESTAURANT_HOURS || 'Lunes a domingo, 1pm a 11pm';

  // Agregar mensaje del cliente al historial
  addToHistory(phoneNumber, 'user', incomingMessage);

  const session = getOrCreateSession(phoneNumber);

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: getSystemPrompt(restaurantName, restaurantHours),
      messages: session.history,
    });

    const fullResponse = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('');

    // Extraer acción y datos si los hay
    const action = extractAction(fullResponse);
    const data = extractData(fullResponse);

    // Limpiar la respuesta visible (sin los bloques ACCION/DATOS)
    const cleanReply = fullResponse
      .replace(/ACCION:[A-Z_]+/g, '')
      .replace(/DATOS:\{.*?\}/gs, '')
      .trim();

    // Agregar respuesta del agente al historial
    addToHistory(phoneNumber, 'assistant', fullResponse);

    return {
      reply: cleanReply,
      action,
      data: data ? { ...data, telefono: phoneNumber } : null,
    };
  } catch (error) {
    console.error('Error llamando a Claude API:', error.message);
    throw new Error('No pude procesar tu mensaje. Por favor intenta de nuevo.');
  }
};

/**
 * Extrae la acción del response de Claude
 */
const extractAction = (text) => {
  const match = text.match(/ACCION:([A-Z_]+)/);
  return match ? match[1] : null;
};

/**
 * Extrae los datos JSON del response de Claude
 */
const extractData = (text) => {
  const match = text.match(/DATOS:(\{.*?\})/s);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (e) {
    console.error('Error parseando datos JSON:', e.message);
    return null;
  }
};

module.exports = { processMessage };
