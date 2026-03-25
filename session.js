// src/agent/session.js
// Maneja el historial de conversación por número de teléfono
// Cada cliente tiene su propia sesión independiente

const sessions = new Map();

// Tiempo máximo de inactividad antes de reiniciar la sesión (30 minutos)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const getSession = (phoneNumber) => {
  const session = sessions.get(phoneNumber);

  // Si existe sesión pero expiró, la eliminamos
  if (session && Date.now() - session.lastActivity > SESSION_TIMEOUT_MS) {
    sessions.delete(phoneNumber);
    return null;
  }

  return session || null;
};

const createSession = (phoneNumber) => {
  const session = {
    phoneNumber,
    history: [],
    lastActivity: Date.now(),
    pendingAction: null, // Para guardar acciones pendientes de confirmación
  };
  sessions.set(phoneNumber, session);
  return session;
};

const getOrCreateSession = (phoneNumber) => {
  return getSession(phoneNumber) || createSession(phoneNumber);
};

const updateSession = (phoneNumber, updates) => {
  const session = sessions.get(phoneNumber);
  if (session) {
    Object.assign(session, updates, { lastActivity: Date.now() });
  }
};

const addToHistory = (phoneNumber, role, content) => {
  const session = getOrCreateSession(phoneNumber);
  session.history.push({ role, content });
  session.lastActivity = Date.now();

  // Limitar historial a 50 mensajes para no sobrecargar el contexto
  if (session.history.length > 50) {
    session.history = session.history.slice(-50);
  }
};

const clearSession = (phoneNumber) => {
  sessions.delete(phoneNumber);
};

// Limpieza periódica de sesiones expiradas (cada 10 minutos)
setInterval(() => {
  const now = Date.now();
  for (const [phone, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT_MS) {
      sessions.delete(phone);
    }
  }
}, 10 * 60 * 1000);

module.exports = {
  getOrCreateSession,
  addToHistory,
  updateSession,
  clearSession,
};
