// src/agent/actions.js
// Maneja las acciones confirmadas: crear o modificar reservas
// En Fase 1 solo loguea. En Fase 2 conectará con Google Sheets.

const handleAction = async (action, data) => {
  console.log(`\n📋 ACCIÓN DETECTADA: ${action}`);
  console.log('📦 Datos:', JSON.stringify(data, null, 2));

  switch (action) {
    case 'CREAR_RESERVA':
      return await crearReserva(data);

    case 'MODIFICAR_RESERVA':
      return await modificarReserva(data);

    default:
      console.warn(`⚠️ Acción desconocida: ${action}`);
      return null;
  }
};

/**
 * FASE 1: Loguea la reserva en consola
 * FASE 2: Guardará en Google Sheets + Google Calendar
 */
const crearReserva = async (data) => {
  console.log('\n✅ NUEVA RESERVA CONFIRMADA:');
  console.log(`   Nombre    : ${data.nombre} ${data.apellido}`);
  console.log(`   Personas  : ${data.personas}`);
  console.log(`   Fecha     : ${data.fecha}`);
  console.log(`   Hora      : ${data.hora}`);
  console.log(`   Celebración: ${data.celebracion || 'Ninguna'}`);
  console.log(`   Teléfono  : ${data.telefono}`);
  console.log(`   Timestamp : ${new Date().toISOString()}\n`);

  // TODO Fase 2: await sheetsService.agregarReserva(data);
  // TODO Fase 3: await calendarService.crearEvento(data);

  return { success: true, id: generateId() };
};

/**
 * FASE 1: Loguea la modificación en consola
 * FASE 2: Actualizará la fila en Google Sheets + Google Calendar
 */
const modificarReserva = async (data) => {
  console.log('\n✏️ MODIFICACIÓN DE RESERVA:');
  console.log(`   Nombre    : ${data.nombre} ${data.apellido}`);
  console.log(`   Campo     : ${data.campo_modificado}`);
  console.log(`   Nuevo valor: ${data.valor_nuevo}`);
  console.log(`   Timestamp : ${new Date().toISOString()}\n`);

  // TODO Fase 2: await sheetsService.modificarReserva(data);
  // TODO Fase 3: await calendarService.actualizarEvento(data);

  return { success: true };
};

/**
 * Genera un ID simple para la reserva
 */
const generateId = () => {
  return `RES-${Date.now().toString(36).toUpperCase()}`;
};

module.exports = { handleAction };
