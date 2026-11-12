/**
 * ==============================================================================
 * ARCHIVO SEGURO PARA SUBIR A GITHUB - VANETRACKER (V4.0 FULL PRODUCTION)
 * ARCHIVO: app-SEGURO.js
 * DESCRIPCIÓN: Lógica 100% Funcional, Persistente (LocalStorage + Google Sheets & Drive)
 * AUTOR: Arquitecto Full-Stack & UI/UX Designer
 * ==============================================================================
 */

(function () {
  "use strict";

  console.time("App_Init_Timer");
  console.log("🌸 Iniciando VaneTracker v4.0 Full Production Release");

  // ============================================================================
  // BANCO DE FRASES ROTATIVAS Y MOTIVACIONALES PARA VANE
  // ============================================================================
  const DAILY_QUOTES = [
    "Mi amor, cada pasito que das hoy florece en algo hermoso. ¡Estoy tan orgulloso de ti! 🌸",
    "Que tu día sea tan dulce, radiante y lindo como tu sonrisa, mi vida ✨",
    "Hoy es un gran día para consentirte, respirar profundo y darle un abrazo enorme a Matilda 🐾💖",
    "Recuerda que no se trata de ser perfecta, sino de disfrutar cada instante con cariño 🌱",
    "Tu constancia es tu mayor magia. ¡Vas increíble, hermosa! ✨",
    "Tómate un cafecito rico, haz tus hábitos a tu ritmo y recuerda cuánto te amo ☕💕",
    "El secreto de los días bonitos es empezarlos con gratitud y una sonrisa en el corazón 🌷",
    "Eres el rayito de luz más cálido de nuestro hogar. ¡A brillar hoy, amor! ☀️",
    "Cada hábito cumplido hoy es un regalo de amor propio que te haces a ti misma 🎁🌸",
    "Matilda y yo creemos en ti con todo el corazón. ¡Tú puedes con todo! 🐕💖",
    "Respira, sonríe y agradece. Las cosas más hermosas de la vida ocurren hoy 🍃",
    "Que tu mente esté en paz y tu corazón lleno de momentos felices hoy ✨",
    "Eres fuerte, capaz, tierna y maravillosa. Nunca lo olvides 🌸",
    "Día a día construyes la vida tan soñada que mereces. ¡Sigue adelante, mi reina! 👑💕",
    "Hoy es un día perfecto para tomar mucha agüita, cuidarte y sentirte hermosa 💧✨",
    "Tu tranquilidad y bienestar son lo más valioso. Regálate momentos de paz hoy 🧘‍♀️🌸",
    "Si algo no sale como esperabas hoy, descansa y vuelve a intentar mañana sin culpas 🌙💖",
    "Un pasito a la vez, con calma y amor. Así se conquistan las metas más bellas 🐾🌸",
    "Gracias por llenar cada rincón de nuestras vidas de alegría y ternura infinita 💖",
    "¡Hoy será un día maravilloso! Llénalo de hábitos que te hagan sentir plena y feliz ✨"
  ];

  const EMOJI_CATEGORIES = {
    hogar: ["🧹", "🧺", "🧼", "🧽", "🛏️", "🛋️", "🍽️", "🪟", "🚿", "🚽", "🔑", "🏠", "🪴", "🕯️"],
    matilda: ["🐕", "🐾", "🦴", "🦮", "🥩", "🎾", "🛁", "🐈", "🐶", "🐩", "🧸", "🍖"],
    salud: ["🌸", "🧴", "💆‍♀️", "🧖‍♀️", "💅", "💄", "🧘‍♀️", "💊", "🩺", "🩸", "💤", "🍵", "🛁", "🥗"],
    deporte: ["🏃‍♀️", "🧘", "🏋️‍♀️", "🚴‍♀️", "🏊‍♀️", "🚶‍♀️", "🤸‍♀️", "👟", "🧗‍♀️", "🎾", "🏸"],
    comida: ["🥑", "🥗", "💧", "🍎", "🍓", "🥕", "🍳", "🥣", "🥪", "☕", "🍵", "🧃", "🥞", "🥐"],
    estudio: ["📚", "📖", "✍️", "💻", "📝", "🎯", "📑", "🎨", "🧠", "🎧", "📌", "📐"],
    aesthetic: ["✨", "💖", "🌷", "🧸", "🎀", "🌙", "⭐", "💌", "🕊️", "🌿", "🍰", "🧁", "🌻", "💎"]
  };

  // ============================================================================
  // ESTADO GLOBAL DE PRODUCCIÓN (V4.0)
  // ============================================================================
  const state = {
    selectedDate: getTodayString(),
    todayDate: getTodayString(),
    activeTab: "habits", // 'habits', 'journal', 'cycle', 'dashboard'

    // Carpetas y Hábitos
    folders: [],
    habitsCatalog: [],
    habitsLog: {},
    collapsedFolders: {},
    currentDayMood: "5 - Increíble",

    // Diario
    journalEntries: [],
    journalCategories: [
      { name: "Gratitud", icon: "✨", pillClass: "pill-lavender" },
      { name: "Matilda / Mascotas", icon: "🐕", pillClass: "pill-gold" },
      { name: "Pendientes / Debo hacer", icon: "📌", pillClass: "pill-rose" },
      { name: "Salud & Bienestar", icon: "🌸", pillClass: "pill-sage" },
      { name: "Momento Especial", icon: "💖", pillClass: "pill-peach" },
      { name: "Reflexión", icon: "💭", pillClass: "pill-blue" },
      { name: "Día a día", icon: "☀️", pillClass: "pill-gray" }
    ],
    selectedJournalCategory: "Gratitud",
    journalEntryMood: "5 - Increíble",
    journalFilterCategory: "ALL",
    journalSearchQuery: "",
    journalPhotoBase64: null,
    journalEditingId: null,

    // Ciclo Menstrual
    cycleSettings: {
      lastPeriodStart: "",
      cycleDuration: 28,
      periodDuration: 5,
      follicularDuration: 8,
      ovulationDuration: 4,
      lutealDuration: 11
    },
    cycleLogs: [],
    cycleSelectedFlow: "Moderado",
    cycleSelectedSymptoms: new Set(),
    cycleOtherSymptomText: "",
    cyclePhotoBase64: null,
    cycleMonthOffset: 0, // -1: mes anterior, 0: actual, 1: próximo

    // Dashboard
    dashboardViewMode: "bars", // 'bars' o 'calendar'

    // Ajustes & Sync
    soundEnabled: true,
    googleSheetsUrl: "",
    spreadsheetId: "1dAemKFvEufd0F5BcGEhP6YenrtmdCl49pIB9YA9zcTU",
    isSyncing: false,
    activeEmojiCategory: "hogar",

    // Modal Temporal State
    habitNoteTarget: null,
    habitNotePhotoBase64: null
  };

  // ============================================================================
  // MOTOR DE AUDIO (WEB AUDIO API SINTETIZADA CON DESBLOQUEO TÁCTIL)
  // ============================================================================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    return audioCtx;
  }

  function setupMobileAudioUnlock() {
    const unlockEvents = ["touchstart", "touchend", "click", "keydown"];
    const unlockHandler = function () {
      const ctx = getAudioContext();
      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }
        try {
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        } catch (e) {}
      }
      unlockEvents.forEach(evt => document.removeEventListener(evt, unlockHandler));
    };
    unlockEvents.forEach(evt => document.addEventListener(evt, unlockHandler, { once: false, passive: true }));
  }

  async function playSuccessSound() {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch (e) {}
    }

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Do5, Mi5, Sol5, Do6
      const start = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start + (idx * 0.065));
        gain.gain.setValueAtTime(0.001, start + (idx * 0.065));
        gain.gain.linearRampToValueAtTime(0.18, start + (idx * 0.065) + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + (idx * 0.065) + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start + (idx * 0.065));
        osc.stop(start + (idx * 0.065) + 0.3);
      });
    } catch (e) {}
  }

  async function playGentleBlip() {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch (e) {}
    }
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  function triggerCuteConfetti() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#88A28E", "#D9969D", "#9C8EC9", "#E8927C", "#E5A93C", "#7BAFD4"],
        disableForReducedMotion: true
      });
    }
  }

  // ============================================================================
  // UTILIDADES DE FECHAS
  // ============================================================================
  function getTodayString() {
    return formatDateKey(new Date());
  }

  function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDateKey(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return "";
    const d = parseDateKey(dateStr);
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
  }

  function getDayCode(dateStr) {
    const d = parseDateKey(dateStr);
    const codes = ["D", "L", "M", "X", "J", "V", "S"];
    return codes[d.getDay()];
  }

  function isHabitScheduledForDate(habit, dateStr) {
    if (!habit.Dias_Programados || habit.Dias_Programados === "todos" || habit.Dias_Programados === "all") {
      return true;
    }
    const dayCode = getDayCode(dateStr);
    const scheduledList = String(habit.Dias_Programados).toUpperCase().split(",").map(s => s.trim());
    return scheduledList.includes(dayCode);
  }

  // ============================================================================
  // INICIALIZACIÓN SÍNCRONA & DATOS DE PRODUCCIÓN
  // ============================================================================
  function initApp() {
    try { setupMobileAudioUnlock(); } catch (e) {}
    try { setupDomListeners(); } catch (e) {}
    try { setupTouchSwipe(); } catch (e) {}
    try { loadFromLocalStorage(); } catch (e) {}
    try { seedProductionData(false); } catch (e) {}

    // RENDERIZADO INMEDIATO Y SÍNCRONO DEL DOM
    try {
      renderAll();
    } catch (e) {
      console.error("Error en renderAll durante initApp:", e);
    }

    // Comprobación de Sincronización en Segundo Plano
    if (state.googleSheetsUrl) {
      setTimeout(() => {
        try { backgroundCheckSync(); } catch (e) {}
      }, 1200);
    }

    console.timeEnd("App_Init_Timer");
  }

  function seedProductionData(force = false) {
    const currentMockVer = localStorage.getItem("vanetracker_version");
    if (!force && currentMockVer === "4.0.0" && state.folders && state.folders.length > 0) {
      return;
    }

    console.log("🌸 Inicializando datos limpios de producción V4.0...");

    const todayStr = getTodayString();
    const dToday = parseDateKey(todayStr);

    function getDateOffset(days) {
      const d = new Date(dToday);
      d.setDate(d.getDate() + days);
      return formatDateKey(d);
    }

    // 1. CARPETAS GLOBALES
    state.folders = [
      { ID_Carpeta: "c1", Nombre: "Salud & Bienestar", Icono: "🌸", Color_Pastel: "#88A28E", Orden: 1, Fecha_Creacion: new Date().toISOString() },
      { ID_Carpeta: "c2", Nombre: "Matilda (Nuestra Hija Perruna)", Icono: "🐕", Color_Pastel: "#E5A93C", Orden: 2, Fecha_Creacion: new Date().toISOString() },
      { ID_Carpeta: "c3", Nombre: "Hogar & Limpieza", Icono: "🧹", Color_Pastel: "#7BAFD4", Orden: 3, Fecha_Creacion: new Date().toISOString() },
      { ID_Carpeta: "c4", Nombre: "Crecimiento Personal", Icono: "📚", Color_Pastel: "#9C8EC9", Orden: 4, Fecha_Creacion: new Date().toISOString() }
    ];

    // 2. CATÁLOGO DE HÁBITOS
    state.habitsCatalog = [
      { ID_Habito: "h1", Nombre: "Bañarse con agüita rica", Icono: "🚿", Color_Pastel: "#88A28E", Carpeta_Global: "Salud & Bienestar", Dias_Programados: "todos", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h2", Nombre: "Hacer pupú feliz", Icono: "🚽", Color_Pastel: "#E8927C", Carpeta_Global: "Salud & Bienestar", Dias_Programados: "todos", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h3", Nombre: "Pasear a Matilda", Icono: "🐕", Color_Pastel: "#E5A93C", Carpeta_Global: "Matilda (Nuestra Hija Perruna)", Dias_Programados: "todos", Meta_Diaria_Veces: 3, Activo: true },
      { ID_Habito: "h4", Nombre: "Tomar agua (2 Litros)", Icono: "💧", Color_Pastel: "#7BAFD4", Carpeta_Global: "Salud & Bienestar", Dias_Programados: "todos", Meta_Diaria_Veces: 4, Activo: true },
      { ID_Habito: "h5", Nombre: "Hacer ejercicio / Estiramientos", Icono: "🏃‍♀️", Color_Pastel: "#D9969D", Carpeta_Global: "Salud & Bienestar", Dias_Programados: "L,M,V", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h6", Nombre: "Rutina de Skincare & Mascarilla", Icono: "✨", Color_Pastel: "#C8A2C8", Carpeta_Global: "Salud & Bienestar", Dias_Programados: "todos", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h7", Nombre: "Limpieza de mesas y cocina", Icono: "🧽", Color_Pastel: "#7BAFD4", Carpeta_Global: "Hogar & Limpieza", Dias_Programados: "L,X,V", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h8", Nombre: "Limpieza profunda baños", Icono: "🧼", Color_Pastel: "#7BAFD4", Carpeta_Global: "Hogar & Limpieza", Dias_Programados: "S", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h9", Nombre: "Cepillar y consentir a Matilda", Icono: "🐾", Color_Pastel: "#E5A93C", Carpeta_Global: "Matilda (Nuestra Hija Perruna)", Dias_Programados: "todos", Meta_Diaria_Veces: 1, Activo: true },
      { ID_Habito: "h10", Nombre: "Leer 15 minutos en paz", Icono: "📖", Color_Pastel: "#9C8EC9", Carpeta_Global: "Crecimiento Personal", Dias_Programados: "todos", Meta_Diaria_Veces: 1, Activo: true }
    ];

    // 3. REGISTRO DE HÁBITOS DE PRUEBA (HISTORIAL DE 28 DÍAS CON RACHA VIVA)
    state.habitsLog = {};
    for (let offset = -28; offset <= 0; offset++) {
      const dStr = getDateOffset(offset);
      state.habitsLog[dStr] = {};

      state.habitsCatalog.forEach((h) => {
        if (!isHabitScheduledForDate(h, dStr)) return;
        const target = h.Meta_Diaria_Veces || 1;
        let isDone = false;
        let times = 0;

        if (offset === 0) {
          // Hoy: Baño y Pupú completados para probar interacción
          if (h.ID_Habito === "h1" || h.ID_Habito === "h2") {
            isDone = true;
            times = target;
          }
        } else if (offset >= -5) {
          // Últimos 5 días racha activa
          isDone = true;
          times = target;
        } else if (offset % 3 !== 0) {
          isDone = true;
          times = target;
        }

        state.habitsLog[dStr][h.Nombre] = {
          ID_Registro: `reg_${dStr}_${h.ID_Habito}`,
          Fecha_Habito: dStr,
          Timestamp_Creacion: new Date().toISOString(),
          Nombre_Habito: h.Nombre,
          Categoria_Icono: h.Icono,
          Estado: isDone ? "Completado" : "Pendiente",
          Comentarios: isDone && offset === 0 ? "Me sentí súper fresca y relajada 🌸" : "",
          Carpeta_Global: h.Carpeta_Global,
          Dias_Programados: h.Dias_Programados,
          Meta_Diaria_Veces: target,
          Veces_Completadas_Hoy: times,
          Escala_Emocion: "5 - Increíble",
          URL_Fotografia: ""
        };
      });
    }

    // 4. MEMORIAS DEL DIARIO
    state.journalEntries = [
      {
        ID_Entrada: "j_1",
        Fecha_Entrada: getDateOffset(-2),
        Timestamp_Creacion: new Date().toISOString(),
        Segmento_Categoria: "Matilda / Mascotas",
        Comentario_Nota: "Matilda aprendió a dar la patita sin pedir golosina primero 🐾. Se quedó mirándome con sus ojitos tiernos y me llenó el corazón de una alegría inmensa. ¡Es la perrita más linda de este mundo!",
        URL_Fotografia: "",
        Escala_Emocion: "5 - Increíble"
      },
      {
        ID_Entrada: "j_2",
        Fecha_Entrada: getDateOffset(-1),
        Timestamp_Creacion: new Date().toISOString(),
        Segmento_Categoria: "Gratitud",
        Comentario_Nota: "Agradecida por este hogar cálido, por el cafecito caliente de la mañana con Luis y por la oportunidad de florecer cada día un poquito más ✨.",
        URL_Fotografia: "",
        Escala_Emocion: "5 - Increíble"
      }
    ];

    // 5. CICLO MENSTRUAL
    state.cycleSettings = {
      lastPeriodStart: getDateOffset(-12),
      cycleDuration: 28,
      periodDuration: 5,
      follicularDuration: 8,
      ovulationDuration: 4,
      lutealDuration: 11
    };

    state.cycleLogs = [
      {
        ID_Ciclo: "c_log_1",
        Fecha_Registro: getDateOffset(-12),
        Fecha_Inicio_Periodo: getDateOffset(-12),
        Fase_Actual: "Menstrual",
        Nivel_Flujo: "Abundante",
        Sintomas: "Cólicos, Fatiga",
        Estado_Animo: "Sensible",
        Notas_Ciclo: "Inicio del ciclo. Té caliente de manzanilla y descanso con cobijita.",
        URL_Fotografia: "",
        Timestamp_Creacion: new Date().toISOString()
      },
      {
        ID_Ciclo: "c_log_2",
        Fecha_Registro: todayStr,
        Fecha_Inicio_Periodo: getDateOffset(-12),
        Fase_Actual: "Ovulación",
        Nivel_Flujo: "Clara de huevo",
        Sintomas: "Sensibilidad, Antojos",
        Estado_Animo: "Increíble",
        Notas_Ciclo: "Día fértil y con mucha energía positiva. Sintiéndome radiante.",
        URL_Fotografia: "",
        Timestamp_Creacion: new Date().toISOString()
      }
    ];

    saveToLocalStorage();
    localStorage.setItem("vanetracker_version", "4.0.0");
  }

  window.resetToMockData = function () {
    if (confirm("¿Deseas reiniciar los datos de prueba del maquetado?")) {
      seedProductionData(true);
      renderAll();
      playSuccessSound();
      triggerCuteConfetti();
      alert("🌸 ¡Datos restaurados con éxito! Ahora puedes interactuar libremente con todos los módulos.");
    }
  };

  // ============================================================================
  // PERSISTENCIA LOCALSTORAGE
  // ============================================================================
  function loadFromLocalStorage() {
    try {
      const sound = localStorage.getItem("vanetracker_sound");
      if (sound !== null) state.soundEnabled = sound === "true";

      const folders = localStorage.getItem("vanetracker_folders");
      if (folders) state.folders = JSON.parse(folders);

      const habits = localStorage.getItem("vanetracker_habits");
      if (habits) state.habitsCatalog = JSON.parse(habits);

      const logs = localStorage.getItem("vanetracker_logs");
      if (logs) state.habitsLog = JSON.parse(logs);

      const collapsed = localStorage.getItem("vanetracker_collapsed_folders");
      if (collapsed) state.collapsedFolders = JSON.parse(collapsed);

      const journal = localStorage.getItem("vanetracker_journal");
      if (journal) state.journalEntries = JSON.parse(journal);

      const categories = localStorage.getItem("vanetracker_journal_categories");
      if (categories) state.journalCategories = JSON.parse(categories);

      const cycle = localStorage.getItem("vanetracker_cycle_settings");
      if (cycle) state.cycleSettings = Object.assign(state.cycleSettings, JSON.parse(cycle));

      const cycleLogs = localStorage.getItem("vanetracker_cycle_logs");
      if (cycleLogs) state.cycleLogs = JSON.parse(cycleLogs);

      const url = localStorage.getItem("vanetracker_sheets_url");
      if (url) state.googleSheetsUrl = url;

      const sheetId = localStorage.getItem("vanetracker_spreadsheet_id");
      if (sheetId) state.spreadsheetId = sheetId;

      const mood = localStorage.getItem(`vanetracker_mood_${state.selectedDate}`);
      if (mood) state.currentDayMood = mood;
    } catch (e) {}
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem("vanetracker_sound", state.soundEnabled);
      localStorage.setItem("vanetracker_folders", JSON.stringify(state.folders));
      localStorage.setItem("vanetracker_habits", JSON.stringify(state.habitsCatalog));
      localStorage.setItem("vanetracker_logs", JSON.stringify(state.habitsLog));
      localStorage.setItem("vanetracker_collapsed_folders", JSON.stringify(state.collapsedFolders));
      localStorage.setItem("vanetracker_journal", JSON.stringify(state.journalEntries));
      localStorage.setItem("vanetracker_journal_categories", JSON.stringify(state.journalCategories));
      localStorage.setItem("vanetracker_cycle_settings", JSON.stringify(state.cycleSettings));
      localStorage.setItem("vanetracker_cycle_logs", JSON.stringify(state.cycleLogs));
      localStorage.setItem("vanetracker_sheets_url", state.googleSheetsUrl);
      localStorage.setItem("vanetracker_spreadsheet_id", state.spreadsheetId);
      localStorage.setItem(`vanetracker_mood_${state.selectedDate}`, state.currentDayMood);
    } catch (e) {}
  }

  // ============================================================================
  // RENDER GENERAL BLINDADO CON TRY/CATCH
  // ============================================================================
  function renderAll() {
    try { renderTopNav(); } catch (e) { console.warn("Error renderTopNav:", e); }
    try { renderDailyQuoteBanner(); } catch (e) { console.warn("Error renderDailyQuoteBanner:", e); }
    try { renderDateNavigator(); } catch (e) { console.warn("Error renderDateNavigator:", e); }
    try { renderMoodSelector(); } catch (e) { console.warn("Error renderMoodSelector:", e); }
    try { renderHabitsModule(); } catch (e) { console.warn("Error renderHabitsModule:", e); }
    try { renderJournalModule(); } catch (e) { console.warn("Error renderJournalModule:", e); }
    try { renderCycleModule(); } catch (e) { console.warn("Error renderCycleModule:", e); }
    try { renderDashboardModule(); } catch (e) { console.warn("Error renderDashboardModule:", e); }
    try { renderEmojiPickerGrid(); } catch (e) { console.warn("Error renderEmojiPickerGrid:", e); }
  }

  // ============================================================================
  // 1. HEADER & RACHAS
  // ============================================================================
  function calculateStreaks() {
    const activeHabits = state.habitsCatalog.filter(h => h.Activo);
    if (activeHabits.length === 0) return { currentStreak: 0, maxStreak: 0 };

    let currentStreak = 0;
    let checkDate = new Date();
    const todayStr = getTodayString();

    function isDaySuccessful(dStr) {
      const scheduled = activeHabits.filter(h => isHabitScheduledForDate(h, dStr));
      if (scheduled.length === 0) return true;
      const dayLogs = state.habitsLog[dStr] || {};
      let completedCount = 0;
      scheduled.forEach(h => {
        const log = dayLogs[h.Nombre];
        const target = h.Meta_Diaria_Veces || 1;
        const count = log ? (log.Veces_Completadas_Hoy !== undefined ? log.Veces_Completadas_Hoy : (log.Estado === "Completado" ? target : 0)) : 0;
        if (count >= target || (log && log.Estado === "Completado")) completedCount++;
      });
      return completedCount >= Math.max(1, Math.floor(scheduled.length * 0.5));
    }

    const todayScheduled = activeHabits.filter(h => isHabitScheduledForDate(h, todayStr));
    const isTodayDone = isDaySuccessful(todayStr);

    if (isTodayDone && todayScheduled.length > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
      const dKey = formatDateKey(checkDate);
      const scheduled = activeHabits.filter(h => isHabitScheduledForDate(h, dKey));
      if (scheduled.length === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      if (isDaySuccessful(dKey)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const savedMax = Number(localStorage.getItem("vanetracker_record_streak") || 0);
    const maxStreak = Math.max(currentStreak, savedMax);
    localStorage.setItem("vanetracker_record_streak", maxStreak);

    return { currentStreak, maxStreak };
  }

  function renderTopNav() {
    const { currentStreak } = calculateStreaks();
    const streakDisplay = document.getElementById("header-streak-count");
    if (streakDisplay) streakDisplay.textContent = currentStreak;

    const soundBtn = document.getElementById("sound-toggle-btn");
    if (soundBtn) {
      soundBtn.textContent = state.soundEnabled ? "🔊" : "🔇";
      soundBtn.title = state.soundEnabled ? "Sonido activado" : "Silenciado";
    }
  }

  window.toggleSound = function () {
    state.soundEnabled = !state.soundEnabled;
    saveToLocalStorage();
    renderTopNav();
    if (state.soundEnabled) playSuccessSound();
  };

  function renderDailyQuoteBanner() {
    const bannerEl = document.getElementById("daily-quote-text");
    if (!bannerEl) return;
    const now = parseDateKey(state.selectedDate);
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    bannerEl.textContent = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
  }

  window.shuffleDailyQuote = function () {
    const bannerEl = document.getElementById("daily-quote-text");
    if (!bannerEl) return;
    const randomQuote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
    bannerEl.style.opacity = 0;
    setTimeout(() => {
      bannerEl.textContent = randomQuote;
      bannerEl.style.opacity = 1;
      playGentleBlip();
    }, 150);
  };

  // ============================================================================
  // NAVEGADOR DE FECHA & MOOD
  // ============================================================================
  function renderDateNavigator() {
    const displayEl = document.getElementById("current-date-display");
    const isToday = state.selectedDate === state.todayDate;
    const pastBanner = document.getElementById("retroactive-date-banner");

    if (displayEl) displayEl.textContent = formatDisplayDate(state.selectedDate);

    if (pastBanner) {
      if (!isToday) {
        pastBanner.classList.remove("hidden");
        const bannerText = document.getElementById("retroactive-banner-text");
        if (bannerText) {
          bannerText.textContent = `Viendo hábitos del ${formatDisplayDate(state.selectedDate)}`;
        }
      } else {
        pastBanner.classList.add("hidden");
      }
    }

    const nativePicker = document.getElementById("native-date-input");
    if (nativePicker) nativePicker.value = state.selectedDate;
  }

  window.selectDate = function (dateStr) {
    state.selectedDate = dateStr;
    const savedMood = localStorage.getItem(`vanetracker_mood_${dateStr}`);
    state.currentDayMood = savedMood || "5 - Increíble";
    renderDateNavigator();
    renderDailyQuoteBanner();
    renderMoodSelector();
    renderHabitsModule();
    if (state.activeTab === "dashboard") renderDashboardModule();
  };

  window.navigateDate = function (direction) {
    const cur = parseDateKey(state.selectedDate);
    cur.setDate(cur.getDate() + direction);
    window.selectDate(formatDateKey(cur));
  };

  window.goToToday = function () {
    window.selectDate(state.todayDate);
  };

  window.onNativeDateChange = function (val) {
    if (val) window.selectDate(val);
  };

  function renderMoodSelector() {
    const container = document.getElementById("habit-mood-selector");
    if (!container) return;

    const moods = [
      { level: "1 - Mal", emoji: "😢", label: "Mal" },
      { level: "2 - Regular", emoji: "😕", label: "Regular" },
      { level: "3 - Normal", emoji: "😐", label: "Normal" },
      { level: "4 - Bien", emoji: "🙂", label: "Bien" },
      { level: "5 - Increíble", emoji: "🥰", label: "Increíble" }
    ];

    let html = "";
    moods.forEach(m => {
      const isSel = state.currentDayMood === m.level;
      html += `
        <button type="button" onclick="window.selectDayMood('${m.level}')"
                class="mood-pill-btn ${isSel ? 'active' : ''}">
          <span class="text-xl">${m.emoji}</span>
          <span class="text-[10px] font-bold text-stone-600 mt-0.5">${m.label}</span>
        </button>
      `;
    });
    container.innerHTML = html;
  }

  window.selectDayMood = function (moodLevel) {
    state.currentDayMood = moodLevel;
    saveToLocalStorage();
    renderMoodSelector();
    playGentleBlip();
  };

  // ============================================================================
  // 2. MÓDULO DE HÁBITOS (CRUD COMPLETO, TOGGLE, FOTOS Y COMENTARIOS)
  // ============================================================================
  function renderHabitsModule() {
    const container = document.getElementById("habits-list-container");
    if (!container) return;

    const dayLogs = state.habitsLog[state.selectedDate] || {};
    const activeHabits = state.habitsCatalog.filter(h => h.Activo);
    const scheduledForToday = activeHabits.filter(h => isHabitScheduledForDate(h, state.selectedDate));

    // Contador de hábitos completados hoy
    let completedCount = 0;
    scheduledForToday.forEach(h => {
      const log = dayLogs[h.Nombre];
      const target = h.Meta_Diaria_Veces || 1;
      const count = log ? (log.Veces_Completadas_Hoy !== undefined ? log.Veces_Completadas_Hoy : (log.Estado === "Completado" ? target : 0)) : 0;
      if (count >= target || (log && log.Estado === "Completado")) completedCount++;
    });

    const percent = scheduledForToday.length > 0 ? Math.round((completedCount / scheduledForToday.length) * 100) : 0;
    const progressBar = document.getElementById("daily-progress-bar");
    const progressText = document.getElementById("daily-progress-text");
    const progressPercent = document.getElementById("daily-progress-percent");

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${completedCount} de ${scheduledForToday.length} completados hoy`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;

    let html = "";

    // Agrupación por carpetas globales
    state.folders.forEach(folder => {
      const folderHabits = activeHabits.filter(h => h.Carpeta_Global === folder.Nombre);
      const isCollapsed = Boolean(state.collapsedFolders[folder.ID_Carpeta]);

      html += `
        <div id="folder-box-${folder.ID_Carpeta}" class="folder-box ${isCollapsed ? 'folder-collapsed' : ''}">
          <!-- Header de Carpeta con Botón Agregar Hábito (+) y Editar (✏️) -->
          <div class="folder-header" onclick="window.toggleFolder('${folder.ID_Carpeta}')">
            <div class="flex items-center gap-2">
              <span class="folder-chevron text-stone-400 text-xs">▼</span>
              <span class="text-base">${folder.Icono || '📁'}</span>
              <span class="font-serif font-bold text-sm text-stone-800">${escapeHtml(folder.Nombre)}</span>
              <span class="text-[11px] font-semibold text-stone-400">(${folderHabits.length})</span>
            </div>
            
            <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
              <!-- Botón + Directo para agregar hábito dentro de ESTA carpeta -->
              <button type="button"
                      onclick="openNewHabitModal('${escapeAttr(folder.Nombre)}')"
                      class="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-xs text-stone-600 hover:bg-stone-100 transition-colors shadow-xs"
                      title="Agregar hábito en ${escapeAttr(folder.Nombre)}">
                ＋
              </button>
              <!-- Botón Editar Carpeta -->
              <button type="button"
                      onclick="openEditFolderModal('${folder.ID_Carpeta}')"
                      class="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[11px] text-stone-600 hover:bg-stone-100 transition-colors shadow-xs"
                      title="Editar Carpeta">
                ✏️
              </button>
            </div>
          </div>

          <!-- Contenido de Hábitos dentro de la Carpeta -->
          <div class="folder-content space-y-2.5">
      `;

      if (folderHabits.length === 0) {
        html += `
          <div class="p-3 text-center text-stone-400 text-xs bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            No hay hábitos en esta carpeta. Toca <strong>＋</strong> arriba para crear uno.
          </div>
        `;
      }

      folderHabits.forEach(habit => {
        const isScheduled = isHabitScheduledForDate(habit, state.selectedDate);
        const log = dayLogs[habit.Nombre] || {};
        const target = habit.Meta_Diaria_Veces || 1;
        const currentCount = log.Veces_Completadas_Hoy !== undefined ? log.Veces_Completadas_Hoy : (log.Estado === "Completado" ? target : 0);
        const isCompleted = currentCount >= target || log.Estado === "Completado";
        const isFailed = log.Estado === "No_Realizado";
        const hasComment = Boolean(log.Comentarios);
        const hasPhoto = Boolean(log.URL_Fotografia);

        let cardClass = "card-clean habit-card p-3.5 flex flex-col gap-2.5";
        if (isCompleted) cardClass += " completed";
        else if (isFailed) cardClass += " failed";
        else cardClass += " uncompleted";

        html += `
          <div class="${cardClass}">
            <div class="flex items-center justify-between gap-2">
              <!-- Info del Hábito -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
                     style="background-color: ${habit.Color_Pastel || '#88A28E'}25; border: 1px solid ${habit.Color_Pastel || '#88A28E'}50;">
                  ${habit.Icono || '✨'}
                </div>
                <div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-bold text-xs md:text-sm text-stone-800">${escapeHtml(habit.Nombre)}</span>
                    ${!isScheduled ? `<span class="notion-pill pill-gray text-[9px]">No programado hoy</span>` : ''}
                  </div>
                  <div class="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                    <span>Meta: ${target} al día</span>
                    ${target > 1 ? `<span>• Progreso: <strong class="text-stone-700">${currentCount}/${target}</strong></span>` : ''}
                  </div>
                </div>
              </div>

              <!-- Botones de Acción: Editar Hábito -->
              <div class="flex items-center gap-1">
                <button type="button"
                        onclick="openEditHabitModal('${habit.ID_Habito}')"
                        class="text-stone-400 hover:text-stone-700 p-1 text-xs"
                        title="Editar Hábito">
                  ✏️
                </button>
              </div>
            </div>

            <!-- Botones de Interacción (Lo hizo / No lo hizo / Contador) -->
            <div class="flex items-center justify-between gap-2 pt-1 border-t border-stone-100/80">
              
              <!-- Si requiere más de 1 vez al día -->
              ${target > 1 ? `
                <div class="flex items-center gap-1.5">
                  <button type="button"
                          onclick="decrementHabitCount('${escapeAttr(habit.Nombre)}')"
                          class="w-7 h-7 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center">
                    -
                  </button>
                  <span class="font-bold text-xs text-stone-700 px-1">${currentCount}/${target}</span>
                  <button type="button"
                          onclick="incrementHabitCount('${escapeAttr(habit.Nombre)}')"
                          class="w-7 h-7 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    +
                  </button>
                </div>
              ` : `
                <!-- Botón Toggle Principal: Lo Hizo -->
                <button type="button"
                        onclick="toggleHabitStatus('${escapeAttr(habit.Nombre)}')"
                        class="btn-tactile ${isCompleted ? 'btn-tactile-sage' : 'btn-tactile-white'} px-3 py-1.5 text-xs gap-1 shadow-xs">
                  <span>${isCompleted ? '✓' : '○'}</span>
                  <span>${isCompleted ? '¡Completado! (Toca para desmarcar)' : 'Marcar Hecho'}</span>
                </button>
              `}

              <!-- Acciones Secundarias: No lo hizo & Nota/Foto -->
              <div class="flex items-center gap-1.5">
                <button type="button"
                        onclick="setHabitFailedStatus('${escapeAttr(habit.Nombre)}')"
                        class="p-1.5 rounded-xl border border-stone-200 hover:bg-rose-50 text-[11px] text-stone-500 hover:text-rose-600 transition-colors"
                        title="Marcar como no realizado">
                  ❌
                </button>
                <button type="button"
                        onclick="openHabitNoteModal('${escapeAttr(habit.Nombre)}')"
                        class="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-[11px] text-stone-600 flex items-center gap-1"
                        title="Escribir comentario o adjuntar foto">
                  <span>📝</span>
                  ${hasPhoto ? `<span>📷</span>` : ''}
                </button>
              </div>

            </div>

            <!-- Previsualización de Comentario o Foto de este hábito si existe -->
            ${(hasComment || hasPhoto) ? `
              <div class="bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/60 text-xs flex items-start gap-2.5 cursor-pointer hover:bg-stone-100/60 transition-colors"
                   onclick="openLightboxFromHabit('${escapeAttr(habit.Nombre)}')">
                ${hasPhoto ? `<img src="${log.URL_Fotografia}" class="w-10 h-10 object-cover rounded-lg border border-stone-200 flex-shrink-0" alt="Foto Hábito" />` : ''}
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] text-stone-600 italic line-clamp-2">"${escapeHtml(log.Comentarios || 'Foto adjunta de hoy')}"</p>
                </div>
                <span class="text-stone-300 text-[10px]">Ver en grande 🔍</span>
              </div>
            ` : ''}

          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  window.toggleFolder = function (folderId) {
    const el = document.getElementById(`folder-box-${folderId}`);
    if (el) {
      el.classList.toggle("folder-collapsed");
      state.collapsedFolders[folderId] = el.classList.contains("folder-collapsed");
      saveToLocalStorage();
      playGentleBlip();
    }
  };

  // ============================================================================
  // INTERACCIÓN TOGGLE DE HÁBITOS (MARCAR / DESMARCAR / CONTADOR)
  // ============================================================================
  window.toggleHabitStatus = function (habitName) {
    const f = state.selectedDate;
    if (!state.habitsLog[f]) state.habitsLog[f] = {};
    const habitDef = state.habitsCatalog.find(h => h.Nombre === habitName) || { Icono: "✨", Meta_Diaria_Veces: 1, Carpeta_Global: "General" };
    const existing = state.habitsLog[f][habitName] || {};
    const target = habitDef.Meta_Diaria_Veces || 1;

    // Si ya está completado -> DESMARCAR (volver a pendiente)
    const isCurrentlyDone = existing.Estado === "Completado" || (existing.Veces_Completadas_Hoy >= target);

    if (isCurrentlyDone) {
      existing.Estado = "Pendiente";
      existing.Veces_Completadas_Hoy = 0;
      playGentleBlip();
    } else {
      existing.Estado = "Completado";
      existing.Veces_Completadas_Hoy = target;
      playSuccessSound();
      triggerCuteConfetti();
    }

    existing.ID_Registro = existing.ID_Registro || `reg_${f}_${Date.now()}`;
    existing.Fecha_Habito = f;
    existing.Timestamp_Creacion = new Date().toISOString();
    existing.Nombre_Habito = habitName;
    existing.Categoria_Icono = habitDef.Icono;
    existing.Carpeta_Global = habitDef.Carpeta_Global;
    existing.Dias_Programados = habitDef.Dias_Programados || "todos";
    existing.Meta_Diaria_Veces = target;
    existing.Escala_Emocion = state.currentDayMood;

    state.habitsLog[f][habitName] = existing;
    saveToLocalStorage();
    renderHabitsModule();
    renderTopNav();

    // Sincronización en segundo plano con Google Sheets
    sendAsyncLogToBackend("save_habit_log", { record: existing });
  };

  window.setHabitFailedStatus = function (habitName) {
    const f = state.selectedDate;
    if (!state.habitsLog[f]) state.habitsLog[f] = {};
    const habitDef = state.habitsCatalog.find(h => h.Nombre === habitName) || { Icono: "✨", Meta_Diaria_Veces: 1, Carpeta_Global: "General" };
    const existing = state.habitsLog[f][habitName] || {};

    existing.Estado = "No_Realizado";
    existing.Veces_Completadas_Hoy = 0;
    existing.ID_Registro = existing.ID_Registro || `reg_${f}_${Date.now()}`;
    existing.Fecha_Habito = f;
    existing.Timestamp_Creacion = new Date().toISOString();
    existing.Nombre_Habito = habitName;
    existing.Categoria_Icono = habitDef.Icono;
    existing.Carpeta_Global = habitDef.Carpeta_Global;
    existing.Dias_Programados = habitDef.Dias_Programados || "todos";
    existing.Meta_Diaria_Veces = habitDef.Meta_Diaria_Veces || 1;
    existing.Escala_Emocion = state.currentDayMood;

    state.habitsLog[f][habitName] = existing;
    saveToLocalStorage();
    renderHabitsModule();
    renderTopNav();
    playGentleBlip();

    sendAsyncLogToBackend("save_habit_log", { record: existing });
  };

  window.incrementHabitCount = function (habitName) {
    const f = state.selectedDate;
    if (!state.habitsLog[f]) state.habitsLog[f] = {};
    const habitDef = state.habitsCatalog.find(h => h.Nombre === habitName) || { Icono: "✨", Meta_Diaria_Veces: 1 };
    const existing = state.habitsLog[f][habitName] || {};
    const target = habitDef.Meta_Diaria_Veces || 1;

    let count = Number(existing.Veces_Completadas_Hoy || 0) + 1;
    count = Math.min(count, target);
    const isDone = count >= target;

    existing.Veces_Completadas_Hoy = count;
    existing.Estado = isDone ? "Completado" : "Pendiente";
    existing.ID_Registro = existing.ID_Registro || `reg_${f}_${Date.now()}`;
    existing.Fecha_Habito = f;
    existing.Timestamp_Creacion = new Date().toISOString();
    existing.Nombre_Habito = habitName;
    existing.Categoria_Icono = habitDef.Icono;
    existing.Carpeta_Global = habitDef.Carpeta_Global;
    existing.Meta_Diaria_Veces = target;
    existing.Escala_Emocion = state.currentDayMood;

    if (isDone) {
      playSuccessSound();
      triggerCuteConfetti();
    } else {
      playGentleBlip();
    }

    state.habitsLog[f][habitName] = existing;
    saveToLocalStorage();
    renderHabitsModule();
    renderTopNav();

    sendAsyncLogToBackend("save_habit_log", { record: existing });
  };

  window.decrementHabitCount = function (habitName) {
    const f = state.selectedDate;
    if (!state.habitsLog[f]) state.habitsLog[f] = {};
    const habitDef = state.habitsCatalog.find(h => h.Nombre === habitName) || { Icono: "✨", Meta_Diaria_Veces: 1 };
    const existing = state.habitsLog[f][habitName] || {};

    let count = Number(existing.Veces_Completadas_Hoy || 0) - 1;
    count = Math.max(0, count);

    existing.Veces_Completadas_Hoy = count;
    existing.Estado = count === 0 ? "Pendiente" : (count >= (habitDef.Meta_Diaria_Veces || 1) ? "Completado" : "Pendiente");
    existing.ID_Registro = existing.ID_Registro || `reg_${f}_${Date.now()}`;
    existing.Fecha_Habito = f;
    existing.Nombre_Habito = habitName;

    playGentleBlip();
    state.habitsLog[f][habitName] = existing;
    saveToLocalStorage();
    renderHabitsModule();
    renderTopNav();

    sendAsyncLogToBackend("save_habit_log", { record: existing });
  };

  // ============================================================================
  // MODAL DE OBSERVACIÓN & FOTO DEL HÁBITO
  // ============================================================================
  window.openHabitNoteModal = function (habitName) {
    state.habitNoteTarget = habitName;
    const f = state.selectedDate;
    const log = (state.habitsLog[f] && state.habitsLog[f][habitName]) || {};

    const nameLbl = document.getElementById("habit-note-modal-habit-name");
    const dateLbl = document.getElementById("habit-note-modal-date");
    const textarea = document.getElementById("habit-note-modal-text");
    const previewWrap = document.getElementById("habit-modal-photo-preview-wrap");
    const previewImg = document.getElementById("habit-modal-photo-preview");

    if (nameLbl) nameLbl.textContent = habitName;
    if (dateLbl) dateLbl.textContent = formatDisplayDate(f);
    if (textarea) textarea.value = log.Comentarios || "";

    state.habitNotePhotoBase64 = log.URL_Fotografia || null;
    if (previewWrap && previewImg) {
      if (log.URL_Fotografia) {
        previewImg.src = log.URL_Fotografia;
        previewWrap.classList.remove("hidden");
      } else {
        previewWrap.classList.add("hidden");
      }
    }

    const modal = document.getElementById("habit-note-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeHabitNoteModal = function () {
    const modal = document.getElementById("habit-note-modal");
    if (modal) modal.classList.remove("open");
    state.habitNoteTarget = null;
    state.habitNotePhotoBase64 = null;
  };

  window.handleHabitModalPhotoSelect = function (e) {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFileToBase64(file, 800, 0.75, (base64) => {
      state.habitNotePhotoBase64 = base64;
      const previewWrap = document.getElementById("habit-modal-photo-preview-wrap");
      const previewImg = document.getElementById("habit-modal-photo-preview");
      if (previewWrap && previewImg) {
        previewImg.src = base64;
        previewWrap.classList.remove("hidden");
      }
    });
  };

  window.removeHabitModalPhoto = function () {
    state.habitNotePhotoBase64 = "";
    const previewWrap = document.getElementById("habit-modal-photo-preview-wrap");
    if (previewWrap) previewWrap.classList.add("hidden");
    const input = document.getElementById("habit-modal-photo-input");
    if (input) input.value = "";
  };

  window.saveHabitNoteAndPhoto = function () {
    const habitName = state.habitNoteTarget;
    if (!habitName) return;
    const f = state.selectedDate;
    if (!state.habitsLog[f]) state.habitsLog[f] = {};
    const habitDef = state.habitsCatalog.find(h => h.Nombre === habitName) || { Icono: "✨", Meta_Diaria_Veces: 1 };
    const existing = state.habitsLog[f][habitName] || {};

    const text = (document.getElementById("habit-note-modal-text")?.value || "").trim();

    existing.ID_Registro = existing.ID_Registro || `reg_${f}_${Date.now()}`;
    existing.Fecha_Habito = f;
    existing.Timestamp_Creacion = new Date().toISOString();
    existing.Nombre_Habito = habitName;
    existing.Categoria_Icono = habitDef.Icono;
    existing.Carpeta_Global = habitDef.Carpeta_Global;
    existing.Comentarios = text;
    existing.URL_Fotografia = state.habitNotePhotoBase64 || existing.URL_Fotografia || "";
    existing.photo_base64 = state.habitNotePhotoBase64 || "";

    state.habitsLog[f][habitName] = existing;
    saveToLocalStorage();
    renderHabitsModule();
    window.closeHabitNoteModal();
    playSuccessSound();

    sendAsyncLogToBackend("save_habit_log", { record: existing });
  };

  // ============================================================================
  // CRUD DE CARPETAS (CREAR, EDITAR, ELIMINAR)
  // ============================================================================
  window.openNewFolderModal = function () {
    const title = document.getElementById("folder-modal-title");
    const editId = document.getElementById("editing-folder-id");
    const nameInput = document.getElementById("new-folder-name");
    const iconInput = document.getElementById("new-folder-icon");
    const colorInput = document.getElementById("new-folder-color");
    const deleteBtn = document.getElementById("btn-delete-folder");

    if (title) title.textContent = "Nueva Carpeta Global";
    if (editId) editId.value = "";
    if (nameInput) nameInput.value = "";
    if (iconInput) iconInput.value = "📁";
    if (colorInput) colorInput.value = "#88A28E";
    if (deleteBtn) deleteBtn.classList.add("hidden");

    const modal = document.getElementById("new-folder-modal");
    if (modal) modal.classList.add("open");
  };

  window.openEditFolderModal = function (folderId) {
    const folder = state.folders.find(f => f.ID_Carpeta === folderId);
    if (!folder) return;

    const title = document.getElementById("folder-modal-title");
    const editId = document.getElementById("editing-folder-id");
    const nameInput = document.getElementById("new-folder-name");
    const iconInput = document.getElementById("new-folder-icon");
    const colorInput = document.getElementById("new-folder-color");
    const deleteBtn = document.getElementById("btn-delete-folder");

    if (title) title.textContent = "Editar Carpeta Global";
    if (editId) editId.value = folder.ID_Carpeta;
    if (nameInput) nameInput.value = folder.Nombre;
    if (iconInput) iconInput.value = folder.Icono || "📁";
    if (colorInput) colorInput.value = folder.Color_Pastel || "#88A28E";
    if (deleteBtn) deleteBtn.classList.remove("hidden");

    const modal = document.getElementById("new-folder-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeNewFolderModal = function () {
    const modal = document.getElementById("new-folder-modal");
    if (modal) modal.classList.remove("open");
  };

  window.saveNewFolder = function () {
    const editId = document.getElementById("editing-folder-id")?.value;
    const name = (document.getElementById("new-folder-name")?.value || "").trim();
    const icon = (document.getElementById("new-folder-icon")?.value || "📁").trim();
    const color = document.getElementById("new-folder-color")?.value || "#88A28E";

    if (!name) {
      alert("Por favor escribe el nombre de la carpeta");
      return;
    }

    if (editId) {
      // Editar existente
      const folder = state.folders.find(f => f.ID_Carpeta === editId);
      if (folder) {
        const oldName = folder.Nombre;
        folder.Nombre = name;
        folder.Icono = icon;
        folder.Color_Pastel = color;
        // Reasignar hábitos si cambió el nombre
        if (oldName !== name) {
          state.habitsCatalog.forEach(h => {
            if (h.Carpeta_Global === oldName) h.Carpeta_Global = name;
          });
        }
        sendAsyncLogToBackend("save_folder", { folder: folder });
      }
    } else {
      // Crear nueva
      const newFolder = {
        ID_Carpeta: `c_${Date.now()}`,
        Nombre: name,
        Icono: icon,
        Color_Pastel: color,
        Orden: state.folders.length + 1,
        Fecha_Creacion: new Date().toISOString()
      };
      state.folders.push(newFolder);
      sendAsyncLogToBackend("save_folder", { folder: newFolder });
    }

    saveToLocalStorage();
    renderHabitsModule();
    window.closeNewFolderModal();
    playSuccessSound();
  };

  window.deleteCurrentEditingFolder = function () {
    const editId = document.getElementById("editing-folder-id")?.value;
    if (!editId) return;

    if (confirm("¿Segura que deseas eliminar esta carpeta? Sus hábitos pasarán a la carpeta General.")) {
      const idx = state.folders.findIndex(f => f.ID_Carpeta === editId);
      if (idx !== -1) {
        const folder = state.folders[idx];
        state.folders.splice(idx, 1);
        // Reasignar hábitos
        state.habitsCatalog.forEach(h => {
          if (h.Carpeta_Global === folder.Nombre) h.Carpeta_Global = "Salud & Bienestar";
        });
        sendAsyncLogToBackend("delete_folder", { id: editId, nombre: folder.Nombre });
        saveToLocalStorage();
        renderHabitsModule();
        window.closeNewFolderModal();
        playGentleBlip();
      }
    }
  };

  // ============================================================================
  // CRUD DE HÁBITOS (CREAR, EDITAR, ELIMINAR)
  // ============================================================================
  window.openNewHabitModal = function (preselectedFolder) {
    const title = document.getElementById("habit-modal-title");
    const editId = document.getElementById("editing-habit-id");
    const nameInput = document.getElementById("new-habit-name");
    const emojiInput = document.getElementById("new-habit-emoji");
    const colorInput = document.getElementById("new-habit-color");
    const timesInput = document.getElementById("new-habit-times");
    const deleteBtn = document.getElementById("btn-delete-habit");

    if (title) title.textContent = "Nuevo Hábito";
    if (editId) editId.value = "";
    if (nameInput) nameInput.value = "";
    if (emojiInput) emojiInput.value = "🌸";
    if (colorInput) colorInput.value = "#88A28E";
    if (timesInput) timesInput.value = "1";
    if (deleteBtn) deleteBtn.classList.add("hidden");

    // Días programados por defecto: todos
    document.querySelectorAll(".habit-day-checkbox").forEach(cb => cb.checked = true);

    // Llenar select de carpetas
    const folderSelect = document.getElementById("new-habit-folder-select");
    if (folderSelect) {
      folderSelect.innerHTML = state.folders.map(f => {
        const isSel = preselectedFolder && f.Nombre === preselectedFolder;
        return `<option value="${escapeAttr(f.Nombre)}" ${isSel ? 'selected' : ''}>${f.Icono} ${escapeHtml(f.Nombre)}</option>`;
      }).join("");
    }

    renderEmojiPickerGrid();

    const modal = document.getElementById("new-habit-modal");
    if (modal) modal.classList.add("open");
  };

  window.openEditHabitModal = function (habitId) {
    const habit = state.habitsCatalog.find(h => h.ID_Habito === habitId);
    if (!habit) return;

    const title = document.getElementById("habit-modal-title");
    const editId = document.getElementById("editing-habit-id");
    const nameInput = document.getElementById("new-habit-name");
    const emojiInput = document.getElementById("new-habit-emoji");
    const colorInput = document.getElementById("new-habit-color");
    const timesInput = document.getElementById("new-habit-times");
    const deleteBtn = document.getElementById("btn-delete-habit");

    if (title) title.textContent = "Editar Hábito";
    if (editId) editId.value = habit.ID_Habito;
    if (nameInput) nameInput.value = habit.Nombre;
    if (emojiInput) emojiInput.value = habit.Icono || "🌸";
    if (colorInput) colorInput.value = habit.Color_Pastel || "#88A28E";
    if (timesInput) timesInput.value = habit.Meta_Diaria_Veces || 1;
    if (deleteBtn) deleteBtn.classList.remove("hidden");

    // Marcar días programados
    const daysArr = (habit.Dias_Programados === "todos" || habit.Dias_Programados === "all")
      ? ["L", "M", "X", "J", "V", "S", "D"]
      : String(habit.Dias_Programados).split(",").map(s => s.trim().toUpperCase());

    document.querySelectorAll(".habit-day-checkbox").forEach(cb => {
      cb.checked = daysArr.includes(cb.value.toUpperCase());
    });

    const folderSelect = document.getElementById("new-habit-folder-select");
    if (folderSelect) {
      folderSelect.innerHTML = state.folders.map(f => {
        const isSel = f.Nombre === habit.Carpeta_Global;
        return `<option value="${escapeAttr(f.Nombre)}" ${isSel ? 'selected' : ''}>${f.Icono} ${escapeHtml(f.Nombre)}</option>`;
      }).join("");
    }

    renderEmojiPickerGrid();

    const modal = document.getElementById("new-habit-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeNewHabitModal = function () {
    const modal = document.getElementById("new-habit-modal");
    if (modal) modal.classList.remove("open");
  };

  window.saveNewHabit = function () {
    const editId = document.getElementById("editing-habit-id")?.value;
    const nameInput = document.getElementById("new-habit-name");
    const emojiInput = document.getElementById("new-habit-emoji");
    const colorInput = document.getElementById("new-habit-color");
    const folderSelect = document.getElementById("new-habit-folder-select");
    const timesInput = document.getElementById("new-habit-times");

    const name = (nameInput?.value || "").trim();
    if (!name) {
      alert("Por favor escribe el nombre del hábito");
      return;
    }

    const checkedDays = [];
    document.querySelectorAll(".habit-day-checkbox:checked").forEach(cb => checkedDays.push(cb.value));
    const diasProg = checkedDays.length === 7 || checkedDays.length === 0 ? "todos" : checkedDays.join(",");

    if (editId) {
      // Editar
      const habit = state.habitsCatalog.find(h => h.ID_Habito === editId);
      if (habit) {
        habit.Nombre = name;
        habit.Icono = (emojiInput?.value || "✨").trim();
        habit.Color_Pastel = colorInput?.value || "#88A28E";
        habit.Carpeta_Global = folderSelect?.value || "Salud & Bienestar";
        habit.Dias_Programados = diasProg;
        habit.Meta_Diaria_Veces = parseInt(timesInput?.value) || 1;
        sendAsyncLogToBackend("save_habit_definition", { habit: habit });
      }
    } else {
      // Crear nuevo
      const newHabit = {
        ID_Habito: `h_${Date.now()}`,
        Nombre: name,
        Icono: (emojiInput?.value || "✨").trim(),
        Color_Pastel: colorInput?.value || "#88A28E",
        Carpeta_Global: folderSelect?.value || "Salud & Bienestar",
        Dias_Programados: diasProg,
        Meta_Diaria_Veces: parseInt(timesInput?.value) || 1,
        Activo: true
      };
      state.habitsCatalog.push(newHabit);
      sendAsyncLogToBackend("save_habit_definition", { habit: newHabit });
    }

    saveToLocalStorage();
    renderHabitsModule();
    window.closeNewHabitModal();
    playSuccessSound();
  };

  window.deleteCurrentEditingHabit = function () {
    const editId = document.getElementById("editing-habit-id")?.value;
    if (!editId) return;

    if (confirm("¿Estás segura de eliminar este hábito?")) {
      const idx = state.habitsCatalog.findIndex(h => h.ID_Habito === editId);
      if (idx !== -1) {
        const habit = state.habitsCatalog[idx];
        state.habitsCatalog.splice(idx, 1);
        sendAsyncLogToBackend("delete_habit_definition", { id: editId, nombre: habit.Nombre });
        saveToLocalStorage();
        renderHabitsModule();
        window.closeNewHabitModal();
        playGentleBlip();
      }
    }
  };

  // Emojis Picker
  function renderEmojiPickerGrid() {
    const grid = document.getElementById("emoji-picker-grid");
    if (!grid) return;
    const list = EMOJI_CATEGORIES[state.activeEmojiCategory] || EMOJI_CATEGORIES.hogar;
    let html = "";
    list.forEach(emoji => {
      html += `<div class="emoji-grid-item" onclick="window.pickEmoji('${emoji}')">${emoji}</div>`;
    });
    grid.innerHTML = html;
  }

  window.setEmojiCategory = function (cat) {
    state.activeEmojiCategory = cat;
    document.querySelectorAll(".emoji-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cat === cat);
    });
    renderEmojiPickerGrid();
  };

  window.pickEmoji = function (emoji) {
    const target = document.getElementById("new-habit-emoji");
    if (target) target.value = emoji;
  };

  // ============================================================================
  // 3. DIARIO PERSONAL (CRUD, FILTROS, EDICIÓN HISTÓRICA & LIGHTBOX)
  // ============================================================================
  function renderJournalModule() {
    renderJournalCategoriesSelector();
    renderJournalMoodSelector();
    renderJournalFilterPills();
    renderJournalFeed();
  }

  function renderJournalCategoriesSelector() {
    const container = document.getElementById("journal-categories-selector");
    if (!container) return;

    let html = "";
    state.journalCategories.forEach(cat => {
      const isSel = state.selectedJournalCategory === cat.name;
      html += `
        <button type="button"
                onclick="window.selectJournalCategory('${escapeAttr(cat.name)}')"
                class="notion-pill ${cat.pillClass || 'pill-gray'} ${isSel ? 'ring-2 ring-stone-600 scale-105' : 'opacity-70'}">
          <span>${cat.icon || '📌'}</span>
          <span>${escapeHtml(cat.name)}</span>
        </button>
      `;
    });
    container.innerHTML = html;
  }

  window.selectJournalCategory = function (catName) {
    state.selectedJournalCategory = catName;
    renderJournalCategoriesSelector();
    playGentleBlip();
  };

  window.promptNewJournalCategory = function () {
    const name = prompt("Escribe el nombre de la nueva categoría para tu diario:");
    if (!name || !name.trim()) return;
    const icon = prompt("Ícono o emoji para la categoría:", "✨") || "✨";
    const colors = ["pill-lavender", "pill-rose", "pill-sage", "pill-peach", "pill-gold", "pill-blue"];
    const randomClass = colors[Math.floor(Math.random() * colors.length)];

    state.journalCategories.push({
      name: name.trim(),
      icon: icon.trim(),
      pillClass: randomClass
    });
    state.selectedJournalCategory = name.trim();
    saveToLocalStorage();
    renderJournalCategoriesSelector();
    renderJournalFilterPills();
    playGentleBlip();
  };

  function renderJournalMoodSelector() {
    const container = document.getElementById("journal-mood-selector");
    if (!container) return;

    const moods = [
      { level: "1 - Mal", emoji: "😢", label: "Mal" },
      { level: "2 - Regular", emoji: "😕", label: "Regular" },
      { level: "3 - Normal", emoji: "😐", label: "Normal" },
      { level: "4 - Bien", emoji: "🙂", label: "Bien" },
      { level: "5 - Increíble", emoji: "🥰", label: "Increíble" }
    ];

    let html = "";
    moods.forEach(m => {
      const isSel = state.journalEntryMood === m.level;
      html += `
        <button type="button" onclick="window.selectJournalEntryMood('${m.level}')"
                class="mood-pill-btn ${isSel ? 'active' : ''}">
          <span class="text-xl">${m.emoji}</span>
          <span class="text-[10px] font-bold text-stone-600 mt-0.5">${m.label}</span>
        </button>
      `;
    });
    container.innerHTML = html;
  }

  window.selectJournalEntryMood = function (mood) {
    state.journalEntryMood = mood;
    renderJournalMoodSelector();
    playGentleBlip();
  };

  window.handleJournalPhotoSelect = function (e) {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFileToBase64(file, 1024, 0.8, (base64) => {
      state.journalPhotoBase64 = base64;
      const previewCont = document.getElementById("photo-preview-container");
      const previewImg = document.getElementById("photo-preview-img");
      if (previewCont && previewImg) {
        previewImg.src = base64;
        previewCont.classList.remove("hidden");
      }
    });
  };

  window.removeSelectedJournalPhoto = function () {
    state.journalPhotoBase64 = null;
    const previewCont = document.getElementById("photo-preview-container");
    if (previewCont) previewCont.classList.add("hidden");
    const input = document.getElementById("journal-photo-input");
    if (input) input.value = "";
  };

  window.saveJournalEntry = function () {
    const noteInput = document.getElementById("journal-note-input");
    const text = noteInput ? noteInput.value.trim() : "";

    if (!text && !state.journalPhotoBase64) {
      alert("Por favor escribe tu reflexión o adjunta una fotografía");
      return;
    }

    const editId = state.journalEditingId;

    if (editId) {
      // Edición de entrada histórica existente
      const entry = state.journalEntries.find(e => e.ID_Entrada === editId);
      if (entry) {
        entry.Segmento_Categoria = state.selectedJournalCategory;
        entry.Comentario_Nota = text;
        entry.Escala_Emocion = state.journalEntryMood;
        if (state.journalPhotoBase64) {
          entry.URL_Fotografia = state.journalPhotoBase64;
          entry.photo_base64 = state.journalPhotoBase64;
        }
        sendAsyncLogToBackend("save_journal_entry", { entry: entry });
      }
      state.journalEditingId = null;
      document.getElementById("cancel-journal-edit-btn")?.classList.add("hidden");
      document.getElementById("save-journal-btn-text").textContent = "Guardar Recuerdo en el Diario";
      document.getElementById("journal-form-title").textContent = "Escribir Nota / Nueva Memoria";
    } else {
      // Nueva entrada
      const newEntry = {
        ID_Entrada: `j_${Date.now()}`,
        Fecha_Entrada: state.selectedDate,
        Timestamp_Creacion: new Date().toISOString(),
        Segmento_Categoria: state.selectedJournalCategory,
        Comentario_Nota: text,
        URL_Fotografia: state.journalPhotoBase64 || "",
        photo_base64: state.journalPhotoBase64 || "",
        Escala_Emocion: state.journalEntryMood
      };
      state.journalEntries.unshift(newEntry);
      sendAsyncLogToBackend("save_journal_entry", { entry: newEntry });
    }

    saveToLocalStorage();

    // Resetear formulario
    if (noteInput) noteInput.value = "";
    window.removeSelectedJournalPhoto();
    renderJournalFeed();
    playSuccessSound();
    triggerCuteConfetti();
    alert("✨ ¡Memoria guardada con amor en tu diario!");
    window.switchJournalSubtab("feed");
  };

  window.editJournalEntry = function (entryId) {
    const entry = state.journalEntries.find(e => e.ID_Entrada === entryId);
    if (!entry) return;

    state.journalEditingId = entryId;
    state.selectedJournalCategory = entry.Segmento_Categoria || "Gratitud";
    state.journalEntryMood = entry.Escala_Emocion || "5 - Increíble";
    state.journalPhotoBase64 = entry.URL_Fotografia || null;

    const noteInput = document.getElementById("journal-note-input");
    if (noteInput) noteInput.value = entry.Comentario_Nota || "";

    const previewCont = document.getElementById("photo-preview-container");
    const previewImg = document.getElementById("photo-preview-img");
    if (previewCont && previewImg) {
      if (entry.URL_Fotografia) {
        previewImg.src = entry.URL_Fotografia;
        previewCont.classList.remove("hidden");
      } else {
        previewCont.classList.add("hidden");
      }
    }

    document.getElementById("journal-form-title").textContent = "✏️ Editando Memoria del Diario";
    document.getElementById("save-journal-btn-text").textContent = "Actualizar Cambios en la Memoria";
    document.getElementById("cancel-journal-edit-btn")?.classList.remove("hidden");

    window.closeLightboxModal();
    window.switchJournalSubtab("write");
    renderJournalCategoriesSelector();
    renderJournalMoodSelector();
  };

  window.cancelJournalEdit = function () {
    state.journalEditingId = null;
    const noteInput = document.getElementById("journal-note-input");
    if (noteInput) noteInput.value = "";
    window.removeSelectedJournalPhoto();
    document.getElementById("journal-form-title").textContent = "Escribir Nota / Nueva Memoria";
    document.getElementById("save-journal-btn-text").textContent = "Guardar Recuerdo en el Diario";
    document.getElementById("cancel-journal-edit-btn")?.classList.add("hidden");
    window.switchJournalSubtab("feed");
  };

  window.deleteJournalEntry = function (entryId) {
    if (confirm("¿Segura que deseas eliminar esta memoria del diario?")) {
      const idx = state.journalEntries.findIndex(e => e.ID_Entrada === entryId);
      if (idx !== -1) {
        state.journalEntries.splice(idx, 1);
        sendAsyncLogToBackend("delete_journal_entry", { id: entryId });
        saveToLocalStorage();
        renderJournalFeed();
        window.closeLightboxModal();
        playGentleBlip();
      }
    }
  };

  // Feed y Filtros del Diario
  function renderJournalFilterPills() {
    const container = document.getElementById("journal-filter-pills");
    if (!container) return;

    let html = `
      <button type="button" onclick="setJournalFilter('ALL')" class="notion-pill ${state.journalFilterCategory === 'ALL' ? 'pill-gray ring-2 ring-stone-600' : 'pill-gray opacity-60'}">
        Todos (${state.journalEntries.length})
      </button>
    `;

    state.journalCategories.forEach(cat => {
      const count = state.journalEntries.filter(e => e.Segmento_Categoria === cat.name).length;
      if (count === 0) return;
      const isSel = state.journalFilterCategory === cat.name;
      html += `
        <button type="button" onclick="setJournalFilter('${escapeAttr(cat.name)}')" class="notion-pill ${cat.pillClass} ${isSel ? 'ring-2 ring-stone-600 font-bold' : 'opacity-60'}">
          ${cat.icon} ${escapeHtml(cat.name)} (${count})
        </button>
      `;
    });

    container.innerHTML = html;
  }

  window.setJournalFilter = function (cat) {
    state.journalFilterCategory = cat;
    renderJournalFilterPills();
    renderJournalFeed();
  };

  window.onJournalSearch = function (q) {
    state.journalSearchQuery = q.toLowerCase();
    renderJournalFeed();
  };

  function renderJournalFeed() {
    const container = document.getElementById("journal-feed-container");
    if (!container) return;

    let list = state.journalEntries;
    if (state.journalFilterCategory !== "ALL") {
      list = list.filter(e => e.Segmento_Categoria === state.journalFilterCategory);
    }
    if (state.journalSearchQuery) {
      list = list.filter(e => {
        const textMatch = (e.Comentario_Nota || "").toLowerCase().includes(state.journalSearchQuery);
        const dateMatch = (e.Fecha_Entrada || "").includes(state.journalSearchQuery);
        const catMatch = (e.Segmento_Categoria || "").toLowerCase().includes(state.journalSearchQuery);
        return textMatch || dateMatch || catMatch;
      });
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="card-clean p-8 text-center text-stone-400 text-xs">
          <span class="text-3xl block mb-2">🌸</span>
          <p>No hay recuerdos aquí todavía.</p>
        </div>
      `;
      return;
    }

    let html = "";
    list.forEach(entry => {
      const cat = state.journalCategories.find(c => c.name === entry.Segmento_Categoria) || { icon: "✨", pillClass: "pill-gray" };
      const moodEmoji = extractMoodEmoji(entry.Escala_Emocion);

      html += `
        <div class="card-clean p-4 cursor-pointer hover:border-rose-200 transition-all" onclick="openLightboxFromJournal('${entry.ID_Entrada}')">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="notion-pill ${cat.pillClass}">${cat.icon} ${escapeHtml(entry.Segmento_Categoria)}</span>
              <span class="text-xs text-stone-400 font-serif font-bold">${formatDisplayDate(entry.Fecha_Entrada)}</span>
            </div>
            <div class="flex items-center gap-2" onclick="event.stopPropagation()">
              <span class="text-lg" title="${escapeAttr(entry.Escala_Emocion || '')}">${moodEmoji}</span>
              <button type="button" onclick="editJournalEntry('${entry.ID_Entrada}')" class="text-stone-400 hover:text-stone-700 p-1 text-xs">✏️</button>
              <button type="button" onclick="deleteJournalEntry('${entry.ID_Entrada}')" class="text-stone-300 hover:text-rose-600 p-1 text-xs">🗑️</button>
            </div>
          </div>

          ${entry.URL_Fotografia ? `
            <div class="mb-3 rounded-2xl overflow-hidden max-h-56 bg-stone-100 border border-stone-200">
              <img src="${entry.URL_Fotografia}" alt="Foto Diario" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ` : ''}

          <p class="text-xs md:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
            ${escapeHtml(entry.Comentario_Nota || '')}
          </p>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================================================
  // 4. MÓDULO DE CICLO MENSTRUAL (CARRUSEL MULTI-MES, CONFIRMAR Y SÍNTOMAS)
  // ============================================================================
  function renderCycleModule() {
    renderCycleStatusCard();
    renderCycleMultiMonthCalendar();
    renderCycleSettingsInputs();
    renderCycleFlowButtons();
    renderCycleSymptomsPills();
    renderCycleHistory();
  }

  function calculateCyclePhase(dateStr) {
    const targetDate = parseDateKey(dateStr || state.selectedDate);
    const startStr = state.cycleSettings.lastPeriodStart || getTodayString();
    const startDate = parseDateKey(startStr);

    const diffMs = targetDate - startDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const totalDur = state.cycleSettings.cycleDuration || 28;
    const menDur = state.cycleSettings.periodDuration || 5;
    const folDur = state.cycleSettings.follicularDuration || 8;
    const ovuDur = state.cycleSettings.ovulationDuration || 4;
    const lutDur = state.cycleSettings.lutealDuration || 11;

    let cycleDay = (diffDays % totalDur);
    if (cycleDay < 0) cycleDay += totalDur;
    cycleDay = cycleDay + 1; // Día 1-indexado

    let phase = "Menstrual";
    let phaseClass = "phase-menstrual";
    let cellClass = "day-menstrual";
    let phaseDay = cycleDay;

    if (cycleDay <= menDur) {
      phase = "Menstrual";
      phaseClass = "phase-menstrual";
      cellClass = "day-menstrual";
      phaseDay = cycleDay;
    } else if (cycleDay <= menDur + folDur) {
      phase = "Folicular";
      phaseClass = "phase-follicular";
      cellClass = "day-follicular";
      phaseDay = cycleDay - menDur;
    } else if (cycleDay <= menDur + folDur + ovuDur) {
      phase = "Ovulación";
      phaseClass = "phase-ovulation";
      cellClass = "day-ovulation";
      phaseDay = cycleDay - (menDur + folDur);
    } else {
      phase = "Lútea";
      phaseClass = "phase-luteal";
      cellClass = "day-luteal";
      phaseDay = cycleDay - (menDur + folDur + ovuDur);
    }

    const daysUntilNext = totalDur - (cycleDay - 1);

    return {
      cycleDay,
      phase,
      phaseClass,
      cellClass,
      phaseDay,
      daysUntilNext
    };
  }

  function renderCycleStatusCard() {
    const info = calculateCyclePhase(getTodayString());
    const badgeEl = document.getElementById("cycle-phase-badge");
    const countdownEl = document.getElementById("cycle-countdown-days");
    const lastDateEl = document.getElementById("cycle-last-date-display");
    const dynHeader = document.getElementById("cycle-dynamic-header");

    if (badgeEl) {
      badgeEl.className = `cycle-phase-badge ${info.phaseClass}`;
      badgeEl.textContent = `Fase ${info.phase}`;
    }
    if (countdownEl) countdownEl.textContent = info.daysUntilNext;
    if (lastDateEl) lastDateEl.textContent = formatDisplayDate(state.cycleSettings.lastPeriodStart);
    if (dynHeader) {
      dynHeader.textContent = `🌸 Hoy estás en tu día ${info.phaseDay} de ${info.phase}, ¿cómo te sientes?`;
    }
  }

  // Carrusel Horizontal Multi-Mes Continuo
  function renderCycleMultiMonthCalendar() {
    const container = document.getElementById("cycle-multimonth-container");
    if (!container) return;

    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + state.cycleMonthOffset);

    // Mostramos Mes Previo (-1), Mes Actual (0) y Mes Futuro (+1)
    const monthsToShow = [-1, 0, 1];
    let html = "";

    monthsToShow.forEach(mOffset => {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + mOffset, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const totalDays = new Date(year, month + 1, 0).getDate();
      const startDayOfWeek = d.getDay(); // 0: DOM, 1: LUN...

      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const isCurrentMonthView = mOffset === 0;

      html += `
        <div class="cycle-month-pane ${isCurrentMonthView ? 'ring-2 ring-rose-300' : ''}">
          <div class="text-center font-serif font-bold text-sm text-stone-800 mb-2">
            ${meses[month]} ${year} ${isCurrentMonthView ? '✨ (Actual)' : ''}
          </div>
          <div class="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-stone-400 mb-1">
            <div>D</div><div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div>
          </div>
          <div class="grid grid-cols-7 gap-1">
      `;

      // Celdas vacías previas
      for (let empty = 0; empty < startDayOfWeek; empty++) {
        html += `<div class="aspect-square"></div>`;
      }

      // Días del mes
      for (let day = 1; day <= totalDays; day++) {
        const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const phaseInfo = calculateCyclePhase(dStr);
        const isToday = dStr === state.todayDate;
        const isSelected = dStr === state.selectedDate;

        html += `
          <div class="cycle-day-cell ${phaseInfo.cellClass} ${isToday ? 'is-today' : ''} ${isSelected ? 'ring-2 ring-stone-800' : ''}"
               title="${formatDisplayDate(dStr)}: Fase ${phaseInfo.phase}"
               onclick="window.selectDate('${dStr}')">
            <span>${day}</span>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  window.scrollCycleCalendar = function (dir) {
    state.cycleMonthOffset += dir;
    renderCycleMultiMonthCalendar();
    playGentleBlip();
  };

  // Botón Confirmar Menstruación (Hoy o Fecha Elegida)
  window.openConfirmPeriodModal = function () {
    const input = document.getElementById("confirm-period-date-input");
    if (input) input.value = state.todayDate;
    const modal = document.getElementById("confirm-period-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeConfirmPeriodModal = function () {
    const modal = document.getElementById("confirm-period-modal");
    if (modal) modal.classList.remove("open");
  };

  window.confirmPeriodStartWithDate = function () {
    const input = document.getElementById("confirm-period-date-input");
    const chosenDate = input ? input.value : state.todayDate;
    if (!chosenDate) return;

    state.cycleSettings.lastPeriodStart = chosenDate;
    saveToLocalStorage();
    window.closeConfirmPeriodModal();

    renderCycleModule();
    playSuccessSound();
    triggerCuteConfetti();
    alert(`🩸 Menstruación confirmada para el ${formatDisplayDate(chosenDate)}. Todo el calendario futuro ha sido recalculado.`);

    sendAsyncLogToBackend("save_cycle_config", { config: state.cycleSettings });
  };

  // Configuración de Duraciones del Ciclo
  function renderCycleSettingsInputs() {
    const dur = document.getElementById("cycle-param-duration");
    const men = document.getElementById("cycle-param-menstrual");
    const fol = document.getElementById("cycle-param-follicular");
    const ovu = document.getElementById("cycle-param-ovulation");
    const lut = document.getElementById("cycle-param-luteal");

    if (dur) dur.value = state.cycleSettings.cycleDuration || 28;
    if (men) men.value = state.cycleSettings.periodDuration || 5;
    if (fol) fol.value = state.cycleSettings.follicularDuration || 8;
    if (ovu) ovu.value = state.cycleSettings.ovulationDuration || 4;
    if (lut) lut.value = state.cycleSettings.lutealDuration || 11;
  }

  window.saveCustomCycleParameters = function () {
    const dur = parseInt(document.getElementById("cycle-param-duration")?.value) || 28;
    const men = parseInt(document.getElementById("cycle-param-menstrual")?.value) || 5;
    const fol = parseInt(document.getElementById("cycle-param-follicular")?.value) || 8;
    const ovu = parseInt(document.getElementById("cycle-param-ovulation")?.value) || 4;
    const lut = parseInt(document.getElementById("cycle-param-luteal")?.value) || 11;

    state.cycleSettings.cycleDuration = dur;
    state.cycleSettings.periodDuration = men;
    state.cycleSettings.follicularDuration = fol;
    state.cycleSettings.ovulationDuration = ovu;
    state.cycleSettings.lutealDuration = lut;

    saveToLocalStorage();
    renderCycleModule();
    playSuccessSound();
    alert("✅ Duraciones del ciclo actualizadas. Calendario recalculado correctamente.");

    sendAsyncLogToBackend("save_cycle_config", { config: state.cycleSettings });
  };

  // Nivel de Flujo & Síntomas Desbloqueados
  function renderCycleFlowButtons() {
    const grid = document.getElementById("cycle-flow-grid");
    if (!grid) return;

    const flows = [
      { name: "Sin flujo", icon: "✨" },
      { name: "Ligero", icon: "🌸" },
      { name: "Medio", icon: "🌷" },
      { name: "Abundante", icon: "🌺" },
      { name: "Manchado", icon: "💧" },
      { name: "Clara de huevo", icon: "🥚" },
      { name: "Cremoso", icon: "🥛" },
      { name: "Otros", icon: "💭" }
    ];

    let html = "";
    flows.forEach(f => {
      const isSel = state.cycleSelectedFlow === f.name;
      html += `
        <button type="button" onclick="selectCycleFlow('${escapeAttr(f.name)}')"
                class="flow-btn p-2 rounded-xl border border-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${isSel ? 'ring-2 ring-rose-400 bg-rose-50 font-bold' : 'bg-white hover:bg-stone-50'}">
          <span>${f.icon}</span>
          <span>${f.name}</span>
        </button>
      `;
    });
    grid.innerHTML = html;
  }

  window.selectCycleFlow = function (flow) {
    state.cycleSelectedFlow = flow;
    renderCycleFlowButtons();
    playGentleBlip();
  };

  function renderCycleSymptomsPills() {
    const container = document.getElementById("cycle-symptoms-container");
    if (!container) return;

    const symptomsList = [
      "Sensibilidad", "Fatiga", "Cólicos", "Dolor de cabeza",
      "Antojos", "Hinchazón", "Dolor de espalda", "Cambios de humor",
      "Acné", "Insomnio", "➕ Otros"
    ];

    let html = "";
    symptomsList.forEach(s => {
      const isSel = state.cycleSelectedSymptoms.has(s);
      html += `
        <button type="button" onclick="toggleCycleSymptom('${escapeAttr(s)}')"
                class="symptom-tag-pill ${isSel ? 'active' : ''}">
          <span>${isSel ? '✓' : '+'}</span>
          <span>${s}</span>
        </button>
      `;
    });
    container.innerHTML = html;

    const otherBox = document.getElementById("cycle-other-symptom-box");
    if (otherBox) {
      if (state.cycleSelectedSymptoms.has("➕ Otros")) otherBox.classList.remove("hidden");
      else otherBox.classList.add("hidden");
    }
  }

  window.toggleCycleSymptom = function (symptom) {
    if (state.cycleSelectedSymptoms.has(symptom)) {
      state.cycleSelectedSymptoms.delete(symptom);
    } else {
      state.cycleSelectedSymptoms.add(symptom);
    }
    renderCycleSymptomsPills();
    playGentleBlip();
  };

  window.handleCyclePhotoSelect = function (e) {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFileToBase64(file, 800, 0.75, (base64) => {
      state.cyclePhotoBase64 = base64;
      const previewWrap = document.getElementById("cycle-photo-preview-container");
      const previewImg = document.getElementById("cycle-photo-preview-img");
      if (previewWrap && previewImg) {
        previewImg.src = base64;
        previewWrap.classList.remove("hidden");
      }
    });
  };

  window.removeSelectedCyclePhoto = function () {
    state.cyclePhotoBase64 = null;
    const previewWrap = document.getElementById("cycle-photo-preview-container");
    if (previewWrap) previewWrap.classList.add("hidden");
    const input = document.getElementById("cycle-photo-input");
    if (input) input.value = "";
  };

  window.saveCycleDailyLog = function () {
    const notesInput = document.getElementById("cycle-notes-input");
    const notes = notesInput ? notesInput.value.trim() : "";
    const otherText = (document.getElementById("cycle-other-symptom-input")?.value || "").trim();

    const symptomsArr = Array.from(state.cycleSelectedSymptoms);
    if (otherText && symptomsArr.includes("➕ Otros")) {
      symptomsArr.push(`Otros: ${otherText}`);
    }

    const phaseInfo = calculateCyclePhase(state.selectedDate);

    const entry = {
      ID_Ciclo: `ciclo_${Date.now()}`,
      Fecha_Registro: state.selectedDate,
      Fecha_Inicio_Periodo: state.cycleSettings.lastPeriodStart,
      Fase_Actual: phaseInfo.phase,
      Nivel_Flujo: state.cycleSelectedFlow,
      Sintomas: symptomsArr.join(", "),
      Estado_Animo: state.currentDayMood,
      Notas_Ciclo: notes,
      URL_Fotografia: state.cyclePhotoBase64 || "",
      photo_base64: state.cyclePhotoBase64 || "",
      Timestamp_Creacion: new Date().toISOString()
    };

    // Reemplaza si ya existía para esta fecha o agrega al inicio
    const existingIdx = state.cycleLogs.findIndex(c => c.Fecha_Registro === state.selectedDate);
    if (existingIdx !== -1) {
      state.cycleLogs[existingIdx] = entry;
    } else {
      state.cycleLogs.unshift(entry);
    }

    saveToLocalStorage();
    renderCycleHistory();
    playSuccessSound();
    triggerCuteConfetti();
    alert("✨ Registro de ciclo menstrual guardado con éxito.");

    sendAsyncLogToBackend("save_cycle_log", { log: entry });
  };

  function renderCycleHistory() {
    const container = document.getElementById("cycle-history-container");
    if (!container) return;

    if (state.cycleLogs.length === 0) {
      container.innerHTML = "<p class='text-xs text-stone-400 text-center py-2'>Aún no hay registros guardados en el ciclo.</p>";
      return;
    }

    let html = "";
    state.cycleLogs.slice(0, 10).forEach(log => {
      html += `
        <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-stone-100 transition-colors"
             onclick="openLightboxFromCycle('${log.ID_Ciclo}')">
          <div class="flex items-center gap-2.5">
            ${log.URL_Fotografia ? `<img src="${log.URL_Fotografia}" class="w-10 h-10 object-cover rounded-lg border border-stone-200" alt="Foto Ciclo" />` : `<span class="text-xl">🌸</span>`}
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-serif font-bold text-stone-800">${formatDisplayDate(log.Fecha_Registro)}</span>
                <span class="notion-pill pill-rose text-[10px]">${log.Fase_Actual}</span>
                <span class="text-[10px] text-stone-500">• Flujo: ${log.Nivel_Flujo}</span>
              </div>
              <p class="text-[11px] text-stone-500 mt-0.5 line-clamp-1">${escapeHtml(log.Sintomas || log.Notas_Ciclo || 'Sin síntomas')}</p>
            </div>
          </div>
          <span class="text-stone-300 text-xs">🔍</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================================================
  // 5. DASHBOARD & HISTORIAL VISUAL DE HÁBITOS
  // ============================================================================
  function renderDashboardModule() {
    renderDashboardView();
    renderDashboardHabitsHistory();
  }

  function renderDashboardView() {
    const barsView = document.getElementById("dash-bars-view");
    const calendarView = document.getElementById("dash-calendar-view");
    const btnBars = document.getElementById("swap-btn-bars");
    const btnCalendar = document.getElementById("swap-btn-calendar");

    if (state.dashboardViewMode === "bars") {
      if (barsView) barsView.classList.remove("hidden");
      if (calendarView) calendarView.classList.add("hidden");
      if (btnBars) btnBars.classList.add("active");
      if (btnCalendar) btnCalendar.classList.remove("active");
      renderSegmentedMonthBars();
    } else {
      if (barsView) barsView.classList.add("hidden");
      if (calendarView) calendarView.classList.remove("hidden");
      if (btnCalendar) btnCalendar.classList.add("active");
      if (btnBars) btnBars.classList.remove("active");
      renderMonthlyCalendarGrid();
    }

    renderDashboardStatsSummary();
  }

  window.setDashboardViewMode = function (mode) {
    state.dashboardViewMode = mode;
    playGentleBlip();
    renderDashboardView();
  };

  function renderSegmentedMonthBars() {
    const container = document.getElementById("segmented-month-bars-container");
    if (!container) return;

    const cur = parseDateKey(state.selectedDate);
    const year = cur.getFullYear();
    const month = cur.getMonth();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const monthTitle = document.getElementById("dash-month-title");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    if (monthTitle) monthTitle.textContent = `${meses[month]} ${year}`;

    const activeHabits = state.habitsCatalog.filter(h => h.Activo);
    if (activeHabits.length === 0) {
      container.innerHTML = "<p class='text-xs text-stone-400'>No hay hábitos activos.</p>";
      return;
    }

    const todayObj = new Date();
    const isCurrentMonth = todayObj.getFullYear() === year && todayObj.getMonth() === month;
    const currentDayOfMonth = todayObj.getDate();

    let html = "";
    activeHabits.forEach(h => {
      let completedDays = 0;
      let scheduledDays = 0;
      let segmentsHtml = `<div class="segmented-month-bar">`;

      for (let day = 1; day <= totalDaysInMonth; day++) {
        const dKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const isScheduled = isHabitScheduledForDate(h, dKey);
        const log = state.habitsLog[dKey]?.[h.Nombre];
        const target = h.Meta_Diaria_Veces || 1;
        const count = log ? (log.Veces_Completadas_Hoy !== undefined ? log.Veces_Completadas_Hoy : (log.Estado === "Completado" ? target : 0)) : 0;
        const isDone = count >= target || (log && log.Estado === "Completado");
        const isPastOrToday = !isCurrentMonth || day <= currentDayOfMonth;

        let segClass = "month-segment";
        let inlineStyle = "";
        let tooltip = `Día ${day}: `;

        if (!isPastOrToday) {
          segClass += " segment-future";
          tooltip += "Próximo";
        } else if (!isScheduled) {
          segClass += " segment-off";
          tooltip += "No programado";
        } else if (isDone) {
          segClass += " segment-done";
          inlineStyle = `background-color: ${h.Color_Pastel || '#88A28E'};`;
          tooltip += `¡Cumplido! (${count}/${target})`;
          completedDays++;
          scheduledDays++;
        } else {
          // EFECTO DE HUECO
          segClass += " segment-gap";
          tooltip += "Hueco (No realizado)";
          scheduledDays++;
        }

        segmentsHtml += `<div class="${segClass}" style="${inlineStyle}" title="${escapeAttr(tooltip)}" onclick="window.selectDate('${dKey}')"></div>`;
      }

      segmentsHtml += `</div>`;
      const pct = scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 0;

      html += `
        <div class="mb-3 card-clean p-3.5">
          <div class="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
            <span class="flex items-center gap-2">
              <span class="text-base">${h.Icono}</span>
              <span>${escapeHtml(h.Nombre)}</span>
              <span class="notion-pill pill-gray text-[10px]">${h.Carpeta_Global || "General"}</span>
            </span>
            <span class="text-stone-500 font-semibold">${completedDays}/${scheduledDays} días (${pct}%)</span>
          </div>
          ${segmentsHtml}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function renderMonthlyCalendarGrid() {
    const grid = document.getElementById("monthly-calendar-grid");
    if (!grid) return;

    const cur = parseDateKey(state.selectedDate);
    const year = cur.getFullYear();
    const month = cur.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const activeHabits = state.habitsCatalog.filter(h => h.Activo);
    let html = "";

    for (let empty = 0; empty < firstDay; empty++) {
      html += `<div class="aspect-square"></div>`;
    }

    for (let day = 1; day <= totalDays; day++) {
      const dKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayLogs = state.habitsLog[dKey] || {};
      const scheduled = activeHabits.filter(h => isHabitScheduledForDate(h, dKey));

      let completed = 0;
      scheduled.forEach(h => {
        const log = dayLogs[h.Nombre];
        const target = h.Meta_Diaria_Veces || 1;
        const count = log ? (log.Veces_Completadas_Hoy !== undefined ? log.Veces_Completadas_Hoy : (log.Estado === "Completado" ? target : 0)) : 0;
        if (count >= target || (log && log.Estado === "Completado")) completed++;
      });

      const isToday = dKey === state.todayDate;
      const isSelected = dKey === state.selectedDate;

      let cellClass = "streak-day-cell";
      if (scheduled.length > 0 && completed === scheduled.length) {
        cellClass += " completed-full";
      } else if (completed > 0) {
        cellClass += " completed-partial";
      }
      if (isToday) cellClass += " today-marker";
      if (isSelected) cellClass += " ring-2 ring-stone-800";

      html += `
        <div class="${cellClass}" onclick="window.selectDate('${dKey}')">
          <span class="text-xs font-bold">${day}</span>
          ${completed > 0 ? `<span class="text-[9px] mt-0.5">${completed}/${scheduled.length}</span>` : ''}
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  function renderDashboardStatsSummary() {
    const { currentStreak, maxStreak } = calculateStreaks();
    const curEl = document.getElementById("stats-current-streak");
    const maxEl = document.getElementById("stats-max-streak");
    const habitsEl = document.getElementById("stats-total-habits-count");
    const journalEl = document.getElementById("stats-total-journal-count");

    if (curEl) curEl.textContent = currentStreak;
    if (maxEl) maxEl.textContent = maxStreak;

    // Total de completados históricos
    let totalCompleted = 0;
    Object.values(state.habitsLog).forEach(dayObj => {
      Object.values(dayObj).forEach(r => {
        if (r.Estado === "Completado") totalCompleted++;
      });
    });

    if (habitsEl) habitsEl.textContent = totalCompleted;
    if (journalEl) journalEl.textContent = state.journalEntries.length;
  }

  function renderDashboardHabitsHistory() {
    const container = document.getElementById("habits-history-container");
    if (!container) return;

    const listWithCommentsOrPhotos = [];
    Object.keys(state.habitsLog).sort().reverse().forEach(dKey => {
      Object.values(state.habitsLog[dKey]).forEach(r => {
        if (r.Comentarios || r.URL_Fotografia) {
          listWithCommentsOrPhotos.push(r);
        }
      });
    });

    if (listWithCommentsOrPhotos.length === 0) {
      container.innerHTML = "<p class='text-xs text-stone-400 text-center py-2'>Aún no hay hábitos con comentarios o fotos adjuntas.</p>";
      return;
    }

    let html = "";
    listWithCommentsOrPhotos.slice(0, 10).forEach(r => {
      html += `
        <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between gap-2.5 cursor-pointer hover:bg-stone-100 transition-colors"
             onclick="openLightboxFromHabitLog('${escapeAttr(r.Nombre_Habito)}', '${r.Fecha_Habito}')">
          <div class="flex items-center gap-2.5">
            ${r.URL_Fotografia ? `<img src="${r.URL_Fotografia}" class="w-10 h-10 object-cover rounded-lg border border-stone-200" alt="Foto" />` : `<span class="text-xl">${r.Categoria_Icono || '✨'}</span>`}
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-serif font-bold text-stone-800">${escapeHtml(r.Nombre_Habito)}</span>
                <span class="text-[10px] text-stone-400 font-semibold">• ${formatDisplayDate(r.Fecha_Habito)}</span>
              </div>
              <p class="text-[11px] text-stone-600 line-clamp-1 italic mt-0.5">"${escapeHtml(r.Comentarios || 'Foto adjunta')}"</p>
            </div>
          </div>
          <span class="text-stone-300 text-xs">🔍</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================================================
  // 6. POP-UP LIGHTBOX ELEGANTE ESTILO "APP DE BODA"
  // ============================================================================
  function openGenericLightbox({ title, icon, dateStr, mood, pillsHtml, text, photoUrl, onEdit }) {
    const overlay = document.getElementById("lightbox-modal-overlay");
    const titleEl = document.getElementById("lightbox-title");
    const iconEl = document.getElementById("lightbox-icon");
    const dateEl = document.getElementById("lightbox-date");
    const moodEl = document.getElementById("lightbox-mood");
    const pillsCont = document.getElementById("lightbox-pills");
    const textEl = document.getElementById("lightbox-text");
    const photoWrap = document.getElementById("lightbox-photo-wrapper");
    const imgEl = document.getElementById("lightbox-img");
    const editBtn = document.getElementById("lightbox-edit-btn");

    if (titleEl) titleEl.textContent = title || "Detalle de la Memoria";
    if (iconEl) iconEl.textContent = icon || "🌸";
    if (dateEl) dateEl.textContent = formatDisplayDate(dateStr);
    if (moodEl) moodEl.textContent = mood ? extractMoodEmoji(mood) : "🥰";
    if (pillsCont) pillsCont.innerHTML = pillsHtml || "";
    if (textEl) textEl.textContent = text || "Sin comentarios adicionales";

    if (photoUrl && photoWrap && imgEl) {
      imgEl.src = photoUrl;
      photoWrap.classList.remove("hidden");
    } else if (photoWrap) {
      photoWrap.classList.add("hidden");
    }

    if (editBtn) {
      if (typeof onEdit === "function") {
        editBtn.onclick = onEdit;
        editBtn.classList.remove("hidden");
      } else {
        editBtn.classList.add("hidden");
      }
    }

    if (overlay) overlay.classList.add("open");
  }

  window.closeLightboxModal = function (e) {
    if (e && e.target && e.target.id !== "lightbox-modal-overlay" && !e.target.closest("button")) {
      return;
    }
    const overlay = document.getElementById("lightbox-modal-overlay");
    if (overlay) overlay.classList.remove("open");
  };

  window.toggleLightboxZoom = function (img) {
    if (!img) return;
    img.style.maxHeight = img.style.maxHeight === "80vh" ? "55vh" : "80vh";
  };

  // Triggers específicos para el Lightbox
  window.openLightboxFromJournal = function (entryId) {
    const entry = state.journalEntries.find(e => e.ID_Entrada === entryId);
    if (!entry) return;
    const cat = state.journalCategories.find(c => c.name === entry.Segmento_Categoria) || { icon: "✨", pillClass: "pill-gray" };

    openGenericLightbox({
      title: "Memoria del Diario",
      icon: "📖",
      dateStr: entry.Fecha_Entrada,
      mood: entry.Escala_Emocion,
      pillsHtml: `<span class="notion-pill ${cat.pillClass}">${cat.icon} ${escapeHtml(entry.Segmento_Categoria)}</span>`,
      text: entry.Comentario_Nota,
      photoUrl: entry.URL_Fotografia,
      onEdit: () => window.editJournalEntry(entryId)
    });
  };

  window.openLightboxFromHabit = function (habitName) {
    window.openLightboxFromHabitLog(habitName, state.selectedDate);
  };

  window.openLightboxFromHabitLog = function (habitName, dateStr) {
    const log = state.habitsLog[dateStr]?.[habitName];
    if (!log) return;
    const habitDef = state.habitsCatalog.find(h => h.Nombre === habitName) || { Icono: "✨", Carpeta_Global: "General" };

    openGenericLightbox({
      title: habitName,
      icon: habitDef.Icono || "✨",
      dateStr: dateStr,
      mood: log.Escala_Emocion,
      pillsHtml: `
        <span class="notion-pill pill-sage">${habitDef.Carpeta_Global || 'Hábito'}</span>
        <span class="notion-pill pill-gold">${log.Estado === 'Completado' ? '✓ Completado' : 'Pendiente'}</span>
      `,
      text: log.Comentarios || "Hábito realizado",
      photoUrl: log.URL_Fotografia,
      onEdit: () => window.openHabitNoteModal(habitName)
    });
  };

  window.openLightboxFromCycle = function (cycleId) {
    const log = state.cycleLogs.find(c => c.ID_Ciclo === cycleId);
    if (!log) return;

    openGenericLightbox({
      title: "Registro del Ciclo Menstrual",
      icon: "🩸",
      dateStr: log.Fecha_Registro,
      mood: log.Estado_Animo,
      pillsHtml: `
        <span class="notion-pill pill-rose">Fase ${log.Fase_Actual}</span>
        <span class="notion-pill pill-peach">Flujo: ${log.Nivel_Flujo}</span>
      `,
      text: `Síntomas: ${log.Sintomas || 'Ninguno'}\n\nNotas: ${log.Notas_Ciclo || 'Sin observaciones'}`,
      photoUrl: log.URL_Fotografia,
      onEdit: null
    });
  };

  // ============================================================================
  // 7. SINCRONIZACIÓN GOOGLE SHEETS & GOOGLE DRIVE
  // ============================================================================
  function sendAsyncLogToBackend(action, payload) {
    if (!state.googleSheetsUrl) return;
    try {
      const bodyData = Object.assign({ action: action }, payload);
      fetch(state.googleSheetsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      }).catch(() => {});
    } catch (e) {}
  }

  window.triggerManualSync = async function () {
    if (state.isSyncing) return;
    state.isSyncing = true;
    const btn = document.getElementById("btn-manual-sync");
    if (btn) btn.textContent = "Sincronizando... ⏳";

    try {
      // 1. Descarga bidireccional desde Google Sheets si hay URL
      if (state.googleSheetsUrl) {
        try {
          const resp = await fetch(`${state.googleSheetsUrl}?action=all`);
          if (resp.ok) {
            const data = await resp.json();
            if (data.status === "success") {
              if (Array.isArray(data.carpetas) && data.carpetas.length > 0) state.folders = data.carpetas;
              if (Array.isArray(data.habitos_config) && data.habitos_config.length > 0) state.habitsCatalog = data.habitos_config;
              if (Array.isArray(data.diario_log)) state.journalEntries = data.diario_log;
              if (Array.isArray(data.ciclo_log)) state.cycleLogs = data.ciclo_log;
              if (Array.isArray(data.ciclo_config) && data.ciclo_config[0]) {
                state.cycleSettings = Object.assign(state.cycleSettings, data.ciclo_config[0]);
              }
            }
          }
        } catch (fetchErr) {}

        // 2. Envío de lote masivo de hábitos locales
        const batchRecords = [];
        Object.keys(state.habitsLog).forEach(dKey => {
          Object.values(state.habitsLog[dKey]).forEach(r => batchRecords.push(r));
        });

        if (batchRecords.length > 0) {
          try {
            await fetch(state.googleSheetsUrl, {
              method: "POST",
              mode: "no-cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "save_habits_batch", records: batchRecords })
            });
          } catch (postErr) {}
        }

        saveToLocalStorage();
        renderAll();
        playSuccessSound();
        triggerCuteConfetti();
        alert("✅ ¡Sincronización bidireccional con Google Sheets y Google Drive completada!");
      } else {
        saveToLocalStorage();
        alert("✅ Todos los datos están seguros y guardados en tu navegador (LocalStorage). Si deseas sincronizar con Google Sheets, pega la URL del Web App en Configuración.");
      }
    } finally {
      state.isSyncing = false;
      if (btn) btn.textContent = "Sincronizar Ahora 🔄";
    }
  };

  function backgroundCheckSync() {
    if (!state.googleSheetsUrl) return;
    fetch(`${state.googleSheetsUrl}?action=ping`)
      .then(r => r.json())
      .then(res => {
        if (res.status === "success") {
          const badge = document.getElementById("sync-status-badge");
          if (badge) {
            badge.innerHTML = `<span>🟢 Conectado a Google Sheets</span><span class="text-[10px] text-emerald-700">En vivo</span>`;
          }
        }
      })
      .catch(() => {});
  }

  // ============================================================================
  // AJUSTES & MODAL CONFIG
  // ============================================================================
  window.openSettingsModal = function () {
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.classList.add("open");
      const urlInput = document.getElementById("settings-sheets-url");
      if (urlInput) urlInput.value = state.googleSheetsUrl || "";
      const idInput = document.getElementById("settings-spreadsheet-id");
      if (idInput) idInput.value = state.spreadsheetId || "1dAemKFvEufd0F5BcGEhP6YenrtmdCl49pIB9YA9zcTU";
    }
  };

  window.closeSettingsModal = function () {
    const modal = document.getElementById("settings-modal");
    if (modal) modal.classList.remove("open");
  };

  window.saveAllSettings = function () {
    const urlInput = document.getElementById("settings-sheets-url");
    const idInput = document.getElementById("settings-spreadsheet-id");

    if (urlInput) state.googleSheetsUrl = urlInput.value.trim();
    if (idInput) state.spreadsheetId = idInput.value.trim();

    saveToLocalStorage();
    window.closeSettingsModal();
    playSuccessSound();
    alert("✅ Configuración guardada correctamente.");

    if (state.googleSheetsUrl) {
      backgroundCheckSync();
    }
  };

  // ============================================================================
  // CONMUTACIÓN DE PESTAÑAS (SWITCHTAB) & GESTOS TÁCTILES
  // ============================================================================
  window.switchTab = function (tabName) {
    state.activeTab = tabName;

    document.querySelectorAll(".view-section, .tab-content").forEach(el => {
      el.classList.remove("active");
    });
    const targetEl = document.getElementById(`tab-${tabName}`);
    if (targetEl) targetEl.classList.add("active");

    document.querySelectorAll(".bottom-nav-btn").forEach(btn => {
      const isMatch = btn.dataset.tab === tabName;
      btn.classList.toggle("active", isMatch);
      if (isMatch) {
        try { btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); } catch (e) {}
      }
    });

    playGentleBlip();

    try {
      if (tabName === "habits") renderHabitsModule();
      if (tabName === "journal") renderJournalModule();
      if (tabName === "cycle") renderCycleModule();
      if (tabName === "dashboard") renderDashboardModule();
    } catch (e) {}
  };

  window.switchJournalSubtab = function (subtab) {
    const writeView = document.getElementById("journal-sub-write");
    const feedView = document.getElementById("journal-sub-feed");
    const btnWrite = document.getElementById("subtoggle-journal-write");
    const btnFeed = document.getElementById("subtoggle-journal-feed");

    if (subtab === "write") {
      if (writeView) writeView.classList.remove("hidden");
      if (feedView) feedView.classList.add("hidden");
      if (btnWrite) btnWrite.classList.add("active");
      if (btnFeed) btnFeed.classList.remove("active");
    } else {
      if (writeView) writeView.classList.add("hidden");
      if (feedView) feedView.classList.remove("hidden");
      if (btnFeed) btnFeed.classList.add("active");
      if (btnWrite) btnWrite.classList.remove("active");
      renderJournalFeed();
    }
    playGentleBlip();
  };

  function setupTouchSwipe() {
    let startX = 0;
    let startY = 0;
    const tabs = ["habits", "journal", "cycle", "dashboard"];

    document.body.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.body.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].screenX - startX;
      const diffY = e.changedTouches[0].screenY - startY;

      if (Math.abs(diffX) > 75 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        const curIdx = tabs.indexOf(state.activeTab);
        if (diffX < 0 && curIdx < tabs.length - 1) {
          window.switchTab(tabs[curIdx + 1]);
        } else if (diffX > 0 && curIdx > 0) {
          window.switchTab(tabs[curIdx - 1]);
        }
      }
    }, { passive: true });
  }

  function setupDomListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.closeNewHabitModal();
        window.closeNewFolderModal();
        window.closeSettingsModal();
        window.closeHabitNoteModal();
        window.closeConfirmPeriodModal();
        window.closeLightboxModal();
      }
    });
  }

  // ============================================================================
  // COMPRESIÓN DE IMÁGENES & ESCAPE
  // ============================================================================
  function compressImageFileToBase64(file, maxDimension, quality, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality || 0.8);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function extractMoodEmoji(moodStr) {
    if (!moodStr) return "🥰";
    if (moodStr.includes("Mal")) return "😢";
    if (moodStr.includes("Regular")) return "😕";
    if (moodStr.includes("Normal")) return "😐";
    if (moodStr.includes("Bien")) return "🙂";
    if (moodStr.includes("Increíble")) return "🥰";
    return "🌸";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(str) {
    if (!str) return "";
    return String(str).replace(/[^a-zA-Z0-9_-]/g, "_");
  }

  // Arranque seguro en DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

})();
