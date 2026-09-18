"use strict";

/* PocketLink 应用运行时。 */

const DB_NAME = "pocketlink";
const DB_VERSION = 1;
const APP_VERSION = 4;
const THEME_KEY = "pocketlink_theme";

const STORE_DEFS = {
  characters: { keyPath: "id", indexes: [["createdAt", "createdAt"], ["name", "name"]] },
  chats: { keyPath: "id", indexes: [["lastActiveAt", "lastActiveAt"], ["type", "type"], ["pinned", "pinned"]] },
  messages: { keyPath: "id", indexes: [["chatId", "chatId"], ["time", "time"]] },
  worldbooks: { keyPath: "id", indexes: [["name", "name"]] },
  presets: { keyPath: "id", indexes: [["name", "name"]] },
  apiConfigs: { keyPath: "id", indexes: [["category", "category"], ["provider", "provider"]] },
  themes: { keyPath: "id", indexes: [["name", "name"]] },
  regexScripts: { keyPath: "id", indexes: [["scriptName", "scriptName"]] },
  quickReplies: { keyPath: "id", indexes: [["name", "name"]] },
  settings: { keyPath: "id", indexes: [] },
  media: { keyPath: "id", indexes: [["chatId", "chatId"], ["createdAt", "createdAt"]] }
};

const BUILTIN_THEMES = [
  {
    id: "strawberry",
    name: "奶油草莓兔",
    builtIn: true,
    desc: "粉白软萌",
    vars: {
      bg: "#fff8fb", bg2: "#ffe9f3", panel: "#ffe9f3", panel2: "#fff0f7", pop: "#ffdcea",
      line: "#ffe0ee", line2: "#ffd0e2", fg: "#5a4250", dim: "#a87d92", faint: "#c99fb5",
      acc: "#ff8fc0", acc2: "#ffb6d5", ok: "#57bb84", warn: "#e2a63c", err: "#e5564b",
      me: "linear-gradient(135deg,#ffb6d5,#ff8fc0)", meFg: "#fff", bubble: "#fff",
      radius: "34px", radiusBubble: "20px",
      font: "\"PingFang SC\",\"Hiragino Sans GB\",\"Microsoft YaHei\",system-ui,sans-serif",
      shadow: "0 34px 64px -24px rgba(255,130,180,.55)",
      shadowBubble: "0 6px 16px -12px rgba(255,120,170,.9)"
    }
  },
  {
    id: "terminal",
    name: "暗夜终端",
    builtIn: true,
    desc: "黑客风",
    vars: {
      bg: "#000", bg2: "#0a0a0a", panel: "#0d0d0d", panel2: "#141414", pop: "#1a1a1a",
      line: "#1f3f2a", line2: "#2a5a3a", fg: "#00ff88", dim: "#5bb77a", faint: "#397a50",
      acc: "#00ff88", acc2: "#00cc66", ok: "#00ff88", warn: "#ffaa00", err: "#ff5555",
      me: "#003d20", meFg: "#00ff88", bubble: "#0d0d0d",
      radius: "6px", radiusBubble: "4px",
      font: "ui-monospace,Consolas,\"Courier New\",monospace",
      shadow: "0 0 0 1px #00ff88,0 0 40px -10px rgba(0,255,136,.3)",
      shadowBubble: "0 0 0 1px #1f3f2a"
    }
  },
  {
    id: "journal",
    name: "纸质手账",
    builtIn: true,
    desc: "暖奶油",
    vars: {
      bg: "#f5f0e8", bg2: "#ede5d8", panel: "#faf7f2", panel2: "#fffdf9", pop: "#e8dcc8",
      line: "#d8cbb5", line2: "#c4b49a", fg: "#3a3228", dim: "#795d3d", faint: "#a99777",
      acc: "#8b6f47", acc2: "#a88a5c", ok: "#6b9e5a", warn: "#c8873a", err: "#b8442e",
      me: "#e8dcc8", meFg: "#3a3228", bubble: "#fff",
      radius: "10px", radiusBubble: "6px",
      font: "\"Kaiti SC\",\"STKaiti\",\"Songti SC\",\"SimSun\",serif",
      shadow: "0 2px 12px rgba(139,111,71,.15)",
      shadowBubble: "0 1px 4px rgba(139,111,71,.12)"
    }
  },
  {
    id: "cyber",
    name: "赛博霓虹",
    builtIn: true,
    desc: "高饱和",
    vars: {
      bg: "#0a0a1a", bg2: "#12122a", panel: "#141428", panel2: "#1a1a35", pop: "#22224a",
      line: "#2a2a5a", line2: "#3a3a7a", fg: "#e8f0ff", dim: "#929fc7", faint: "#67739b",
      acc: "#00f0ff", acc2: "#ff2e88", ok: "#00ff88", warn: "#ffaa00", err: "#ff2e88",
      me: "linear-gradient(135deg,#ff2e88,#00f0ff)", meFg: "#0a0a1a", bubble: "#1a1a2e",
      radius: "20px", radiusBubble: "16px",
      font: "\"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif",
      shadow: "0 0 30px -8px rgba(0,240,255,.4)",
      shadowBubble: "0 0 16px -6px rgba(0,240,255,.5)"
    }
  },
  {
    id: "sumi",
    name: "和风水墨",
    builtIn: true,
    desc: "素雅",
    vars: {
      bg: "#f5f2ea", bg2: "#ebe6da", panel: "#fff", panel2: "#faf8f3", pop: "#e8e2d5",
      line: "#d8d0c0", line2: "#b8ae9a", fg: "#2c2c2c", dim: "#626262", faint: "#8c8c8c",
      acc: "#b8442e", acc2: "#8a3020", ok: "#5a8a4a", warn: "#c8873a", err: "#b8442e",
      me: "#2c2c2c", meFg: "#fff", bubble: "#fff",
      radius: "6px", radiusBubble: "4px",
      font: "\"Songti SC\",\"STSong\",\"SimSun\",serif",
      shadow: "0 1px 4px rgba(0,0,0,.08)",
      shadowBubble: "0 1px 2px rgba(0,0,0,.06)"
    }
  },
  {
    id: "snow",
    name: "雪国极简",
    builtIn: true,
    desc: "性冷淡",
    vars: {
      bg: "#fafafa", bg2: "#f0f0f0", panel: "#fff", panel2: "#f8f8f8", pop: "#eee",
      line: "#e0e0e0", line2: "#ccc", fg: "#1a1a1a", dim: "#626262", faint: "#949494",
      acc: "#222", acc2: "#444", ok: "#2e8a4a", warn: "#c8873a", err: "#c02e2e",
      me: "#222", meFg: "#fff", bubble: "#f0f0f0",
      radius: "14px", radiusBubble: "12px",
      font: "\"Inter\",\"Helvetica Neue\",\"PingFang SC\",system-ui,sans-serif",
      shadow: "0 1px 3px rgba(0,0,0,.06)",
      shadowBubble: "0 1px 2px rgba(0,0,0,.04)"
    }
  }
];

const API_CATALOG = {
  text: [
    { provider: "openrouter", name: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4.1", hint: "OpenAI 兼容，可使用多种上游模型。" },
    { provider: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com", model: "deepseek-v4-flash", hint: "默认端点 /chat/completions；默认关闭思考模式以启用采样参数。", reasoningMode: "off", reasoningEffort: "high" },
    { provider: "openai", name: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-5.5", hint: "OpenAI 原生兼容接口。" },
    { provider: "anthropic", name: "Anthropic Claude", baseUrl: "https://api.anthropic.com", model: "claude-opus-4.6", hint: "使用 /v1/messages 格式。" },
    { provider: "gemini", name: "Google Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", model: "gemini-3-pro-preview", hint: "使用 generateContent 格式。" },
    { provider: "glm", name: "智谱 GLM", baseUrl: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4.5", hint: "OpenAI 兼容。" },
    { provider: "qwen", name: "通义千问", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen3-max", hint: "兼容模式。" },
    { provider: "kimi", name: "Kimi", baseUrl: "https://api.moonshot.cn/v1", model: "kimi-k2", hint: "OpenAI 兼容。" },
    { provider: "minimax", name: "MiniMax", baseUrl: "https://api.minimax.chat/v1", model: "MiniMax-M2", hint: "按账号区域的接口地址可覆盖。" },
    { provider: "custom", name: "自定义文字接口", baseUrl: "", model: "", hint: "完全自定义请求模板。" }
  ],
  image: [
    {
      provider: "openrouter", name: "bytedance-seed/seedream", baseUrl: "https://openrouter.ai/api/v1",
      model: "bytedance-seed/seedream", responsePath: "data.0.url",
      bodyTemplate: "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\",\"size\":\"1024x1024\"}",
      hint: "聚合平台斜杠模型默认走 OpenRouter。"
    },
    {
      provider: "openrouter", name: "google/gemini 图片", baseUrl: "https://openrouter.ai/api/v1",
      model: "google/gemini-2.5-flash-image-preview", responsePath: "data.0.url",
      bodyTemplate: "{\"model\":\"{{model}}\",\"modalities\":[\"image\",\"text\"],\"messages\":[{\"role\":\"user\",\"content\":\"{{prompt}}\"}]}",
      hint: "OpenRouter 图片输出格式可能随模型更新。"
    },
    {
      provider: "openrouter", name: "openai/gpt 图片", baseUrl: "https://openrouter.ai/api/v1",
      model: "openai/gpt-image-1", responsePath: "data.0.b64_json",
      bodyTemplate: "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\",\"size\":\"1024x1024\"}",
      hint: "响应若是 Base64，应用会自动转成媒体地址。"
    }
  ],
  video: [
    {
      provider: "openrouter", name: "alibaba/wan", baseUrl: "https://openrouter.ai/api/v1",
      model: "alibaba/wan-2.2", responsePath: "data.0.url",
      bodyTemplate: "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\"}",
      hint: "请求与响应路径可完全编辑。"
    },
    {
      provider: "openrouter", name: "bytedance/seedance", baseUrl: "https://openrouter.ai/api/v1",
      model: "bytedance/seedance", responsePath: "data.0.url",
      bodyTemplate: "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\"}",
      hint: "请求与响应格式全部可编辑。"
    },
    {
      provider: "openrouter", name: "minimax 视频", baseUrl: "https://openrouter.ai/api/v1",
      model: "minimax/video-01", responsePath: "data.0.url",
      bodyTemplate: "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\"}",
      hint: "聚合平台模型名以账号实际可用名称为准。"
    },
    {
      provider: "openrouter", name: "kling 视频", baseUrl: "https://openrouter.ai/api/v1",
      model: "kling/video", responsePath: "data.0.url",
      bodyTemplate: "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\"}",
      hint: "聚合平台模型名以账号实际可用名称为准。"
    }
  ]
};

const DEFAULT_SETTINGS = {
  id: "global",
  theme: "strawberry",
  followSystem: false,
  themeMode: "system",
  fontScale: 1,
  bubbleRadius: null,
  customCss: "",
  defaultTextApiId: null,
  defaultImageApiId: null,
  defaultVideoApiId: null,
  defaultPresetId: null,
  typingIndicator: true,
  autoSummary: true,
  sendOnEnter: true,
  proactiveGlobalEnabled: false,
  proactiveMaxPerCycle: 3,
  quietHours: ["23:00", "07:00"],
  proxyUrl: "",
  proxyHeaders: {},
  userProfile: { name: "你", description: "" },
  lockEnabled: false,
  lockPin: "",
  notifications: [],
  dates: [],
  schedules: [],
  moments: [],
  health: {
    heartRate: null,
    temperature: null,
    sleep: null,
    steps: null,
    location: "",
    weather: "",
    updatedAt: 0,
    lastPerceptions: {}
  },
  activeQuickReplyIds: [],
  walletBalanceFen: 0,
  dailyReviewEnabled: true,
  lastDailyReviewKey: "",
  memoryCards: [],
  lastBackupAt: 0,
  version: APP_VERSION
};

const state = {
  db: null,
  route: "messages",
  returnRoute: "messages",
  currentChatId: null,
  currentChat: null,
  currentMessages: [],
  typingCharIds: new Set(),
  characters: [],
  chats: [],
  worldbooks: [],
  presets: [],
  apiConfigs: [],
  themes: [],
  regexScripts: [],
  quickReplies: [],
  settings: { ...DEFAULT_SETTINGS },
  lastMessages: new Map(),
  replyTo: null,
  modalHandlers: {},
  pendingFileImport: null,
  mediaRecorder: null,
  recordedChunks: [],
  recordingStartedAt: 0,
  searchQuery: "",
  profileTab: "overview",
  contentTab: "characters",
  apiTab: "text",
  healthPerceptions: [],
  suppressProactiveOnce: false,
  draggingElement: null,
  longPressTimer: null,
  mediaCache: new Map(),
  sleep: {
    active: false,
    audioContext: null,
    source: null,
    gain: null,
    nodes: [],
    stopTimer: null,
    dimTimer: null
  },
  call: {
    type: null,
    chatId: null,
    startedAt: 0,
    stream: null,
    recognition: null,
    muted: false,
    cameraEnabled: true,
    interimText: "",
    sceneUrl: null,
    busy: false
  }
};

/* ---------- 通用工具 ---------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const now = () => Date.now();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `pl-${Date.now()}-${Math.random().toString(16).slice(2)}`);
const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function formatTime(timestamp = now(), withDate = false) {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (!withDate) return time;
  return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const diff = now() - timestamp;
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`;
  if (diff < 86_400_000) return formatTime(timestamp);
  if (diff < 172_800_000) return "昨天";
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatDuration(seconds = 0) {
  const value = Math.max(0, Math.round(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function parseJsonSafe(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function toLines(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function estimateTokens(text) {
  const value = String(text || "");
  if (!value) return 0;
  const cjk = (value.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
  const other = value.length - cjk;
  return Math.ceil(cjk * 1.05 + other / 3.6);
}

function downloadJson(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toast(message, type = "success", timeout = 2800) {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;
  $("#toasts").append(node);
  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(-6px)";
    setTimeout(() => node.remove(), 180);
  }, timeout);
}

function setBusy(button, busy, text = "处理中") {
  if (!button) return;
  if (busy) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = text;
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function getById(collection, id) {
  return collection.find((item) => item.id === id) || null;
}

function sortByTimeDesc(items) {
  return [...items].sort((a, b) => (b.lastActiveAt || b.updatedAt || b.createdAt || 0) - (a.lastActiveAt || a.updatedAt || a.createdAt || 0));
}

function hashColor(value) {
  const palette = ["#ff8fc0", "#81a9e6", "#6bbf9b", "#d59b59", "#9a84d5", "#e17a7a", "#45a8b8", "#a78b67"];
  let hash = 0;
  for (const char of String(value || "?")) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

function initials(name = "?") {
  const clean = String(name).trim();
  if (!clean) return "?";
  return [...clean].slice(0, 2).join("").toUpperCase();
}

function avatarStyle(character) {
  if (character?.avatarType === "image" && character.avatar) {
    return `background-image:url('${escapeAttr(character.avatar)}');background-color:${escapeAttr(character.color || hashColor(character.name))}`;
  }
  if (character?.avatarType === "video" && character.avatarPoster) {
    return `background-image:url('${escapeAttr(character.avatarPoster)}');background-color:${escapeAttr(character.color || hashColor(character.name))}`;
  }
  return `background:${escapeAttr(character?.color || hashColor(character?.name || "?"))};color:#fff`;
}

function renderAvatar(character, extra = "") {
  if (!character) return `<span class="avatar ${extra}" style="background:var(--line2);color:var(--dim)">?</span>`;
  if (character.avatarType === "video" && character.avatar) {
    return `<span class="avatar has-video ${extra}" style="${avatarStyle(character)}"><video src="${escapeAttr(character.avatar)}" ${character.avatarPoster ? `poster="${escapeAttr(character.avatarPoster)}"` : ""} autoplay muted loop playsinline></video></span>`;
  }
  return `<span class="avatar ${extra}" style="${avatarStyle(character)}">${character.avatarType === "image" ? "" : escapeHtml(character.avatar || initials(character.name))}</span>`;
}

function renderChatAvatar(chat) {
  const members = chat.members.map((id) => getById(state.characters, id)).filter(Boolean);
  if (chat.type === "group") {
    return `<span class="chat-avatar" style="background:${escapeAttr(members[0]?.color || hashColor(chat.title))};color:#fff">${escapeHtml(members.slice(0, 2).map((item) => item.avatarType === "image" ? initials(item.name) : (item.avatar || initials(item.name))).join(""))}</span>`;
  }
  const character = members[0];
  if (character?.avatarType === "video" && character.avatar) {
    return `<span class="chat-avatar has-video" style="${avatarStyle(character)}"><video src="${escapeAttr(character.avatar)}" ${character.avatarPoster ? `poster="${escapeAttr(character.avatarPoster)}"` : ""} autoplay muted loop playsinline></video></span>`;
  }
  return `<span class="chat-avatar" style="${character ? avatarStyle(character) : "background:var(--line2)"}">${character && character.avatarType !== "image" ? escapeHtml(character.avatar || initials(character.name)) : ""}</span>`;
}

function safeFilename(value) {
  return String(value || "pocketlink").replace(/[\\/:*?"<>|]/g, "_").slice(0, 80);
}

/* ---------- IndexedDB ---------- */

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [name, definition] of Object.entries(STORE_DEFS)) {
        let store;
        if (!db.objectStoreNames.contains(name)) {
          store = db.createObjectStore(name, { keyPath: definition.keyPath });
        } else {
          store = request.transaction.objectStore(name);
        }
        for (const [indexName, keyPath] of definition.indexes) {
          if (!store.indexNames.contains(indexName)) store.createIndex(indexName, keyPath, { unique: false });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dbRequest(storeName, mode, operation) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    let request;
    try {
      request = operation(store);
    } catch (error) {
      reject(error);
      return;
    }
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const dbGet = (store, id) => dbRequest(store, "readonly", (objectStore) => objectStore.get(id));
const dbGetAll = (store) => dbRequest(store, "readonly", (objectStore) => objectStore.getAll());
const dbPut = (store, value) => dbRequest(store, "readwrite", (objectStore) => objectStore.put(value));
const dbDelete = (store, id) => dbRequest(store, "readwrite", (objectStore) => objectStore.delete(id));
const dbClear = (store) => dbRequest(store, "readwrite", (objectStore) => objectStore.clear());

function dbGetByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(storeName, "readonly");
    const index = transaction.objectStore(storeName).index(indexName);
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* ---------- 默认对象 ---------- */

function defaultCharacter() {
  const stamp = now();
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp,
    name: "", avatar: "🙂", avatarType: "emoji", avatarPoster: "", avatarPrompt: "",
    avatarReference: null, tag: "", color: "",
    persona: "", personality: "", scenario: "", speechStyle: "", background: "",
    personalityDimensions: {
      rationality: 50,
      humor: 50,
      empathy: 50,
      initiative: 50,
      directness: 50
    },
    catchphrases: [], examples: [], firstMessage: "", alternateGreetings: [],
    systemPrompt: "", postHistoryInstructions: "",
    sampling: {
      temperature: null, top_p: null, max_tokens: null,
      frequency_penalty: null, presence_penalty: null
    },
    permissions: {
      heartRate: false, temperature: false, sleep: false,
      steps: false, location: "off", weather: false
    },
    proactive: {
      enabled: false,
      trigger: { silenceHours: 8, sleepLessThan: null, timeWindow: ["08:00", "23:00"] },
      style: "mid", cooldownHours: 6, lastSentAt: 0
    },
    greetings: {
      morning: false,
      night: false,
      customMorning: "",
      customNight: "",
      lastMorningAt: 0,
      lastNightAt: 0
    },
    voice: {
      sampleFile: null, sampleMime: "", ttsProvider: "system",
      ttsVoiceId: null, ttsSpeed: 1, ttsPitch: 1
    },
    privateEntries: [], boundWorldbooks: [], boundPresetId: null,
    raw: null, rawFormat: null,
    stats: { totalMessages: 0, lastActiveAt: 0 },
    extensions: null
  };
}

function defaultWorldbook() {
  const stamp = now();
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp,
    name: "", description: "", raw: null, rawFormat: null, entries: []
  };
}

function defaultWorldbookEntry(worldbookId = "") {
  return {
    id: uid(), worldbookId, uid: 0, key: [], keysecondary: [], comment: "",
    content: "", constant: false, disable: false, vectorized: false,
    selective: false, selectiveLogic: 0, addMemo: true, order: 100,
    position: 0, depth: 4, probability: 100, useProbability: true,
    group: "", groupWeight: 100, scanDepth: null, caseSensitive: null,
    matchWholeWords: null, automationId: "", role: null, sticky: 0,
    cooldown: 0, delay: 0, displayIndex: 0,
    characterFilter: { isExclude: false, names: [], tags: [] },
    visibility: "public", ownerCharId: null,
    lastTriggeredAt: 0, triggerCount: 0
  };
}

function defaultPreset() {
  const stamp = now();
  const identifiers = [
    ["main", "主提示词"], ["worldInfoBefore", "世界书前置"],
    ["charDescription", "角色描述"], ["charPersonality", "角色性格"],
    ["scenario", "场景"], ["dialogueExamples", "示例对话"],
    ["chatHistory", "聊天历史"], ["worldInfoAfter", "世界书后置"],
    ["jailbreak", "越狱提示"]
  ];
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp, name: "", description: "",
    temperature: 1.13, frequency_penalty: 0, presence_penalty: 0,
    top_p: 0.95, top_k: 0, top_a: 0, min_p: 0, repetition_penalty: 1,
    openai_max_context: 128000, openai_max_tokens: 4096, max_context_unlocked: true,
    prompts: identifiers.map(([identifier, name]) => ({
      identifier, name, enabled: true, injection_position: 0,
      injection_depth: 4, injection_order: 100, role: "system", content: "",
      system_prompt: false,
      marker: ["worldInfoBefore", "charDescription", "charPersonality", "scenario", "dialogueExamples", "chatHistory", "worldInfoAfter"].includes(identifier),
      forbid_overrides: false, injection_trigger: []
    })),
    prompt_order: [{ character_id: 100001, order: identifiers.map(([identifier]) => ({ identifier, enabled: true })) }],
    wi_format: "{0}", scenario_format: "{{scenario}}", personality_format: "{{personality}}",
    impersonation_prompt: "", new_chat_prompt: "", new_group_chat_prompt: "",
    new_example_chat_prompt: "", continue_nudge_prompt: "", group_nudge_prompt: "",
    send_if_empty: "", names_behavior: 0, wrap_in_quotes: false,
    assistant_prefill: "", assistant_impersonation: "", use_sysprompt: true,
    stream_openai: true, bias_preset_selected: "",
    raw: null, rawFormat: null
  };
}

function defaultApiConfig(category = "text", template = {}) {
  const stamp = now();
  const requestTemplate = category === "text"
    ? { method: "POST", headers: {}, bodyTemplate: "", responsePath: "" }
    : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        bodyTemplate: template.bodyTemplate || "{\"model\":\"{{model}}\",\"prompt\":\"{{prompt}}\"}",
        responsePath: template.responsePath || "data.0.url"
      };
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp, category,
    name: template.name || "", provider: template.provider || "custom",
    enabled: true, baseUrl: template.baseUrl || "", apiKey: "", model: template.model || "",
    requestTemplate,
    sampling: {
      temperature: null, top_p: null, max_tokens: null,
      frequency_penalty: null, presence_penalty: null, top_k: null
    },
    reasoning: {
      mode: template.reasoningMode || "auto",
      effort: template.reasoningEffort || "high"
    },
    lastTestedAt: 0, lastTestResult: ""
  };
}

function normalizeApiConfig(config) {
  return {
    ...config,
    requestTemplate: {
      method: "POST",
      headers: {},
      bodyTemplate: "",
      responsePath: "",
      ...(config.requestTemplate || {})
    },
    sampling: {
      temperature: null,
      top_p: null,
      max_tokens: null,
      frequency_penalty: null,
      presence_penalty: null,
      top_k: null,
      ...(config.sampling || {})
    },
    reasoning: {
      mode: "auto",
      effort: "high",
      ...(config.reasoning || {})
    }
  };
}

function defaultRegexScript() {
  const stamp = now();
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp, scriptName: "",
    findRegex: "", replaceString: "", trimStrings: [], placement: [2],
    disabled: false, markdownOnly: true, promptOnly: false,
    runOnEdit: true, substituteRegex: 0, minDepth: null, maxDepth: null, raw: null
  };
}

function defaultQuickReply() {
  const stamp = now();
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp, name: "", version: 2,
    disableSend: false, placeBeforeInput: false, injectInput: false,
    color: "rgba(0,0,0,0)", onlyBorderColor: false,
    qrList: [], idIndex: 1, raw: null
  };
}

function defaultChat(type, members, title = "") {
  const stamp = now();
  return {
    id: uid(), createdAt: stamp, updatedAt: stamp, lastActiveAt: stamp,
    type, members, title, unread: 0, pinned: false, muted: false,
    archived: false, draft: "", messages: [], summary: "",
    summaryUpdatedAt: 0, summaryCoversUpTo: 0, memory: [],
    modelOverride: null, presetOverride: null, systemPromptExtra: "",
    groupState: type === "group" ? {
      lastSpeakerId: null, turnOrder: [...members], directorNote: "",
      directorEnabled: true,
      isolationCheck: {
        enabled: true, lastResult: "尚未校验",
        lastCheckedAt: 0, violationCount: 0, retryOnViolation: true
      },
      memberRelations: {}
    } : null
  };
}

function defaultMessage(chatId, role, charId, type, text, meta = {}) {
  return {
    id: uid(), chatId, role, charId, type, text,
    meta: {
      mediaId: null, thumbnailMediaId: null, audioUrl: null, duration: 0, waveform: [], mediaUrl: null,
      thumbnail: null, width: 0, height: 0, tokens: estimateTokens(text), ...meta
    },
    status: "sent", time: now(), edited: false, editedAt: 0,
    regeneratedFrom: null, regeneratedTo: [], replyTo: null,
    generation: {
      model: "", presetId: null, promptTokens: 0,
      completionTokens: 0, finishReason: ""
    }
  };
}

async function storeMessageMedia(chatId, dataUrl, options = {}) {
  if (!dataUrl) return null;
  if (!String(dataUrl).startsWith("data:")) {
    let thumbnailMediaId = null;
    if (String(options.thumbnail || "").startsWith("data:")) {
      thumbnailMediaId = uid();
      await dbPut("media", {
        id: thumbnailMediaId,
        chatId,
        createdAt: now(),
        data: null,
        thumbnail: options.thumbnail,
        mime: dataUrlMime(options.thumbnail) || "image/jpeg"
      });
    }
    return { mediaUrl: dataUrl, thumbnail: null, thumbnailMediaId };
  }
  const mediaId = uid();
  await dbPut("media", {
    id: mediaId,
    chatId,
    createdAt: now(),
    data: dataUrl,
    thumbnail: options.thumbnail || "",
    mime: options.mime || dataUrlMime(dataUrl) || "application/octet-stream",
    fileName: options.fileName || "",
    fileSize: options.fileSize || 0
  });
  return {
    mediaId,
    mediaUrl: null,
    audioUrl: null,
    thumbnail: options.thumbnail && !String(options.thumbnail).startsWith("data:") ? options.thumbnail : null
  };
}

async function getCachedMedia(mediaId) {
  if (!mediaId) return null;
  if (state.mediaCache.has(mediaId)) return state.mediaCache.get(mediaId);
  const media = await dbGet("media", mediaId);
  if (media) state.mediaCache.set(mediaId, media);
  return media;
}

async function deleteMessageMedia(message) {
  for (const mediaId of [message?.meta?.mediaId, message?.meta?.thumbnailMediaId].filter(Boolean)) {
    state.mediaCache.delete(mediaId);
    await dbDelete("media", mediaId);
  }
}

function normalizeCharacterRecord(character) {
  const base = defaultCharacter();
  const normalized = {
    ...base,
    ...character,
    sampling: { ...base.sampling, ...(character.sampling || {}) },
    permissions: { ...base.permissions, ...(character.permissions || {}) },
    proactive: {
      ...base.proactive,
      ...(character.proactive || {}),
      trigger: { ...base.proactive.trigger, ...(character.proactive?.trigger || {}) }
    },
    voice: { ...base.voice, ...(character.voice || {}) },
    personalityDimensions: { ...base.personalityDimensions, ...(character.personalityDimensions || {}) },
    greetings: { ...base.greetings, ...(character.greetings || {}) },
    stats: { ...base.stats, ...(character.stats || {}) }
  };
  if (!["emoji", "image", "video"].includes(normalized.avatarType)) normalized.avatarType = "emoji";
  if (!normalized.avatar && normalized.avatarType !== "emoji") normalized.avatar = initials(normalized.name);
  return normalized;
}

/* ---------- 启动与数据加载 ---------- */

async function bootstrap() {
  try {
    state.db = await openDatabase();
    await seedCoreData();
    await loadAllData();
    await runDataMigrations();
    bindGlobalEvents();
    startClock();
    renderThemeRail();
    applyTheme();
    const initialRoute = new URLSearchParams(location.search).get("route");
    navigate(["messages", "groups", "dates", "health", "profile"].includes(initialRoute) ? initialRoute : "messages", { replace: true });
    startProactiveEngine();
    checkScheduledNotifications();
    registerServiceWorker();
    setTimeout(checkDailyReview, 1800);
    if (state.settings.lockEnabled && state.settings.lockPin) lockApp();
  } catch (error) {
    console.error(error);
    $("#screen").innerHTML = `<div class="empty-state"><div class="empty-illustration">!</div><h2>应用初始化失败</h2><p>${escapeHtml(error.message || "无法打开本地数据库")}</p><button class="btn primary" onclick="location.reload()">重试</button></div>`;
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;
  navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service Worker 注册失败", error));
}

async function seedCoreData() {
  let settings = await dbGet("settings", "global");
  if (!settings) {
    settings = { ...clone(DEFAULT_SETTINGS), theme: localStorage.getItem(THEME_KEY) || DEFAULT_SETTINGS.theme };
    await dbPut("settings", settings);
  } else {
    settings = { ...clone(DEFAULT_SETTINGS), ...settings };
    settings.health = { ...clone(DEFAULT_SETTINGS.health), ...(settings.health || {}) };
    await dbPut("settings", settings);
  }
  const existingThemeIds = new Set((await dbGetAll("themes")).map((theme) => theme.id));
  for (const builtin of BUILTIN_THEMES) {
    if (!existingThemeIds.has(builtin.id)) {
      await dbPut("themes", {
        ...clone(builtin), createdAt: now(), updatedAt: now(),
        raw: null, rawFormat: null, customCss: ""
      });
    }
  }
}

async function loadAllData() {
  state.mediaCache.clear();
  const [settings, characters, chats, worldbooks, presets, apiConfigs, themes, regexScripts, quickReplies] = await Promise.all([
    dbGet("settings", "global"), dbGetAll("characters"), dbGetAll("chats"),
    dbGetAll("worldbooks"), dbGetAll("presets"), dbGetAll("apiConfigs"),
    dbGetAll("themes"), dbGetAll("regexScripts"), dbGetAll("quickReplies")
  ]);
  state.settings = { ...clone(DEFAULT_SETTINGS), ...(settings || {}) };
  state.settings.health = { ...clone(DEFAULT_SETTINGS.health), ...(state.settings.health || {}) };
  state.characters = characters.map(normalizeCharacterRecord).sort((a, b) => b.updatedAt - a.updatedAt);
  state.chats = sortByTimeDesc(chats);
  state.worldbooks = worldbooks.sort((a, b) => b.updatedAt - a.updatedAt);
  state.presets = presets.sort((a, b) => b.updatedAt - a.updatedAt);
  state.apiConfigs = apiConfigs.map(normalizeApiConfig).sort((a, b) => b.updatedAt - a.updatedAt);
  state.themes = themes.sort((a, b) => Number(b.builtIn) - Number(a.builtIn) || a.name.localeCompare(b.name, "zh-CN"));
  state.regexScripts = regexScripts.sort((a, b) => b.updatedAt - a.updatedAt);
  state.quickReplies = quickReplies.sort((a, b) => b.updatedAt - a.updatedAt);
  await loadLastMessages();
  updateHealthPerceptions();
}

async function runDataMigrations() {
  const fromVersion = toNumber(state.settings.version, 1);
  if (fromVersion < 3) await migrateLegacyMediaToStore();
  if (state.settings.version !== APP_VERSION) {
    state.settings.version = APP_VERSION;
    await saveSettings();
  }
}

async function migrateLegacyMediaToStore() {
  const messages = await dbGetAll("messages");
  let migrated = 0;
  for (const message of messages) {
    const meta = message.meta || {};
    const data = meta.mediaUrl || meta.audioUrl || null;
    const thumbnail = meta.thumbnail || "";
    const hasEmbeddedData = String(data || "").startsWith("data:") || String(thumbnail || "").startsWith("data:");
    if (!hasEmbeddedData || meta.mediaId) continue;
    const mediaId = uid();
    await dbPut("media", {
      id: mediaId,
      chatId: message.chatId,
      createdAt: message.time || now(),
      data,
      thumbnail,
      mime: dataUrlMime(data || thumbnail),
      migratedFromMessageId: message.id
    });
    message.meta = {
      ...meta,
      mediaId,
      mediaUrl: String(meta.mediaUrl || "").startsWith("data:") ? null : meta.mediaUrl,
      audioUrl: String(meta.audioUrl || "").startsWith("data:") ? null : meta.audioUrl,
      thumbnail: String(meta.thumbnail || "").startsWith("data:") ? null : meta.thumbnail
    };
    await dbPut("messages", message);
    migrated += 1;
  }
  if (migrated) console.info(`PocketLink：已迁移 ${migrated} 条内嵌媒体消息`);
}

async function loadLastMessages() {
  state.lastMessages.clear();
  for (const chat of state.chats) {
    const messages = await dbGetByIndex("messages", "chatId", chat.id);
    messages.sort((a, b) => a.time - b.time);
    if (messages.length) state.lastMessages.set(chat.id, messages[messages.length - 1]);
  }
}

function bindGlobalEvents() {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("input", handleDocumentInput);
  document.addEventListener("change", handleDocumentChange);
  document.addEventListener("submit", handleDocumentSubmit);
  document.addEventListener("keydown", handleDocumentKeydown);
  document.addEventListener("dragstart", handleDragStart);
  document.addEventListener("dragover", (event) => {
    if (event.target.closest("[data-drop-zone]")) event.preventDefault();
  });
  document.addEventListener("drop", handleDrop);
  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("pointerup", clearLongPress);
  document.addEventListener("pointermove", clearLongPress);
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("focusin", handleFocusIn);
  $("#globalFileInput").addEventListener("change", handleFileSelected);
  window.addEventListener("message", handleIframeMessage);
  setupViewportMetrics();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    if (state.settings.themeMode === "system") applyTheme();
  });
  window.addEventListener("beforeunload", () => {
    if (state.call.type) endCall(false);
    if (state.sleep.active) stopSleepMode(false);
    if (state.currentChat && $("#chatInput")) {
      state.currentChat.draft = $("#chatInput").value;
      dbPut("chats", state.currentChat).catch(() => {});
    }
  });
}

function setupViewportMetrics() {
  const update = () => {
    if (!window.visualViewport) return;
    const viewport = window.visualViewport;
    document.documentElement.style.setProperty("--viewport-height", `${viewport.height}px`);
    document.documentElement.style.setProperty("--keyboard-offset", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
  };
  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();
}

function handleFocusIn(event) {
  if (!event.target.matches("input,textarea,select")) return;
  setTimeout(() => event.target.scrollIntoView({ block: "center", behavior: "smooth" }), 180);
}

function handlePointerDown(event) {
  const messageNode = event.target.closest(".msg[data-message-id]");
  if (!messageNode || event.target.closest("button,a,input,textarea")) return;
  clearLongPress();
  state.longPressTimer = setTimeout(() => {
    const messageId = messageNode.dataset.messageId;
    if (state.currentMessages.some((item) => item.id === messageId)) openMessageActionSheet(messageId);
  }, 550);
}

function clearLongPress() {
  if (state.longPressTimer) clearTimeout(state.longPressTimer);
  state.longPressTimer = null;
}

function handleContextMenu(event) {
  const messageNode = event.target.closest(".msg[data-message-id]");
  if (!messageNode) return;
  event.preventDefault();
  openMessageActionSheet(messageNode.dataset.messageId);
}

function openMessageActionSheet(messageId) {
  const message = state.currentMessages.find((item) => item.id === messageId);
  if (!message) return;
  openSheet("消息操作", [
    { icon: "↩", title: "引用", action: "reply-message", messageId },
    { icon: "⧉", title: "复制", action: "copy-message", messageId },
    { icon: "✎", title: "编辑", action: "edit-message", messageId },
    { icon: "↻", title: "重新生成", action: "regenerate-message", messageId },
    { icon: "×", title: "删除", action: "delete-message", messageId }
  ]);
}

function startClock() {
  const update = () => {
    const time = formatTime();
    $("#statusClock").textContent = time;
    $("#lockTime").textContent = time;
    $("#lockDate").textContent = new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" });
  };
  update();
  setInterval(update, 15_000);
}

/* ---------- 主题 ---------- */

function resolveTheme() {
  if (state.settings.followSystem) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "terminal" : "strawberry";
  }
  return state.settings.theme || localStorage.getItem(THEME_KEY) || "strawberry";
}

function applyTheme() {
  const themeId = resolveTheme();
  const theme = state.themes.find((item) => item.id === themeId) || BUILTIN_THEMES[0];
  document.body.dataset.theme = theme.builtIn ? theme.id : "custom";
  const useNightVariant = state.settings.themeMode === "night"
    || (state.settings.themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (!theme.builtIn || useNightVariant) applyCustomThemeVars(useNightVariant ? createNightThemeVariant(theme.vars) : theme.vars);
  document.documentElement.style.setProperty("--font-scale", String(state.settings.fontScale || 1));
  if (state.settings.bubbleRadius !== null && state.settings.bubbleRadius !== undefined) {
    document.documentElement.style.setProperty("--radius-bubble", `${state.settings.bubbleRadius}px`);
  } else {
    document.documentElement.style.removeProperty("--radius-bubble");
  }
  applyCustomCss(theme.customCss || state.settings.customCss || "");
  updateThemeFavicon(theme);
  localStorage.setItem(THEME_KEY, theme.id);
}

function createNightThemeVariant(vars = {}) {
  return {
    ...vars,
    bg: "#08090d",
    bg2: "#10121a",
    panel: "#12141d",
    panel2: "#191c27",
    pop: "#222635",
    line: "#292e3d",
    line2: "#3a4155",
    fg: "#edf0f7",
    dim: "#a4acc0",
    faint: "#727b91",
    acc: vars.acc || "#8fb7ff",
    acc2: vars.acc2 || "#d6a5ff",
    bubble: "#171a24",
    me: vars.me?.includes("gradient") ? vars.me : `linear-gradient(135deg, ${vars.acc || "#8fb7ff"}, ${vars.acc2 || "#d6a5ff"})`,
    meFg: "#0a0b10",
    shadow: "0 26px 60px -28px rgba(0,0,0,.82)",
    shadowBubble: "0 8px 24px -18px rgba(0,0,0,.9)"
  };
}

function updateThemeFavicon(theme) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const bg = theme.vars?.bg || "#fff8fb";
  const acc = theme.vars?.acc || "#ff8fc0";
  context.fillStyle = bg;
  context.fillRect(0, 0, 64, 64);
  context.fillStyle = acc;
  context.beginPath();
  context.arc(32, 32, 22, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = theme.vars?.meFg || "#fff";
  context.beginPath();
  context.arc(25, 28, 4, 0, Math.PI * 2);
  context.arc(39, 28, 4, 0, Math.PI * 2);
  context.fill();
  let link = $('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.append(link);
  }
  link.href = canvas.toDataURL("image/png");
}

function applyCustomThemeVars(vars) {
  const map = {
    bg: "--bg", bg2: "--bg2", panel: "--panel", panel2: "--panel2", pop: "--pop",
    line: "--line", line2: "--line2", fg: "--fg", dim: "--dim", faint: "--faint",
    acc: "--acc", acc2: "--acc2", ok: "--ok", warn: "--warn", err: "--err",
    me: "--me", meFg: "--me-fg", bubble: "--bubble", radius: "--radius",
    radiusBubble: "--radius-bubble", font: "--font", shadow: "--shadow",
    shadowBubble: "--shadow-bubble"
  };
  for (const [key, cssVar] of Object.entries(map)) {
    if (vars?.[key]) document.documentElement.style.setProperty(cssVar, vars[key]);
  }
}

function applyCustomCss(css) {
  let node = $("#pocketlinkCustomCss");
  if (!node) {
    node = document.createElement("style");
    node.id = "pocketlinkCustomCss";
    document.head.append(node);
  }
  node.textContent = String(css || "")
    .replaceAll(".mes_block", ".bubble")
    .replaceAll(".mes", ".msg")
    .replaceAll("[is_user='true']", ".msg.me")
    .replaceAll("[is_user=\"true\"]", ".msg.me")
    .replaceAll("[is_user='false']", ".msg.them")
    .replaceAll("[is_user=\"false\"]", ".msg.them");
}

function renderThemeRail() {
  const list = $("#themeRailList");
  list.innerHTML = state.themes.map((theme) => {
    const vars = theme.vars || {};
    const active = theme.id === state.settings.theme ? "active" : "";
    return `
      <button class="theme-rail-item ${active}" data-action="select-theme" data-theme-id="${escapeAttr(theme.id)}">
        <span class="theme-swatch">
          <i style="background:${escapeAttr(vars.bg || "#fff")}"></i>
          <i style="background:${escapeAttr(vars.acc || "#888")}"></i>
          <i style="background:${escapeAttr(vars.bubble || "#eee")}"></i>
          <i style="background:${escapeAttr(vars.fg || "#222")}"></i>
        </span>
        <span>${escapeHtml(theme.name)}</span>
      </button>`;
  }).join("");
}

async function selectTheme(themeId) {
  const theme = state.themes.find((item) => item.id === themeId);
  if (!theme) return;
  state.settings.theme = themeId;
  state.settings.followSystem = false;
  await saveSettings();
  applyTheme();
  renderThemeRail();
  if (state.route !== "chat") renderScreen();
}

/* ---------- 路由与导航 ---------- */

function navigate(route, options = {}) {
  if (state.route === "chat" && route !== "chat" && state.currentChat && $("#chatInput")) {
    state.currentChat.draft = $("#chatInput").value;
    dbPut("chats", state.currentChat).catch(() => {});
  }
  if (route === "chat" && state.route !== "chat") state.returnRoute = state.route;
  state.route = route;
  if (!options.replace && route !== "chat") state.currentChatId = null;
  renderScreen();
  renderNav();
}

function renderNav() {
  const unread = state.chats.filter((chat) => !chat.archived).reduce((sum, chat) => sum + (chat.unread || 0), 0);
  const dot = $("#navUnread");
  dot.textContent = unread > 99 ? "99+" : unread;
  dot.classList.toggle("hidden", unread === 0);
  $$("#bottomNav button").forEach((button) => {
    const route = button.dataset.route;
    const active = route === state.route || (route === "messages" && state.route === "chat");
    button.classList.toggle("active", active);
  });
  $("#bottomNav").classList.toggle("hidden", state.route === "chat");
}

function renderScreen() {
  const screen = $("#screen");
  if (state.route === "messages") {
    screen.innerHTML = renderChatListPage("all");
  } else if (state.route === "groups") {
    screen.innerHTML = renderChatListPage("group");
  } else if (state.route === "chat") {
    screen.innerHTML = renderChatPage();
    requestAnimationFrame(() => {
      const body = $("#messageScroll");
      if (body) body.scrollTop = body.scrollHeight;
      const input = $("#chatInput");
      if (input) {
        input.value = state.currentChat?.draft || "";
        autoSizeTextarea(input);
      }
      hydrateMessageMedia();
    });
  } else if (state.route === "dates") {
    screen.innerHTML = renderDatesPage();
  } else if (state.route === "health") {
    screen.innerHTML = renderHealthPage();
  } else if (state.route === "profile") {
    screen.innerHTML = renderProfilePage();
  }
  renderNav();
}

function renderChatListPage(filter) {
  const isGroup = filter === "group";
  const chats = sortByTimeDesc(state.chats.filter((chat) => !chat.archived && (isGroup ? chat.type === "group" : true)));
  const unreadProactive = state.settings.notifications.filter((item) => !item.read && item.type === "proactive");
  const title = isGroup ? "群聊" : "消息";
  const activeQuickCount = state.quickReplies.filter((item) => state.settings.activeQuickReplyIds.includes(item.id)).length;
  const proactive = unreadProactive.length ? `
    <button class="proactive-bar" data-action="open-notifications">
      <span class="spark">✦</span>
      <span>${escapeHtml(unreadProactive[0].text)}${unreadProactive.length > 1 ? `，还有 ${unreadProactive.length - 1} 条角色动态` : ""}</span>
    </button>` : "";
  const list = chats.length ? `<div class="chat-list">${chats.map(renderChatRow).join("")}</div>` : `
    <div class="empty-state">
      <div class="empty-illustration">${isGroup ? "⌁" : "✉"}</div>
      <h2>${isGroup ? "还没有群聊" : "手机里还没有角色"}</h2>
      <p>${isGroup ? "先创建角色，再把多个角色拉进同一段关系里。" : "角色卡、聊天记录与世界的入口都在本机。你可以先创建角色，也可以导入现有角色卡。"}</p>
      <div class="empty-actions">
        <button class="btn primary" data-action="open-create-sheet">开始创建</button>
        <button class="btn" data-action="import-file" data-import-kind="auto">导入文件</button>
      </div>
    </div>`;
  return `
    <div class="page">
      <header class="topbar">
        <div class="topbar-main">
          <div class="topbar-title">${title}</div>
          ${isGroup ? `<div class="topbar-subtitle">角色依次发言，私密信息单独隔离</div>` : ""}
        </div>
        <button class="icon-btn" data-action="open-notifications" title="通知中心">◉</button>
        ${activeQuickCount ? `<button class="icon-btn" data-action="manage-quick-replies" title="快捷回复">⌘</button>` : ""}
        <button class="icon-btn primary" data-action="open-create-sheet" title="新建">+</button>
      </header>
      <div class="page-scroll">${proactive}${list}</div>
    </div>`;
}

function renderChatRow(chat) {
  const last = state.lastMessages.get(chat.id);
  const members = chat.members.map((id) => getById(state.characters, id)).filter(Boolean);
  const preview = last ? messagePreview(last) : (chat.summary || "还没有消息");
  const names = members.map((item) => item.name).join("、");
  const tag = chat.type === "group" ? "群聊" : (members[0]?.tag || "角色");
  return `
    <article class="chat-row" data-action="open-chat" data-chat-id="${escapeAttr(chat.id)}">
      <div style="position:relative">
        ${renderChatAvatar(chat)}
        ${members.some((item) => item.stats?.lastActiveAt > now() - 300_000) ? `<i class="online-dot"></i>` : ""}
      </div>
      <div class="chat-main">
        <div class="chat-line">
          <span class="chat-name">${escapeHtml(chat.title || names || "未命名聊天")}</span>
          <span class="tag">${escapeHtml(tag)}</span>
          ${chat.pinned ? `<span class="pin-mark">⌖</span>` : ""}
        </div>
        <div class="chat-preview">${escapeHtml(preview)}</div>
      </div>
      <div class="chat-side">
        <span class="chat-time">${formatRelativeTime(chat.lastActiveAt)}</span>
        ${chat.unread ? `<span class="unread">${chat.unread > 99 ? "99+" : chat.unread}</span>` : ""}
      </div>
    </article>`;
}

function messagePreview(message) {
  const prefix = message.role === "user" ? "你：" : "";
  if (message.type === "voice") return `${prefix}[语音 ${formatDuration(message.meta.duration)}]`;
  if (message.type === "image") return `${prefix}[图片] ${message.text || ""}`.trim();
  if (message.type === "video") return `${prefix}[视频] ${message.text || ""}`.trim();
  if (message.type === "emoji") return `${prefix}${message.text || "表情"}`;
  if (message.type === "location") return `${prefix}[位置] ${message.meta.location?.label || message.text || ""}`;
  if (message.type === "transfer") return `${prefix}[红包] ${formatMoney(message.meta.amountFen || 0)}`;
  return `${prefix}${String(message.text || "").replace(/\s+/g, " ").slice(0, 80)}`;
}

function formatMoney(fen) {
  const value = Math.max(0, Math.round(toNumber(fen, 0)));
  return `¥${(value / 100).toFixed(2)}`;
}

/* ---------- 聊天页面 ---------- */

function renderChatPage() {
  const chat = state.currentChat;
  if (!chat) return `<div class="empty-state"><p>聊天窗口不存在。</p><button class="btn primary" data-route="messages">返回消息</button></div>`;
  const members = chat.members.map((id) => getById(state.characters, id)).filter(Boolean);
  const typing = [...state.typingCharIds].map((id) => getById(state.characters, id)?.name).filter(Boolean);
  const groupState = chat.groupState;
  const quickGroups = state.quickReplies.filter((item) => state.settings.activeQuickReplyIds.includes(item.id));
  const quickButtons = quickGroups.flatMap((group) => group.qrList.filter((item) => !item.isHidden).slice(0, 8).map((item) => ({ group, item })));
  return `
    <div class="page chat-page">
      <header class="topbar">
        <button class="icon-btn" data-action="back-from-chat" title="返回">‹</button>
        <div class="chat-heading">
          <strong>${escapeHtml(chat.title || members.map((item) => item.name).join("、"))}</strong>
          <span>${typing.length ? `${escapeHtml(typing.join("、"))} 正在输入…` : (chat.type === "group" ? `${members.length} 位角色` : "在线")}</span>
        </div>
        <button class="icon-btn" data-action="start-voice-call" title="语音通话">☎</button>
        <button class="icon-btn" data-action="start-video-call" title="视频通话">▣</button>
        <button class="icon-btn" data-action="search-chat" title="搜索">⌕</button>
        <button class="icon-btn" data-action="chat-menu" title="菜单">⋯</button>
      </header>
      ${chat.type === "group" && groupState ? `
        <div class="group-check">
          <strong>导演判定：</strong>${escapeHtml(groupState.directorNote || (groupState.directorEnabled ? "按角色关系依次推进" : "关闭"))}<br>
          <strong>互不知情校验：</strong>${escapeHtml(groupState.isolationCheck.lastResult || "尚未校验")}
        </div>` : ""}
      <div id="messageScroll" class="page-scroll">${renderMessages(chat, members)}</div>
      <div class="composer-wrap">
        ${quickButtons.length ? `<div class="quick-bar">${quickButtons.map(({ group, item }) => `<button class="quick-chip" data-action="use-quick-reply" data-qr-group="${escapeAttr(group.id)}" data-qr-id="${escapeAttr(String(item.id))}">${escapeHtml(item.label || item.message.slice(0, 12))}</button>`).join("")}</div>` : ""}
        ${state.replyTo ? `<div class="reply-banner">↩ <span>${escapeHtml(messagePreview(state.replyTo))}</span><button data-action="cancel-reply">×</button></div>` : ""}
        <div class="composer">
          <button class="composer-btn" data-action="toggle-voice-record" title="录音">◉</button>
          <button class="composer-btn" data-action="send-photo" title="相册图片">▧</button>
          <textarea id="chatInput" rows="1" placeholder="输入消息…" data-input="chat"></textarea>
          <button class="composer-btn" data-action="chat-more" title="更多">＋</button>
          <button class="send-btn" data-action="send-message" title="发送">➤</button>
        </div>
      </div>
    </div>`;
}

function renderMessages(chat, members) {
  if (!state.currentMessages.length) {
    return `<div class="empty-state"><div class="empty-illustration">…</div><h2>开始这段对话</h2><p>第一条消息会持久化在本机。角色开场白不会自动写入，只有你主动使用才会创建。</p></div>`;
  }
  let lastDate = "";
  return `
    <div class="message-list">
      ${state.currentMessages.map((message) => {
        const dateKey = new Date(message.time).toLocaleDateString("zh-CN");
        const divider = dateKey !== lastDate ? `<div class="date-divider">${escapeHtml(dateKey)}</div>` : "";
        lastDate = dateKey;
        return divider + renderMessage(message, members);
      }).join("")}
      ${[...state.typingCharIds].map((charId) => renderTypingMessage(charId)).join("")}
    </div>`;
}

function renderTypingMessage(charId) {
  const character = getById(state.characters, charId);
  return `
    <div class="msg them">
      ${renderAvatar(character)}
      <div class="msg-stack">
        <span class="msg-author">${escapeHtml(character?.name || "角色")}</span>
        <div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>
      </div>
    </div>`;
}

function renderMessage(message, members) {
  if (message.role === "system" || message.type === "system") {
    return `<div class="system-msg">${escapeHtml(message.text)}</div>`;
  }
  const character = message.charId ? getById(state.characters, message.charId) : null;
  const isMe = message.role === "user";
  const reply = message.replyTo ? state.currentMessages.find((item) => item.id === message.replyTo) : null;
  const meta = [formatTime(message.time)];
  if (message.edited) meta.push("已编辑");
  if (message.generation?.completionTokens) meta.push(`${message.generation.completionTokens} tk`);
  return `
    <article class="msg ${isMe ? "me" : "them"}" data-message-id="${escapeAttr(message.id)}">
      ${isMe ? "" : renderAvatar(character)}
      <div class="msg-stack">
        ${!isMe && state.currentChat.type === "group" ? `<span class="msg-author">${escapeHtml(character?.name || "角色")}</span>` : ""}
        ${reply ? `<div class="msg-quote">${escapeHtml(messagePreview(reply))}</div>` : ""}
        <div class="bubble ${message.type === "image" || message.type === "video" ? "media-bubble" : ""}">
          ${renderMessageBody(message)}
        </div>
        ${message.regeneratedFrom ? `<div class="regenerate-note">已重新生成</div>` : ""}
        <div class="msg-meta">${meta.map(escapeHtml).join(" · ")}</div>
        <div class="msg-actions">
          <button data-action="reply-message" data-message-id="${escapeAttr(message.id)}">引用</button>
          <button data-action="copy-message" data-message-id="${escapeAttr(message.id)}">复制</button>
          ${message.type === "text" && !isMe ? `<button data-action="speak-message" data-message-id="${escapeAttr(message.id)}">朗读</button>` : ""}
          ${message.type === "transfer" && message.meta.status !== "accepted" ? `<button data-action="accept-transfer" data-message-id="${escapeAttr(message.id)}">领取</button>` : ""}
          ${message.type === "text" && !isMe ? `<button data-action="generate-message-image" data-message-id="${escapeAttr(message.id)}">配图</button><button data-action="generate-message-video" data-message-id="${escapeAttr(message.id)}">短片</button>` : ""}
          ${!isMe ? `<button data-action="character-emoji" data-message-id="${escapeAttr(message.id)}">表情</button>` : ""}
          ${!isMe ? `<button data-action="regenerate-message" data-message-id="${escapeAttr(message.id)}">重 roll</button>` : ""}
          <button data-action="edit-message" data-message-id="${escapeAttr(message.id)}">编辑</button>
          <button data-action="delete-message" data-message-id="${escapeAttr(message.id)}">删除</button>
        </div>
      </div>
    </article>`;
}

function renderMessageBody(message) {
  const cachedMedia = message.meta.mediaId ? state.mediaCache.get(message.meta.mediaId) : null;
  if (message.type === "voice") {
    const waveform = message.meta.waveform?.length ? message.meta.waveform : Array.from({ length: 24 }, () => 5 + Math.random() * 18);
    const audioReady = Boolean(message.meta.audioUrl || cachedMedia?.data);
    return `
      <div class="voice-card">
        <button class="voice-play" data-action="play-voice" data-message-id="${escapeAttr(message.id)}" ${message.meta.mediaId && !audioReady ? `data-media-id="${escapeAttr(message.meta.mediaId)}" disabled` : ""}>▶</button>
        <span class="waveform">${waveform.map((height) => `<i style="height:${clamp(height, 4, 24)}px"></i>`).join("")}</span>
        <span class="voice-duration">${formatDuration(message.meta.duration)}</span>
      </div>
      ${message.text ? `<div class="media-caption">${escapeHtml(message.text)}</div>` : ""}`;
  }
  if (message.type === "image") {
    const source = message.meta.mediaUrl || cachedMedia?.data || message.meta.thumbnail || cachedMedia?.thumbnail || "";
    if (!source && message.meta.mediaId) {
      return `<img data-media-id="${escapeAttr(message.meta.mediaId)}" data-media-kind="image" alt="${escapeAttr(message.text || "图片")}">${message.text ? `<div class="media-caption">${escapeHtml(message.text)}</div>` : ""}`;
    }
    return source
      ? `<img src="${escapeAttr(source)}" alt="${escapeAttr(message.text || "生成图片")}">${message.text ? `<div class="media-caption">${escapeHtml(message.text)}</div>` : ""}`
      : `<div class="media-caption">${escapeHtml(message.text || "图片生成结果缺少可用地址")}</div>`;
  }
  if (message.type === "video") {
    const source = message.meta.mediaUrl || cachedMedia?.data || "";
    if (!source && message.meta.mediaId) {
      return `<video data-media-id="${escapeAttr(message.meta.mediaId)}" data-media-kind="video" controls preload="metadata"></video>${message.text ? `<div class="media-caption">${escapeHtml(message.text)}</div>` : ""}`;
    }
    return source
      ? `<video src="${escapeAttr(source)}" ${message.meta.thumbnailMediaId ? `data-thumbnail-media-id="${escapeAttr(message.meta.thumbnailMediaId)}"` : ""} controls preload="metadata"></video>${message.text ? `<div class="media-caption">${escapeHtml(message.text)}</div>` : ""}`
      : `<div class="media-caption">${escapeHtml(message.text || "视频生成结果缺少可用地址")}</div>`;
  }
  if (message.type === "emoji") {
    return `<div class="emoji-message">${escapeHtml(message.text || "🙂")}</div>`;
  }
  if (message.type === "location") {
    const location = message.meta.location || {};
    return `
      <div class="location-message">
        <div class="location-map"><span>⌖</span></div>
        <strong>${escapeHtml(location.label || message.text || "我在这里")}</strong>
        <small>${escapeHtml(location.detail || "位置分享")}</small>
      </div>`;
  }
  if (message.type === "transfer") {
    return `
      <div class="transfer-message ${message.meta.status === "accepted" ? "accepted" : ""}">
        <span class="transfer-icon">¥</span>
        <span><strong>${escapeHtml(message.meta.title || "红包")}</strong><small>${formatMoney(message.meta.amountFen || 0)} · ${message.meta.status === "accepted" ? "已领取" : "待领取"}</small></span>
      </div>`;
  }
  return renderRichContent(message.text, message);
}

async function hydrateMessageMedia() {
  const nodes = $$("[data-media-id]");
  for (const node of nodes) {
    const mediaId = node.dataset.mediaId;
    const media = await getCachedMedia(mediaId);
    if (!media) continue;
    if (node.matches("img")) node.src = media.data || media.thumbnail;
    if (node.matches("video")) {
      node.src = media.data;
      if (media.thumbnail) node.poster = media.thumbnail;
    }
    if (node.matches("button")) node.disabled = false;
  }
  const thumbnailNodes = $$("[data-thumbnail-media-id]");
  for (const node of thumbnailNodes) {
    const media = await getCachedMedia(node.dataset.thumbnailMediaId);
    if (media?.thumbnail) node.poster = media.thumbnail;
  }
}

/* ---------- 富文本与正则 ---------- */

function parseFindRegex(value) {
  const source = String(value || "").trim();
  if (!source) throw new Error("正则表达式为空");
  if (source.startsWith("/")) {
    const match = source.match(/^\/([\s\S]*)\/([a-z]*)$/i);
    if (match) return new RegExp(match[1], match[2].replace("g", "") + "g");
  }
  return new RegExp(source, "g");
}

function applyRegexScripts(text, placement, depth = 0, options = {}) {
  let output = String(text ?? "");
  for (const script of state.regexScripts) {
    if (script.disabled) continue;
    if (!script.placement?.includes(placement)) continue;
    if (options.markdown && (!script.markdownOnly || script.promptOnly)) continue;
    if (options.prompt && (!script.promptOnly || script.markdownOnly)) continue;
    if (script.minDepth !== null && script.minDepth !== undefined && depth < script.minDepth) continue;
    if (script.maxDepth !== null && script.maxDepth !== undefined && depth > script.maxDepth) continue;
    try {
      output = output.replace(parseFindRegex(script.findRegex), script.replaceString ?? "");
      for (const trim of script.trimStrings || []) output = output.replaceAll(trim, "");
    } catch (error) {
      console.warn(`正则脚本 ${script.scriptName || script.id} 执行失败`, error);
    }
  }
  return output;
}

function renderRichContent(rawText, message) {
  const messageIndex = state.currentMessages.findIndex((item) => item.id === message.id);
  const depth = Math.max(0, state.currentMessages.length - messageIndex - 1);
  const html = applyRegexScripts(rawText || "", 2, depth, { markdown: true });
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(html);
  if (!hasHtml) {
    const safe = escapeHtml(html)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
    return `<p>${safe}</p>`;
  }
  const styles = getComputedStyle(document.body);
  const color = styles.getPropertyValue("--fg").trim();
  const dim = styles.getPropertyValue("--dim").trim();
  const panel = styles.getPropertyValue("--panel").trim();
  const line = styles.getPropertyValue("--line").trim();
  const acc = styles.getPropertyValue("--acc").trim();
  const font = styles.getPropertyValue("--font").trim();
  const srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;background:transparent;color:${color};font-family:${font};font-size:13.5px;line-height:1.65;overflow:hidden}
    *{max-width:100%;box-sizing:border-box}img,video{height:auto;border-radius:8px}
    details{border:1px solid ${line};border-radius:8px;padding:8px;background:${panel}}
    summary{cursor:pointer;font-weight:700;color:${acc}}a{color:${acc}}
    .status-panel{border:1px solid ${line};border-radius:8px;padding:8px;background:${panel}}
    pre{white-space:pre-wrap;overflow-wrap:anywhere}small{color:${dim}}
  </style></head><body>${html}<script>
    function report(){try{parent.postMessage({type:'pocketlink-height',id:${JSON.stringify(message.id)},height:Math.max(32,document.documentElement.scrollHeight)},'*')}catch(e){}}
    new ResizeObserver(report).observe(document.documentElement);addEventListener('load',report);setTimeout(report,80);
  <\/script></body></html>`;
  return `<iframe class="rich-frame" data-message-frame="${escapeAttr(message.id)}" sandbox="allow-scripts allow-forms" srcdoc="${escapeAttr(srcdoc)}"></iframe>`;
}

function handleIframeMessage(event) {
  const data = event.data;
  if (!data || data.type !== "pocketlink-height" || !data.id) return;
  const frame = document.querySelector(`[data-message-frame="${CSS.escape(data.id)}"]`);
  if (frame) frame.style.height = `${clamp(Number(data.height) || 32, 32, 1800)}px`;
}

/* ---------- 角色卡与世界书转换 ---------- */

function characterFromTavern(data, raw, rawFormat) {
  const source = data.data && (data.spec || data.data.name) ? data.data : data;
  const character = defaultCharacter();
  character.name = source.name || data.name || "";
  character.persona = normalizeText(source.description ?? data.description ?? "");
  character.personality = normalizeText(source.personality ?? data.personality ?? "");
  character.scenario = normalizeText(source.scenario ?? data.scenario ?? "");
  character.firstMessage = normalizeText(source.first_mes ?? data.first_mes ?? "");
  character.examples = parseExamples(source.mes_example ?? data.mes_example ?? "");
  character.alternateGreetings = Array.isArray(source.alternate_greetings) ? source.alternate_greetings.map(String) : [];
  character.systemPrompt = normalizeText(source.system_prompt ?? data.system_prompt ?? "");
  character.postHistoryInstructions = normalizeText(source.post_history_instructions ?? data.post_history_instructions ?? "");
  character.tag = Array.isArray(source.tags) && source.tags.length ? String(source.tags[0]) : "";
  character.extensions = source.extensions || data.extensions || null;
  character.raw = raw;
  character.rawFormat = rawFormat;
  return character;
}

function parseExamples(value) {
  const text = normalizeText(value).trim();
  if (!text) return [];
  const userMatches = [...text.matchAll(/<START>\s*\{\{user\}\}:\s*([\s\S]*?)(?=\n\{\{char\}\}:|$)/gi)];
  const charMatches = [...text.matchAll(/\{\{char\}\}:\s*([\s\S]*?)(?=\n<START>|$)/gi)];
  const length = Math.max(userMatches.length, charMatches.length);
  const examples = [];
  for (let index = 0; index < length; index += 1) {
    examples.push({
      user: userMatches[index]?.[1]?.trim() || "",
      char: charMatches[index]?.[1]?.trim() || ""
    });
  }
  return examples.filter((item) => item.user || item.char);
}

function worldbookFromTavern(data, raw, rawFormat) {
  const worldbook = defaultWorldbook();
  worldbook.name = data.name || data.title || "导入世界书";
  worldbook.description = data.description || "";
  worldbook.raw = raw;
  worldbook.rawFormat = rawFormat;
  const entries = Array.isArray(data.entries) ? data.entries : Object.values(data.entries || {});
  worldbook.entries = entries.map((entry) => worldbookEntryFromTavern(entry, worldbook.id));
  return worldbook;
}

function worldbookEntryFromTavern(entry, worldbookId) {
  const target = defaultWorldbookEntry(worldbookId);
  target.uid = toNumber(entry.uid, 0);
  target.key = toLines(entry.key || entry.keys || []);
  target.keysecondary = toLines(entry.keysecondary || []);
  target.comment = entry.comment || entry.name || "";
  target.content = normalizeText(entry.content || "");
  target.constant = Boolean(entry.constant);
  target.disable = Boolean(entry.disable);
  target.vectorized = Boolean(entry.vectorized);
  target.selective = Boolean(entry.selective);
  target.selectiveLogic = toNumber(entry.selectiveLogic, 0);
  target.addMemo = entry.addMemo !== false;
  target.order = toNumber(entry.order, 100);
  target.position = toNumber(entry.position, 0);
  target.depth = toNumber(entry.depth, 4);
  target.probability = toNumber(entry.probability, 100);
  target.useProbability = entry.useProbability !== false;
  target.group = entry.group || "";
  target.groupWeight = toNumber(entry.groupWeight, 100);
  target.scanDepth = entry.scanDepth ?? null;
  target.caseSensitive = entry.caseSensitive ?? null;
  target.matchWholeWords = entry.matchWholeWords ?? null;
  target.automationId = entry.automationId || "";
  target.role = entry.role ?? null;
  target.sticky = toNumber(entry.sticky, 0);
  target.cooldown = toNumber(entry.cooldown, 0);
  target.delay = toNumber(entry.delay, 0);
  target.displayIndex = toNumber(entry.displayIndex, 0);
  target.characterFilter = {
    isExclude: Boolean(entry.characterFilter?.isExclude),
    names: Array.isArray(entry.characterFilter?.names) ? entry.characterFilter.names : [],
    tags: Array.isArray(entry.characterFilter?.tags) ? entry.characterFilter.tags : []
  };
  target.visibility = entry.visibility || "public";
  target.ownerCharId = entry.ownerCharId || null;
  return target;
}

function presetFromTavern(data) {
  const preset = defaultPreset();
  Object.assign(preset, clone(data || {}));
  preset.id = uid();
  preset.createdAt = now();
  preset.updatedAt = now();
  preset.name = data.name || data.preset_name || "导入预设";
  preset.description = data.description || "";
  preset.raw = clone(data);
  preset.rawFormat = "tavern_preset";
  preset.prompts = Array.isArray(data.prompts)
    ? data.prompts.map((prompt) => ({ ...defaultPreset().prompts[0], ...prompt }))
    : [];
  preset.prompt_order = Array.isArray(data.prompt_order) ? data.prompt_order : [];
  return preset;
}

function cssColor(value, fallback) {
  return String(value || fallback || "#888");
}

function lightenCssColor(value, amount, fallback) {
  const match = String(value || "").match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return fallback;
  const channel = (index) => clamp(Number(match[index]) + amount, 0, 255);
  return `rgb(${channel(1)},${channel(2)},${channel(3)})`;
}

function themeFromTavern(data) {
  return {
    id: uid(), createdAt: now(), updatedAt: now(),
    name: data.name || "导入主题", builtIn: false, desc: "SillyTavern 导入",
    vars: {
      bg: cssColor(data.chat_tint_color, "#1d1d20"),
      bg2: cssColor(data.blur_tint_color, "#29292c"),
      panel: cssColor(data.blur_tint_color, "#29292c"),
      panel2: lightenCssColor(data.blur_tint_color, 8, "#343438"),
      pop: lightenCssColor(data.blur_tint_color, 14, "#3d3d42"),
      line: cssColor(data.border_color, "#171717"),
      line2: lightenCssColor(data.border_color, 18, "#343434"),
      fg: cssColor(data.main_text_color, "#dbdbd6"),
      dim: cssColor(data.italics_text_color, "#9d9d9d"),
      faint: lightenCssColor(data.italics_text_color, -14, "#777"),
      acc: cssColor(data.quote_text_color, "#9ad6cf"),
      acc2: cssColor(data.underline_text_color, "#f1be9a"),
      ok: "#57bb84", warn: "#e2a63c", err: "#e5564b",
      me: cssColor(data.user_mes_blur_tint_color, "#414141"),
      meFg: cssColor(data.main_text_color, "#fff"),
      bubble: cssColor(data.bot_mes_blur_tint_color, "#393939"),
      radius: "18px", radiusBubble: "12px",
      font: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif",
      shadow: `0 8px 28px ${cssColor(data.shadow_color, "rgba(34,34,34,.3)")}`,
      shadowBubble: `0 2px 8px ${cssColor(data.shadow_color, "rgba(34,34,34,.2)")}`
    },
    raw: clone(data), rawFormat: "tavern_theme", customCss: data.custom_css || ""
  };
}

function regexFromTavern(data) {
  const script = defaultRegexScript();
  Object.assign(script, clone(data || {}));
  script.id = uid();
  script.createdAt = now();
  script.updatedAt = now();
  script.scriptName = data.scriptName || data.name || "导入正则";
  script.placement = Array.isArray(data.placement) ? data.placement.map(Number) : [2];
  script.raw = clone(data);
  return script;
}

function quickReplyFromTavern(data) {
  const group = defaultQuickReply();
  Object.assign(group, clone(data || {}));
  group.id = uid();
  group.createdAt = now();
  group.updatedAt = now();
  group.name = data.name || "导入快捷回复";
  group.qrList = Array.isArray(data.qrList) ? data.qrList.map((item, index) => ({
    id: toNumber(item.id, index + 1),
    showLabel: Boolean(item.showLabel),
    label: item.label || item.title || item.message?.slice(0, 12) || `按钮 ${index + 1}`,
    title: item.title || "",
    message: item.message || "",
    contextList: Array.isArray(item.contextList) ? item.contextList : [],
    preventAutoExecute: item.preventAutoExecute !== false,
    isHidden: Boolean(item.isHidden),
    executeOnStartup: Boolean(item.executeOnStartup),
    executeOnUser: Boolean(item.executeOnUser),
    executeOnAi: Boolean(item.executeOnAi),
    executeOnChatChange: Boolean(item.executeOnChatChange),
    executeOnGroupMemberDraft: Boolean(item.executeOnGroupMemberDraft),
    executeOnNewChat: Boolean(item.executeOnNewChat),
    automationId: item.automationId || ""
  })) : [];
  group.raw = clone(data);
  return group;
}

/* ---------- 导入与 PNG 解析 ---------- */

function pickFile(kind, accept = ".json,.png,application/json,image/png") {
  state.pendingFileImport = kind;
  const input = $("#globalFileInput");
  input.value = "";
  input.accept = accept;
  input.click();
}

async function handleFileSelected(event) {
  const file = event.target.files?.[0];
  const kind = state.pendingFileImport || "auto";
  state.pendingFileImport = null;
  if (!file) return;
  try {
    await importFile(file, kind);
  } catch (error) {
    console.error(error);
    toast(error.message || "导入失败", "error", 4200);
  }
}

function isCharacterCard(data) {
  if (!isObject(data)) return false;
  return data.spec === "chara_card_v3"
    || data.spec === "chara_card_v2"
    || (isObject(data.data) && (data.data.name !== undefined || data.data.description !== undefined || data.data.first_mes !== undefined))
    || (data.first_mes !== undefined && data.name !== undefined);
}

async function importFile(file, kind = "auto") {
  const extension = file.name.split(".").pop().toLowerCase();
  if (kind === "chat-image" || kind === "chat-video") {
    await sendChatMediaFile(file, kind === "chat-image" ? "image" : "video");
    return;
  }
  if (kind === "character-png" || ((kind === "auto" || kind === "character") && (extension === "png" || file.type === "image/png"))) {
    const rawText = await extractCharacterJsonFromPng(file);
    const json = JSON.parse(rawText);
    const character = characterFromTavern(json, json, "tavern_png_v3");
    await saveImportedCharacter(character, json);
    toast(`角色卡 ${character.name || "未命名角色"} 已导入`);
    await refreshAll();
    state.contentTab = "characters";
    state.profileTab = "content";
    navigate("profile");
    return;
  }

  const text = await file.text();
  const data = JSON.parse(text);
  if (kind === "health") {
    state.settings.health = {
      heartRate: data.heartRate ?? null,
      temperature: data.temperature ?? null,
      sleep: data.sleep ?? null,
      steps: data.steps ?? null,
      location: data.location || "",
      weather: data.weather || "",
      updatedAt: now(),
      lastPerceptions: {}
    };
    updateHealthPerceptions();
    await saveSettings();
  } else if (kind === "backup" || (isObject(data) && data.app === "PocketLink" && data.stores)) {
    await restoreBackup(data);
  } else if (kind === "character" || isCharacterCard(data)) {
    const character = characterFromTavern(data, data, data.spec === "chara_card_v3" ? "tavern_json_v3" : "manual");
    await saveImportedCharacter(character, data);
    toast(`角色卡 ${character.name || "未命名角色"} 已导入`);
  } else if (kind === "worldbook" || (isObject(data) && (data.entries !== undefined || data.world_info !== undefined))) {
    const source = data.entries !== undefined ? data : { ...data, entries: data.world_info || {} };
    const worldbook = worldbookFromTavern(source, data, Array.isArray(source.entries) ? "tavern_worldbook_array" : "tavern_worldbook_object");
    await dbPut("worldbooks", worldbook);
    toast(`世界书 ${worldbook.name} 已导入，共 ${worldbook.entries.length} 条`);
  } else if (kind === "preset" || (isObject(data) && (Array.isArray(data.prompts) || data.openai_max_context !== undefined || (data.temperature !== undefined && data.prompt_order)))) {
    const preset = presetFromTavern(data);
    await dbPut("presets", preset);
    toast(`预设 ${preset.name} 已导入`);
  } else if (kind === "theme" || (isObject(data) && data.main_text_color !== undefined)) {
    const theme = themeFromTavern(data);
    await dbPut("themes", theme);
    toast(`主题 ${theme.name} 已导入`);
  } else if (kind === "regex" || Array.isArray(data) || (isObject(data) && data.findRegex !== undefined)) {
    const list = Array.isArray(data) ? data : (Array.isArray(data.scripts) ? data.scripts : [data]);
    for (const script of list.map(regexFromTavern)) await dbPut("regexScripts", script);
    toast(`已导入 ${list.length} 个正则脚本`);
  } else if (kind === "quick-reply" || (isObject(data) && Array.isArray(data.qrList))) {
    const group = quickReplyFromTavern(data);
    await dbPut("quickReplies", group);
    toast(`快捷回复组 ${group.name} 已导入`);
  } else {
    throw new Error("无法识别文件格式，请选择对应的导入入口");
  }
  await refreshAll();
  renderScreen();
}

async function sendChatMediaFile(file, type) {
  assert(state.currentChat, "请先打开聊天");
  const limit = type === "video" ? 28 * 1024 * 1024 : 12 * 1024 * 1024;
  if (file.size > limit) throw new Error(`${type === "video" ? "视频" : "图片"}文件超过 ${Math.round(limit / 1024 / 1024)} MB 限制`);
  const mediaUrl = type === "image" ? await imageFileToDataUrl(file, 1600, .88) : await fileToDataUrl(file);
  const mediaMeta = await storeMessageMedia(state.currentChat.id, mediaUrl, {
    mime: file.type || (type === "video" ? "video/mp4" : "image/jpeg"),
    fileName: file.name || "",
    fileSize: file.size
  });
  await sendUserMessage(file.name || "", type, {
    ...mediaMeta,
    mimeType: file.type || (type === "video" ? "video/mp4" : "image/jpeg"),
    fileName: file.name || "",
    fileSize: file.size
  });
}

async function saveImportedCharacter(character, raw) {
  await dbPut("characters", character);
  const source = raw.data && (raw.spec || raw.data.name) ? raw.data : raw;
  const embedded = source.character_book || raw.character_book;
  if (embedded?.entries) {
    const worldbook = worldbookFromTavern(
      { name: `${character.name || "角色"} · 内嵌世界书`, entries: embedded.entries },
      embedded, "tavern_worldbook_object"
    );
    worldbook.entries = worldbook.entries.map((entry) => ({ ...entry, ownerCharId: character.id }));
    await dbPut("worldbooks", worldbook);
    character.boundWorldbooks = [...new Set([...character.boundWorldbooks, worldbook.id])];
    await dbPut("characters", character);
  }
  const worldName = source.extensions?.world;
  if (worldName) {
    const worldbook = state.worldbooks.find((item) => item.name === worldName);
    if (worldbook && !character.boundWorldbooks.includes(worldbook.id)) {
      character.boundWorldbooks.push(worldbook.id);
      await dbPut("characters", character);
    }
  }
}

async function extractCharacterJsonFromPng(file) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  if (view.getUint32(0) !== 0x89504e47) throw new Error("不是有效的 PNG 文件");
  let offset = 8;
  const candidates = [];
  while (offset + 12 <= buffer.byteLength) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...new Uint8Array(buffer, offset + 4, 4));
    const dataStart = offset + 8;
    if (dataStart + length > buffer.byteLength) break;
    if (type === "tEXt") {
      const bytes = new Uint8Array(buffer, dataStart, length);
      const zero = bytes.indexOf(0);
      if (zero >= 0) {
        const keyword = new TextDecoder("latin1").decode(bytes.slice(0, zero));
        const value = new TextDecoder("latin1").decode(bytes.slice(zero + 1));
        if (keyword === "ccv3") candidates.unshift(value);
        if (keyword === "chara") candidates.push(value);
      }
    }
    if (type === "iTXt") {
      const bytes = new Uint8Array(buffer, dataStart, length);
      const zero = bytes.indexOf(0);
      if (zero >= 0) {
        const keyword = new TextDecoder("latin1").decode(bytes.slice(0, zero));
        if (keyword === "ccv3" || keyword === "chara") {
          const tail = bytes.slice(zero + 3);
          const textZero = tail.indexOf(0);
          const textBytes = textZero >= 0 ? tail.slice(textZero + 1) : tail;
          const value = new TextDecoder("utf-8").decode(textBytes);
          if (keyword === "ccv3") candidates.unshift(value);
          else candidates.push(value);
        }
      }
    }
    offset = dataStart + length + 4;
  }
  for (const candidate of candidates) {
    try {
      const binary = atob(candidate.trim());
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const decoded = new TextDecoder("utf-8").decode(bytes);
      JSON.parse(decoded);
      return decoded;
    } catch {
      continue;
    }
  }
  throw new Error("PNG 中没有找到可解析的 chara 或 ccv3 角色数据");
}

async function refreshAll() {
  await loadAllData();
  applyTheme();
  renderThemeRail();
}

/* ---------- API 配置与请求 ---------- */

function getApiConfig(id) {
  return getById(state.apiConfigs, id);
}

function getDefaultApi(category) {
  const key = category === "text" ? "defaultTextApiId" : category === "image" ? "defaultImageApiId" : "defaultVideoApiId";
  return getApiConfig(state.settings[key]) || state.apiConfigs.find((item) => item.category === category && item.enabled) || null;
}

function buildProxyUrl(url) {
  const proxy = String(state.settings.proxyUrl || "").trim();
  if (!proxy) return url;
  const separator = proxy.includes("?") ? "&" : "?";
  return `${proxy}${separator}url=${encodeURIComponent(url)}`;
}

function mergeHeaders(...headers) {
  return Object.assign({}, ...headers.filter(Boolean));
}

async function performFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 120_000);
  try {
    return await fetch(buildProxyUrl(url), {
      ...options,
      headers: mergeHeaders(state.settings.proxyHeaders || {}, options.headers || {}),
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("请求超时");
    throw new Error(`网络请求失败：${error.message}。如果是浏览器跨域限制，请在设置中填写 Python 代理地址。`);
  } finally {
    clearTimeout(timeout);
  }
}

function textEndpoint(config) {
  const base = String(config.baseUrl || "").replace(/\/+$/, "");
  if (config.provider === "anthropic") return base.includes("/messages") ? base : `${base}/v1/messages`;
  if (config.provider === "gemini") return base.includes(":generateContent") ? base : `${base}/models/${encodeURIComponent(config.model)}:generateContent`;
  if (config.provider === "deepseek") return base.includes("/chat/completions") ? base : `${base}/chat/completions`;
  return base.includes("/chat/completions") ? base : `${base}/chat/completions`;
}

function buildTextRequest(config, messages, options = {}) {
  const sampling = { ...config.sampling, ...(options.sampling || {}) };
  const reasoning = {
    mode: "auto",
    effort: "high",
    ...(config.reasoning || {}),
    ...(options.reasoning || {})
  };
  const reasoningBudget = reasoning.effort === "low" ? 4096 : reasoning.effort === "max" ? 16384 : 8192;
  const headers = { "Content-Type": "application/json", ...(config.requestTemplate?.headers || {}) };
  let url = textEndpoint(config);
  let body;
  if (config.provider === "anthropic") {
    headers["x-api-key"] = config.apiKey;
    headers["anthropic-version"] = "2023-06-01";
    body = {
      model: config.model,
      max_tokens: sampling.max_tokens || 4096,
      system: messages.filter((item) => item.role === "system").map((item) => item.content).join("\n\n"),
      messages: messages.filter((item) => item.role !== "system").map((item) => ({ role: item.role, content: item.content })),
      temperature: sampling.temperature ?? undefined,
      top_p: sampling.top_p ?? undefined,
      top_k: sampling.top_k ?? undefined
    };
    if (reasoning.mode === "on") {
      body.thinking = { type: "enabled", budget_tokens: reasoningBudget };
      body.max_tokens = Math.max(body.max_tokens, reasoningBudget + 1024);
    }
  } else if (config.provider === "gemini") {
    url += `${url.includes("?") ? "&" : "?"}key=${encodeURIComponent(config.apiKey)}`;
    body = {
      systemInstruction: { parts: messages.filter((item) => item.role === "system").map((item) => ({ text: item.content })) },
      contents: messages.filter((item) => item.role !== "system").map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }]
      })),
      generationConfig: {
        temperature: sampling.temperature ?? undefined,
        topP: sampling.top_p ?? undefined,
        topK: sampling.top_k ?? undefined,
        maxOutputTokens: sampling.max_tokens || 4096
      }
    };
    if (reasoning.mode !== "auto") {
      body.generationConfig.thinkingConfig = {
        thinkingBudget: reasoning.mode === "off" ? 0 : reasoningBudget
      };
    }
  } else if (config.provider === "custom" && config.requestTemplate?.bodyTemplate) {
    const contextText = messages.map((item) => `${item.role}: ${item.content}`).join("\n\n");
    const template = config.requestTemplate.bodyTemplate
      .replaceAll("{{model}}", config.model || "")
      .replaceAll("{{prompt}}", contextText)
      .replaceAll("{{apiKey}}", config.apiKey || "")
      .replaceAll("{{reasoningMode}}", reasoning.mode)
      .replaceAll("{{reasoningEffort}}", reasoning.effort);
    body = parseJsonSafe(template, { model: config.model, messages });
  } else {
    headers.Authorization = `Bearer ${config.apiKey}`;
    if (config.provider === "openrouter") {
      headers["HTTP-Referer"] = location.href.startsWith("file:") ? "https://pocketlink.local" : location.href;
      headers["X-Title"] = "PocketLink";
    }
    const openAiBody = {
      model: config.model,
      messages,
      temperature: sampling.temperature ?? undefined,
      top_p: sampling.top_p ?? undefined,
      max_tokens: sampling.max_tokens || undefined,
      frequency_penalty: sampling.frequency_penalty ?? undefined,
      presence_penalty: sampling.presence_penalty ?? undefined,
      top_k: sampling.top_k ?? undefined,
      stream: false
    };
    if (config.provider === "deepseek") {
      if (reasoning.mode === "off") {
        openAiBody.thinking = { type: "disabled" };
        delete openAiBody.top_p;
      } else {
        openAiBody.thinking = { type: "enabled" };
        openAiBody.reasoning_effort = reasoning.effort;
        delete openAiBody.temperature;
        delete openAiBody.frequency_penalty;
        delete openAiBody.presence_penalty;
        if (openAiBody.top_p !== undefined) openAiBody.top_p = Math.max(.95, openAiBody.top_p);
      }
    } else if (config.provider === "openrouter") {
      openAiBody.reasoning = {
        enabled: reasoning.mode !== "off",
        ...(reasoning.mode === "on" ? { effort: reasoning.effort } : {})
      };
    } else if (reasoning.mode === "off") {
      openAiBody.reasoning_effort = "none";
    } else if (reasoning.mode === "on") {
      openAiBody.reasoning_effort = reasoning.effort;
    }
    body = openAiBody;
  }
  return { url, headers, body };
}

function parseTextResponse(config, data) {
  if (config.provider === "anthropic") {
    return {
      text: (data.content || []).map((item) => item.text || "").join(""),
      finishReason: data.stop_reason || "",
      usage: data.usage || {}
    };
  }
  if (config.provider === "gemini") {
    return {
      text: (data.candidates?.[0]?.content?.parts || []).map((item) => item.text || "").join(""),
      finishReason: data.candidates?.[0]?.finishReason || "",
      usage: data.usageMetadata || {}
    };
  }
  const choice = data.choices?.[0];
  const text = typeof choice?.message?.content === "string"
    ? choice.message.content
    : Array.isArray(choice?.message?.content)
      ? choice.message.content.map((item) => item.text || "").join("")
      : choice?.text || data.output_text || data.response || "";
  return {
    text,
    finishReason: choice?.finish_reason || data.finish_reason || "",
    usage: data.usage || {}
  };
}

function parseSseTextResponse(config, raw) {
  let text = "";
  let finishReason = "";
  let usage = {};
  for (const line of String(raw || "").split(/\r?\n/)) {
    if (!line.startsWith("data:")) continue;
    const payloadText = line.slice(5).trim();
    if (!payloadText || payloadText === "[DONE]") continue;
    const data = parseJsonSafe(payloadText, null);
    if (!data) continue;
    if (config.provider === "anthropic") {
      if (data.type === "content_block_delta") text += data.delta?.text || "";
      if (data.type === "message_delta") {
        finishReason = data.delta?.stop_reason || finishReason;
        usage = { ...usage, ...(data.usage || {}) };
      }
      if (data.type === "message_start") usage = { ...usage, ...(data.message?.usage || {}) };
      continue;
    }
    if (config.provider === "gemini") {
      text += (data.candidates?.[0]?.content?.parts || []).map((item) => item.text || "").join("");
      finishReason = data.candidates?.[0]?.finishReason || finishReason;
      usage = { ...usage, ...(data.usageMetadata || {}) };
      continue;
    }
    const choice = data.choices?.[0];
    const delta = choice?.delta?.content ?? choice?.message?.content ?? choice?.text ?? "";
    text += typeof delta === "string"
      ? delta
      : Array.isArray(delta)
        ? delta.map((item) => item.text || "").join("")
        : "";
    finishReason = choice?.finish_reason || data.finish_reason || finishReason;
    usage = { ...usage, ...(data.usage || {}) };
  }
  return { text, finishReason, usage };
}

async function sendTextCompletion(config, messages, options = {}) {
  assert(config, "未配置文字模型");
  assert(config.baseUrl, "API 地址为空");
  assert(config.model, "模型名称为空");
  const request = buildTextRequest(config, messages, options);
  const response = await performFetch(request.url, {
    method: config.requestTemplate?.method || "POST",
    headers: request.headers,
    body: JSON.stringify(request.body),
    timeout: options.timeout || 120_000
  });
  const raw = await response.text();
  const contentType = response.headers.get("content-type") || "";
  const isSse = contentType.includes("text/event-stream") || /^\s*data:/m.test(raw);
  const data = isSse ? null : parseJsonSafe(raw, null);
  if (!isSse && data === null) throw new Error(`接口返回的不是 JSON：${raw.slice(0, 180)}`);
  if (!response.ok) {
    const message = data?.error?.message || data?.message || data?.error || raw.slice(0, 180) || `HTTP ${response.status}`;
    throw new Error(`API 请求失败：${message}`);
  }
  const parsed = isSse ? parseSseTextResponse(config, raw) : parseTextResponse(config, data);
  if (!parsed.text) throw new Error("接口返回成功，但没有解析到文本内容");
  parsed.raw = isSse ? { sse: raw } : data;
  return parsed;
}

function getPathValue(value, path) {
  if (!path) return value;
  return String(path).replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean)
    .reduce((current, key) => current?.[key], value);
}

async function sendMediaRequest(config, prompt, options = {}) {
  assert(config, "未配置媒体生成接口");
  const template = config.requestTemplate || {};
  const referenceImage = options.referenceImage || "";
  const referenceData = String(referenceImage).includes(",") ? String(referenceImage).split(",").pop() : "";
  const referenceMime = dataUrlMime(referenceImage) || options.referenceMime || "image/jpeg";
  const url = String(config.baseUrl || "")
    .replaceAll("{{model}}", encodeURIComponent(config.model || ""))
    .replaceAll("{{prompt}}", encodeURIComponent(prompt || ""))
    .replaceAll("{{apiKey}}", encodeURIComponent(config.apiKey || ""))
    .replaceAll("{{referenceImage}}", encodeURIComponent(referenceImage));
  const headers = { "Content-Type": "application/json", ...(template.headers || {}) };
  if (config.apiKey && !headers.Authorization && !headers["x-api-key"]) headers.Authorization = `Bearer ${config.apiKey}`;
  let body = String(template.bodyTemplate || "")
    .replaceAll("{{model}}", JSON.stringify(config.model || "").slice(1, -1))
    .replaceAll("{{prompt}}", JSON.stringify(prompt || "").slice(1, -1))
    .replaceAll("{{apiKey}}", JSON.stringify(config.apiKey || "").slice(1, -1))
    .replaceAll("{{referenceImage}}", JSON.stringify(referenceImage).slice(1, -1))
    .replaceAll("{{referenceImageData}}", JSON.stringify(referenceData).slice(1, -1))
    .replaceAll("{{referenceImageMime}}", JSON.stringify(referenceMime).slice(1, -1));
  if (referenceImage && !/\{\{referenceImage/i.test(template.bodyTemplate || "")) {
    const parsed = parseJsonSafe(body, null);
    if (parsed) {
      if (Array.isArray(parsed.messages) && parsed.messages.length) {
        const message = parsed.messages[parsed.messages.length - 1];
        if (Array.isArray(message.content)) {
          message.content.push({ type: "image_url", image_url: { url: referenceImage } });
        } else {
          message.content = [
            { type: "text", text: normalizeText(message.content || prompt || "") },
            { type: "image_url", image_url: { url: referenceImage } }
          ];
        }
      } else {
        parsed.reference_image = referenceImage;
        parsed.image = referenceImage;
      }
      body = JSON.stringify(parsed);
    }
  }
  const response = await performFetch(url, {
    method: template.method || "POST",
    headers,
    body: template.method === "GET" ? undefined : body,
    timeout: 180_000
  });
  const raw = await response.text();
  const data = parseJsonSafe(raw, { raw });
  if (!response.ok) {
    const message = data.error?.message || data.message || `HTTP ${response.status}`;
    throw new Error(`媒体接口请求失败：${message}`);
  }
  let result = getPathValue(data, template.responsePath || "data.0.url");
  if (!result) result = data.url || data.output?.[0] || data.data?.[0]?.url || data.data?.[0]?.b64_json;
  if (!result) throw new Error("响应路径没有解析到媒体 URL 或 Base64 数据");
  if (String(result).startsWith("data:")) return result;
  if (String(result).length > 200 && /^[A-Za-z0-9+/=]+$/.test(String(result))) return `data:image/png;base64,${result}`;
  return result;
}

async function testApiConfig(apiId) {
  const config = getApiConfig(apiId);
  assert(config, "接口不存在");
  try {
    if (config.category !== "text") throw new Error("图片/视频接口请在对应生成功能中测试。");
    await sendTextCompletion(config, [
      { role: "system", content: "只回复 OK。" },
      { role: "user", content: "连接测试" }
    ], { sampling: { max_tokens: 16, temperature: 0 } });
    config.lastTestedAt = now();
    config.lastTestResult = "ok";
    config.updatedAt = now();
    await dbPut("apiConfigs", config);
    return true;
  } catch (error) {
    config.lastTestedAt = now();
    config.lastTestResult = /401|403|key|auth/i.test(error.message) ? "auth_error"
      : /解析|JSON/i.test(error.message) ? "parse_error" : "network_error";
    await dbPut("apiConfigs", config);
    throw error;
  }
}

/* ---------- 提示词组装 ---------- */

function getPresetForChat(chat, character) {
  return getById(state.presets, chat?.presetOverride)
    || getById(state.presets, character?.boundPresetId)
    || getById(state.presets, state.settings.defaultPresetId)
    || null;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getWorldbookEntriesForCharacter(character, contextText, isGroup = false) {
  const entries = [];
  for (const worldbookId of character.boundWorldbooks || []) {
    const worldbook = getById(state.worldbooks, worldbookId);
    if (!worldbook) continue;
    for (const entry of worldbook.entries || []) {
      if (entry.disable) continue;
      if (entry.visibility === "private" && entry.ownerCharId && entry.ownerCharId !== character.id) continue;
      if (entry.visibility === "pov-only" && isGroup) continue;
      const filter = entry.characterFilter || {};
      if (filter.names?.length) {
        const matched = filter.names.includes(character.name);
        if (filter.isExclude ? matched : !matched) continue;
      }
      const keywords = [...(entry.key || []), ...(entry.keysecondary || [])].filter(Boolean);
      const hit = entry.constant || !keywords.length || keywords.some((keyword) => {
        const source = entry.caseSensitive ? contextText : contextText.toLowerCase();
        const target = entry.caseSensitive ? keyword : String(keyword).toLowerCase();
        if (entry.matchWholeWords) {
          return new RegExp(`(^|\\W)${escapeRegExp(target)}(\\W|$)`, entry.caseSensitive ? "" : "i").test(contextText);
        }
        return source.includes(target);
      });
      if (!hit) continue;
      if (entry.useProbability && entry.probability < 100 && Math.random() * 100 > entry.probability) continue;
      entries.push(entry);
    }
  }
  return entries.sort((a, b) => (a.order || 100) - (b.order || 100) || (a.displayIndex || 0) - (b.displayIndex || 0));
}

function formatWorldEntries(entries, preset) {
  if (!entries.length) return "";
  const template = preset?.wi_format || "{0}";
  return entries.map((entry) => template.replace("{0}", entry.content)).join("\n\n");
}

function buildCharacterCore(character, options = {}) {
  const parts = [];
  if (character.name) parts.push(`角色名：${character.name}`);
  if (character.persona) parts.push(`人设：\n${character.persona}`);
  if (character.personality) parts.push(`性格：\n${character.personality}`);
  const dimensions = describePersonalityDimensions(character.personalityDimensions);
  if (dimensions) parts.push(`人格微调：\n${dimensions}`);
  if (character.scenario) parts.push(`场景：\n${character.scenario}`);
  if (character.speechStyle) parts.push(`说话风格：\n${character.speechStyle}`);
  if (character.background) parts.push(`背景：\n${character.background}`);
  if (character.catchphrases?.length) parts.push(`常用口癖：${character.catchphrases.join("、")}`);
  if (character.systemPrompt) parts.push(character.systemPrompt);
  if (options.group) parts.push(`你正在群聊中扮演“${character.name}”。只以该角色身份发言，不代写其他角色。`);
  return parts.join("\n\n");
}

function describePersonalityDimensions(dimensions = {}) {
  const value = (key) => clamp(toNumber(dimensions[key], 50), 0, 100);
  const rules = [
    [value("rationality"), "更依赖直觉、感受和情绪反应，遇到选择时不太会先做理性分析", "习惯先分析因果、条件和风险，再做判断"],
    [value("humor"), "表达更轻松，偶尔会开玩笑或打趣", "表达更认真克制，很少把重要事情说成玩笑"],
    [value("empathy"), "更容易共情和照顾对方情绪，会主动接住细微的情绪变化", "更偏向冷静观察与解决问题，共情表达较克制"],
    [value("initiative"), "更愿意主动推进关系、提问和发起行动", "更倾向等待对方靠近，主动表达较少"],
    [value("directness"), "说话更直接明确，倾向把想法讲清楚", "表达更含蓄，常通过暗示、停顿或行动传达意思"]
  ];
  return rules.map(([score, low, high]) => score === 50 ? "" : score < 50 ? low : high).filter(Boolean).join("；");
}

function tokensForCharacter(character) {
  return estimateTokens(buildCharacterCore(character));
}

function buildHistoryMessages(chat, targetCharacter, maxTokens, existingMessages = null) {
  const source = existingMessages || state.currentMessages;
  const visible = source.filter((message) => !message.regeneratedTo?.length || message.id === source[source.length - 1]?.id);
  const messages = [];
  let tokens = estimateTokens(String(chat.summary || "")) + tokensForCharacter(targetCharacter);
  for (let index = visible.length - 1; index >= 0; index -= 1) {
    const message = visible[index];
    const historyText = messageToHistoryText(message);
    if (!historyText) continue;
    const messageTokens = estimateTokens(historyText) + 4;
    if (tokens + messageTokens > maxTokens) break;
    let content = historyText;
    if (chat.type === "group" && message.role === "char") {
      const sourceCharacter = getById(state.characters, message.charId);
      content = `${sourceCharacter?.name || "角色"}：${content}`;
    }
    messages.unshift({ role: message.role === "user" ? "user" : "assistant", content });
    tokens += messageTokens;
  }
  if (chat.summary) messages.unshift({ role: "system", content: `此前对话摘要：\n${chat.summary}` });
  return messages;
}

function messageToHistoryText(message) {
  if (message.role === "system" || message.type === "system") return "";
  if (message.type === "image") return `[发送了图片${message.text ? `：${message.text}` : ""}]`;
  if (message.type === "video") return `[发送了视频${message.text ? `：${message.text}` : ""}]`;
  if (message.type === "voice") return `[发送了语音${message.text ? `：${message.text}` : ""}]`;
  if (message.type === "emoji") return `[发送了表情：${message.text || "🙂"}]`;
  if (message.type === "location") return `[分享了位置：${message.meta.location?.label || message.text || ""}]`;
  if (message.type === "transfer") return `[发送了红包：${formatMoney(message.meta.amountFen || 0)}]`;
  return message.text || "";
}

function getHealthPerception(character, consume = false) {
  const health = state.settings.health || {};
  if (!health.updatedAt) return "";
  const permissions = character.permissions || {};
  const parts = [];
  if (permissions.heartRate && health.heartRate !== null) {
    parts.push(health.heartRate >= 100 ? "对方今天心跳偏快，似乎有些紧张或疲惫" : health.heartRate <= 55 ? "对方今天显得很安静，心率比平时低一些" : "对方今天状态平稳");
  }
  if (permissions.temperature && health.temperature !== null) {
    parts.push(health.temperature >= 37.4 ? "对方身体可能有些发热，需要留意" : health.temperature <= 35.8 ? "对方似乎有点发冷" : "对方的体温状态正常");
  }
  if (permissions.sleep && health.sleep !== null) {
    parts.push(health.sleep < 6 ? "对方昨晚休息得不够，可能有些困倦" : health.sleep > 8 ? "对方昨晚休息得不错，精神更放松" : "对方的睡眠大致正常");
  }
  if (permissions.steps && health.steps !== null) {
    parts.push(health.steps < 1500 ? "对方今天活动很少，可能一直坐着" : health.steps > 12000 ? "对方今天走了不少路，也许有些累" : "对方今天的活动量适中");
  }
  if (permissions.location !== "off" && health.location) {
    parts.push(permissions.location === "exact" ? `对方似乎正在${health.location}` : `对方大致在${health.location}所在的城市`);
  }
  if (permissions.weather && health.weather) parts.push(`对方那边${health.weather}`);
  const serialized = parts.join("；");
  const previous = state.settings.health.lastPerceptions?.[character.id] || "";
  if (!serialized || serialized === previous) return "";
  if (consume) {
    state.settings.health.lastPerceptions = { ...(state.settings.health.lastPerceptions || {}), [character.id]: serialized };
  }
  return serialized;
}

function updateHealthPerceptions() {
  state.healthPerceptions = [];
  const health = state.settings.health || {};
  if (!health.updatedAt) return;
  if (health.heartRate !== null) state.healthPerceptions.push(health.heartRate >= 100 ? "心率偏快，可能紧张或疲惫" : health.heartRate <= 55 ? "心率偏低，身心更安静" : "心率处于平稳范围");
  if (health.temperature !== null) state.healthPerceptions.push(health.temperature >= 37.4 ? "体温偏高，有发热迹象" : health.temperature <= 35.8 ? "体温偏低，可能发冷" : "体温状态正常");
  if (health.sleep !== null) state.healthPerceptions.push(health.sleep < 6 ? "睡眠不足，可能困倦" : health.sleep > 8 ? "休息充足，精神放松" : "睡眠尚可");
  if (health.steps !== null) state.healthPerceptions.push(health.steps < 1500 ? "活动很少" : health.steps > 12000 ? "活动量较大，可能疲惫" : "活动量适中");
  if (health.weather) state.healthPerceptions.push(`天气：${health.weather}`);
}

function getMomentFeedbackText(character) {
  const moment = (state.settings.moments || []).find((item) =>
    item.characterId === character.id
    && !item.respondedByChar
    && ((item.comments || []).some((comment) => comment.author !== character.name) || (item.likes || []).length)
  );
  if (!moment) return "";
  const comments = (moment.comments || []).map((comment) => `${comment.author}：${comment.text}`).join("；");
  return `用户最近对你的朋友圈作出了回应。动态：${moment.text}。互动：${comments || "点赞了" }。可以在当前聊天中自然地回应，但不要机械复述。`;
}

async function markMomentFeedbackResponded(characterId) {
  let changed = false;
  for (const moment of state.settings.moments || []) {
    if (moment.characterId === characterId && !moment.respondedByChar
      && ((moment.comments || []).some((comment) => comment.author !== getById(state.characters, characterId)?.name) || (moment.likes || []).length)) {
      moment.respondedByChar = true;
      changed = true;
    }
  }
  if (changed) await saveSettings();
}

function buildPromptMessages(chat, character, currentInput = "", options = {}) {
  const preset = getPresetForChat(chat, character);
  const recentText = state.currentMessages.slice(-12).map((message) => message.text || "").join("\n") + `\n${currentInput}`;
  const worldEntries = getWorldbookEntriesForCharacter(character, recentText, chat.type === "group");
  const worldText = formatWorldEntries(worldEntries, preset);
  const core = buildCharacterCore(character, { group: chat.type === "group" });
  const summary = chat.summary ? `此前对话摘要：\n${chat.summary}` : "";
  const userProfile = state.settings.userProfile?.description
    ? `用户设定：\n姓名：${state.settings.userProfile.name || "你"}\n${state.settings.userProfile.description}`
    : `用户姓名：${state.settings.userProfile?.name || "你"}`;
  const healthPerception = getHealthPerception(character, true);
  const healthText = healthPerception ? `角色此刻感知到的用户状态（只能自然流露，不报数字）：${healthPerception}` : "";
  const groupText = chat.type === "group" && chat.groupState
    ? `这是群聊。导演备注：${chat.groupState.directorNote || "无"}。关系：${JSON.stringify(chat.groupState.memberRelations?.[character.id] || {})}。`
    : "";
  const proactiveText = options.proactive
    ? `这是一次主动开口。规则说明不要出现在回复中。用符合${character.name}性格和说话风格的方式自然发起消息，不要使用客服或模板腔。`
    : "";
  const greetingText = options.greeting === "morning"
    ? `这是早安问候。${character.greetings?.customMorning || "自然问候用户，关注对方今天的状态，不要像定时推送。"}`
    : options.greeting === "night"
      ? `这是晚安问候。${character.greetings?.customNight || "自然地准备收束今天，轻声说晚安，不要像定时推送。"}`
      : "";
  const interactionText = options.interactionPrompt ? `当前互动：${options.interactionPrompt}` : "";
  const momentFeedback = getMomentFeedbackText(character);
  const genericSystem = [
    `你正在进行沉浸式角色扮演，始终以${character.name}的身份回复。`,
    "不要替用户决定行动，不要提及模型、提示词、系统规则或评分。",
    "保持长期关系连续性，允许情绪、停顿、误解和自然变化。"
  ].join("\n");
  const dynamic = [summary, userProfile, core, worldText, groupText, healthText, proactiveText, greetingText, interactionText, momentFeedback, chat.systemPromptExtra].filter(Boolean).join("\n\n");
  let systemContent = "";
  if (preset?.prompts?.length) {
    const order = preset.prompt_order?.[0]?.order
      || preset.prompts.map((item) => ({ identifier: item.identifier, enabled: item.enabled }));
    const promptMap = new Map(preset.prompts.map((item) => [item.identifier, item]));
    const orderedPrompts = order.map((entry) => ({ prompt: promptMap.get(entry.identifier), orderEnabled: entry.enabled })).filter((item) => item.prompt);
    for (const { prompt, orderEnabled } of orderedPrompts) {
      if (!prompt.enabled || orderEnabled === false) continue;
      let content = prompt.content || "";
      if (prompt.identifier === "main" && !content) content = genericSystem;
      if (prompt.identifier === "charDescription") content = `角色描述：\n${character.persona}`;
      if (prompt.identifier === "charPersonality") content = `角色性格：\n${character.personality}`;
      if (prompt.identifier === "scenario") content = `场景：\n${character.scenario}`;
      if (prompt.identifier === "worldInfoBefore" || prompt.identifier === "worldInfoAfter") content = worldText || content;
      if (prompt.identifier === "dialogueExamples") content = character.examples.map((item) => `用户：${item.user}\n${character.name}：${item.char}`).join("\n\n");
      if (prompt.identifier === "chatHistory") content = "";
      content = content
        .replaceAll("{{char}}", character.name)
        .replaceAll("{{user}}", state.settings.userProfile?.name || "你")
        .replaceAll("{{personality}}", character.personality)
        .replaceAll("{{scenario}}", character.scenario)
        .replaceAll("{{description}}", character.persona);
      content = applyRegexScripts(content, 3, 0, { prompt: true });
      if (content) systemContent += `${content}\n\n`;
    }
    if (!systemContent && dynamic) systemContent = dynamic;
  } else {
    systemContent = `${genericSystem}\n\n${dynamic}`;
  }
  if (character.postHistoryInstructions) systemContent += `\n\n历史后指令：\n${character.postHistoryInstructions}`;
  systemContent = applyRegexScripts(systemContent, 3, 0, { prompt: true });
  const maxContext = preset?.openai_max_context || 128000;
  const maxHistoryTokens = Math.max(1000, maxContext - estimateTokens(systemContent) - (preset?.openai_max_tokens || 4096));
  const history = buildHistoryMessages(chat, character, maxHistoryTokens);
  const messages = [{ role: "system", content: systemContent.trim() }, ...history];
  if (currentInput) messages.push({ role: "user", content: currentInput });
  if (preset?.assistant_prefill) messages.push({ role: "assistant", content: preset.assistant_prefill });
  return { messages, preset, worldEntries };
}

/* ---------- 聊天与角色操作 ---------- */

async function saveCharacter(character) {
  character.updatedAt = now();
  await dbPut("characters", character);
  await refreshAll();
  renderScreen();
}

async function createSingleChat(characterId, firstMessage = "") {
  const character = getById(state.characters, characterId);
  assert(character, "角色不存在");
  const chat = defaultChat("single", [characterId], character.name);
  await dbPut("chats", chat);
  await dbPut("characters", { ...character, stats: { ...character.stats, lastActiveAt: now() } });
  if (firstMessage) {
    const message = defaultMessage(chat.id, "char", characterId, "text", firstMessage);
    await dbPut("messages", message);
    chat.unread = 1;
    await dbPut("chats", chat);
  }
  await loadAllData();
  await openChat(chat.id);
}

async function openChat(chatId) {
  const chat = await dbGet("chats", chatId);
  if (!chat) {
    toast("聊天窗口不存在", "error");
    return;
  }
  const messages = await dbGetByIndex("messages", "chatId", chatId);
  messages.sort((a, b) => a.time - b.time);
  chat.unread = 0;
  await dbPut("chats", chat);
  state.currentChat = chat;
  state.currentChatId = chat.id;
  state.currentMessages = messages;
  state.replyTo = null;
  state.chats = state.chats.map((item) => item.id === chat.id ? chat : item);
  navigate("chat");
  renderNav();
}

async function sendUserMessage(text, type = "text", meta = {}) {
  const chat = state.currentChat;
  assert(chat, "没有打开聊天");
  let value = String(text || "").trim();
  if (!value && !["voice", "image", "video"].includes(type)) return;
  value = applyRegexScripts(value, 1, 0);
  const userMessage = defaultMessage(chat.id, "user", null, type, value, meta);
  userMessage.replyTo = state.replyTo?.id || null;
  state.currentMessages.push(userMessage);
  state.replyTo = null;
  await dbPut("messages", userMessage);
  chat.updatedAt = now();
  chat.lastActiveAt = now();
  chat.draft = "";
  await dbPut("chats", chat);
  const input = $("#chatInput");
  if (input) {
    input.value = "";
    autoSizeTextarea(input);
  }
  renderScreen();
  renderNav();
  const members = chat.members.map((id) => getById(state.characters, id)).filter(Boolean);
  if (chat.type === "single") {
    await generateCharacterReply(chat, members[0], { userInput: type === "text" || type === "voice" ? value : "" });
  } else {
    const order = chat.groupState?.turnOrder?.length ? chat.groupState.turnOrder : chat.members;
    for (const memberId of order) {
      const character = getById(state.characters, memberId);
      if (character) await generateCharacterReply(chat, character, { userInput: type === "text" || type === "voice" ? value : "" });
    }
  }
}

async function generateCharacterReply(chat, character, options = {}) {
  if (!character) return null;
  const config = getApiConfig(chat.modelOverride) || getDefaultApi("text");
  if (!config) {
    if (options.background) console.warn("主动消息跳过：未配置文字模型");
    else toast("请先前往“设置 → 模型 → API 配置”添加文字模型", "error", 4200);
    return null;
  }
  if (!options.background) {
    state.typingCharIds.add(character.id);
    renderScreen();
  }
  try {
    const prompt = buildPromptMessages(chat, character, options.userInput || "", {
      proactive: options.proactive,
      greeting: options.greeting,
      interactionPrompt: options.interactionPrompt
    });
    const result = await sendTextCompletion(config, prompt.messages, {
      sampling: { ...(character.sampling || {}), ...(config.sampling || {}) }
    });
    let text = result.text.trim();
    if (chat.type === "group" && chat.groupState?.isolationCheck?.enabled) {
      text = await enforceGroupIsolation(chat, character, text, prompt.messages, config);
    }
    const message = defaultMessage(chat.id, "char", character.id, "text", text, {
      tokens: result.usage.completion_tokens || estimateTokens(text)
    });
    message.generation = {
      model: config.model,
      presetId: prompt.preset?.id || null,
      promptTokens: result.usage.prompt_tokens || prompt.messages.reduce((sum, item) => sum + estimateTokens(item.content), 0),
      completionTokens: result.usage.completion_tokens || estimateTokens(text),
      finishReason: result.finishReason || ""
    };
    if (options.regenerateFrom) message.regeneratedFrom = options.regenerateFrom;
    state.currentMessages.push(message);
    await dbPut("messages", message);
    await maybeCreateGroupMilestone(chat, character, text);
    chat.updatedAt = now();
    chat.lastActiveAt = now();
    if (chat.groupState) chat.groupState.lastSpeakerId = character.id;
    await dbPut("chats", chat);
    const characterRecord = await dbGet("characters", character.id);
    if (characterRecord) {
      characterRecord.stats = { totalMessages: (characterRecord.stats?.totalMessages || 0) + 1, lastActiveAt: now() };
      await dbPut("characters", characterRecord);
    }
    await markMomentFeedbackResponded(character.id);
    return message;
  } catch (error) {
    console.error(error);
    const failed = defaultMessage(chat.id, "system", null, "system", `生成失败：${error.message}`);
    state.currentMessages.push(failed);
    await dbPut("messages", failed);
    if (!options.background) toast(error.message, "error", 5200);
    return null;
  } finally {
    if (!options.background) {
      state.typingCharIds.delete(character.id);
      renderScreen();
      renderNav();
    }
  }
}

async function enforceGroupIsolation(chat, character, text, previousPrompt, config) {
  const privateTexts = [];
  for (const worldbookId of character.boundWorldbooks || []) {
    const worldbook = getById(state.worldbooks, worldbookId);
    for (const entry of worldbook?.entries || []) {
      if (entry.visibility === "private" && entry.ownerCharId !== character.id) privateTexts.push(entry.content);
    }
  }
  if (!privateTexts.length) {
    chat.groupState.isolationCheck.lastResult = "未发现其他角色的私密条目";
    chat.groupState.isolationCheck.lastCheckedAt = now();
    await dbPut("chats", chat);
    return text;
  }
  const violation = privateTexts.some((privateText) => {
    const signature = String(privateText).replace(/\s+/g, "").slice(0, 30);
    return signature.length >= 8 && text.replace(/\s+/g, "").includes(signature);
  });
  if (!violation) {
    chat.groupState.isolationCheck.lastResult = "通过，未泄露其他角色私密信息";
    chat.groupState.isolationCheck.lastCheckedAt = now();
    await dbPut("chats", chat);
    return text;
  }
  chat.groupState.isolationCheck.violationCount += 1;
  chat.groupState.isolationCheck.lastResult = "检测到疑似泄露，已进行一次重生成";
  chat.groupState.isolationCheck.lastCheckedAt = now();
  await dbPut("chats", chat);
  try {
    const retry = await sendTextCompletion(config, [
      previousPrompt[0],
      { role: "system", content: `${character.name} 不得引用或暗示其他角色的私密设定。请忽略上一版可能泄露信息的内容，重新生成一条自然回复。` },
      ...previousPrompt.slice(1)
    ], { sampling: { temperature: 0.85 } });
    return retry.text.trim();
  } catch {
    return text;
  }
}

async function regenerateMessage(messageId) {
  const chat = state.currentChat;
  const index = state.currentMessages.findIndex((item) => item.id === messageId);
  if (index < 0) return;
  const old = state.currentMessages[index];
  const character = getById(state.characters, old.charId);
  assert(character, "找不到该角色");
  const oldHistory = state.currentMessages;
  state.currentMessages = oldHistory.slice(0, index);
  const replacement = await generateCharacterReply(chat, character, { regenerateFrom: old.id });
  if (replacement) {
    old.regeneratedTo = [...(old.regeneratedTo || []), replacement.id];
    await dbPut("messages", old);
    state.currentChat = chat;
    state.currentMessages = [...oldHistory.slice(0, index), replacement];
  } else {
    state.currentMessages = oldHistory;
  }
  renderScreen();
}

async function editMessage(messageId) {
  const message = state.currentMessages.find((item) => item.id === messageId);
  if (!message) return;
  openModal({
    title: "编辑消息",
    body: `<div class="field"><textarea class="tall" name="text" required>${escapeHtml(message.text)}</textarea></div>`,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          message.text = $("[name=text]", body).value.trim();
          message.edited = true;
          message.editedAt = now();
          await dbPut("messages", message);
          renderScreen();
          toast("消息已更新");
        }
      }
    ]
  });
}

async function deleteMessage(messageId) {
  if (!await confirmDialog("删除这条消息？", "删除后无法在应用内恢复。")) return;
  const message = state.currentMessages.find((item) => item.id === messageId);
  await deleteMessageMedia(message);
  await dbDelete("messages", messageId);
  state.currentMessages = state.currentMessages.filter((item) => item.id !== messageId);
  renderScreen();
}

async function createGroupChat(memberIds, name = "") {
  const unique = [...new Set(memberIds)].filter((id) => getById(state.characters, id));
  assert(unique.length >= 2, "群聊至少需要两个角色");
  const names = unique.map((id) => getById(state.characters, id).name);
  const chat = defaultChat("group", unique, name || names.join("、"));
  await dbPut("chats", chat);
  await loadAllData();
  await openChat(chat.id);
}

/* ---------- 纪念卡 ---------- */

async function createMemoryCard({
  characterIds = [],
  title = "值得记住的一刻",
  scene = "",
  keyDialogue = [],
  affinityAtTime = 0,
  imageUrl = null,
  chatId = null,
  messageIds = []
} = {}) {
  const memory = {
    id: uid(),
    characterIds,
    title,
    scene,
    keyDialogue,
    affinityAtTime,
    imageUrl,
    createdAt: now(),
    chatId,
    messageIds
  };
  state.settings.memoryCards.unshift(memory);
  await saveSettings();
  return memory;
}

async function createMemoryFromCurrentChat() {
  const chat = state.currentChat;
  assert(chat, "请先打开聊天");
  const recent = state.currentMessages.filter((message) => message.role !== "system").slice(-6);
  const members = chat.members.map((id) => getById(state.characters, id)).filter(Boolean);
  const title = window.prompt("给这张纪念卡起个名字", chat.title || "值得记住的一刻");
  if (!title) return;
  const scene = window.prompt("当时的场景或原因", recent.map(messagePreview).join(" · ").slice(0, 180));
  if (!scene) return;
  await createMemoryCard({
    characterIds: chat.members,
    title: title.trim(),
    scene: scene.trim(),
    keyDialogue: recent.map((message) => ({
      speaker: message.role === "user" ? state.settings.userProfile?.name || "你" : getById(state.characters, message.charId)?.name || members[0]?.name || "角色",
      text: message.text || messagePreview(message)
    })),
    chatId: chat.id,
    messageIds: recent.map((message) => message.id)
  });
  toast("纪念卡已保存");
}

async function maybeCreateGroupMilestone(chat, character, text) {
  if (chat.type !== "group") return;
  const recent = state.currentMessages.slice(-8);
  const combined = recent.map((message) => message.text || "").join(" ");
  const reconciliation = /对不起|抱歉|原谅|和解|别生气/.test(text)
    && /生气|讨厌|争吵|吵架|受伤/.test(combined);
  const conflict = /生气|讨厌|争吵|吵架|不许|离开/.test(text)
    && !/对不起|抱歉|和解/.test(text);
  const milestoneKey = reconciliation ? "和解" : conflict ? "争执" : "";
  if (!milestoneKey) return;
  const exists = (state.settings.memoryCards || []).some((memory) => memory.chatId === chat.id && memory.title.includes(`首次${milestoneKey}`));
  if (exists) return;
  await createMemoryCard({
    characterIds: chat.members,
    title: `首次${milestoneKey}`,
    scene: `${character.name}在群聊中推动了关系变化。`,
    keyDialogue: recent.slice(-5).map((message) => ({
      speaker: message.role === "user" ? state.settings.userProfile?.name || "你" : getById(state.characters, message.charId)?.name || "角色",
      text: message.text || messagePreview(message)
    })),
    chatId: chat.id,
    messageIds: recent.map((message) => message.id)
  });
}

/* ---------- 主动消息 ---------- */

function startProactiveEngine() {
  setInterval(checkProactiveMessages, 60_000);
  setTimeout(checkProactiveMessages, 8_000);
}

function insideTimeWindow(timeWindow) {
  const current = new Date();
  const minutes = current.getHours() * 60 + current.getMinutes();
  const parse = (value) => {
    const [hour, minute] = String(value || "00:00").split(":").map(Number);
    return hour * 60 + minute;
  };
  const start = parse(timeWindow?.[0] || "00:00");
  const end = parse(timeWindow?.[1] || "23:59");
  return start <= end ? minutes >= start && minutes <= end : minutes >= start || minutes <= end;
}

async function checkProactiveMessages() {
  if (!state.settings.proactiveGlobalEnabled || state.suppressProactiveOnce) return;
  state.suppressProactiveOnce = false;
  if (!getDefaultApi("text")) return;
  const maxPerCycle = clamp(toNumber(state.settings.proactiveMaxPerCycle, 3), 1, 20);
  let sentThisCycle = 0;
  for (const character of state.characters) {
    const relevantChats = state.chats.filter((chat) => chat.type === "single" && chat.members.includes(character.id) && !chat.archived);
    if (!relevantChats.length) continue;
    const chat = sortByTimeDesc(relevantChats)[0];
    const messages = await dbGetByIndex("messages", "chatId", chat.id);
    messages.sort((a, b) => a.time - b.time);
    const lastMessage = messages[messages.length - 1] || state.lastMessages.get(chat.id);
    const greeting = getGreetingTrigger(character, messages, lastMessage);
    let proactive = null;
    if (!greeting && character.proactive?.enabled) {
      proactive = getGeneralProactiveTrigger(character, lastMessage, chat);
    }
    if (!proactive && !greeting) continue;
    const previousChat = state.currentChat;
    const previousMessages = state.currentMessages;
    state.currentChat = chat;
    state.currentChatId = chat.id;
    state.currentMessages = messages;
    const generated = await generateCharacterReply(chat, character, {
      proactive: true,
      greeting,
      background: true,
      interactionPrompt: proactive?.instruction || ""
    });
    state.currentChat = previousChat;
    state.currentChatId = previousChat?.id || null;
    state.currentMessages = previousMessages;
    if (generated) {
      sentThisCycle += 1;
      character.proactive.lastSentAt = now();
      if (greeting === "morning") character.greetings.lastMorningAt = now();
      if (greeting === "night") character.greetings.lastNightAt = now();
      await dbPut("characters", character);
      if (!chat.muted) {
        chat.unread = (chat.unread || 0) + 1;
        chat.lastActiveAt = now();
        await dbPut("chats", chat);
      }
      await addNotification({
        type: "proactive", title: character.name,
        text: generated.text.slice(0, 90), chatId: chat.id, messageId: generated.id
      });
      state.lastMessages.set(chat.id, generated);
      const lastMomentAt = character.stats?.lastMomentAt || 0;
      if (character.proactive.style !== "low"
        && now() - lastMomentAt > 12 * 3_600_000
        && Math.random() < .12) {
        try {
          await generateCharacterMoment(character, chat, messages);
        } catch (error) {
          console.warn("角色朋友圈生成失败", error);
        }
      }
    }
    if (sentThisCycle >= maxPerCycle) break;
  }
  if (sentThisCycle && state.route !== "chat") renderScreen();
}

function getGeneralProactiveTrigger(character, lastMessage, chat) {
  const silenceHours = character.proactive.trigger?.silenceHours || 8;
  const lastActivity = lastMessage?.time || chat.lastActiveAt;
  if (now() - lastActivity < silenceHours * 3_600_000) return null;
  if (!insideTimeWindow(character.proactive.trigger?.timeWindow)) return null;
  if (now() - (character.proactive.lastSentAt || 0) < (character.proactive.cooldownHours || 6) * 3_600_000) return null;
  if (character.proactive.trigger?.sleepLessThan !== null
    && character.permissions?.sleep
    && state.settings.health.sleep !== null
    && state.settings.health.sleep >= character.proactive.trigger.sleepLessThan) return null;
  if (isInQuietHours() && character.proactive.style !== "high") return null;
  return { type: "proactive", instruction: "结合最近对话和未完成话题自然开口。" };
}

function getGreetingTrigger(character, messages, lastMessage) {
  const hour = new Date().getHours();
  const todayKey = new Date().toDateString();
  const lastActivity = lastMessage?.time || 0;
  const lastMorningKey = character.greetings?.lastMorningAt ? new Date(character.greetings.lastMorningAt).toDateString() : "";
  const lastNightKey = character.greetings?.lastNightAt ? new Date(character.greetings.lastNightAt).toDateString() : "";
  if (character.greetings?.morning && hour >= 6 && hour < 9
    && lastMorningKey !== todayKey
    && now() - lastActivity >= 8 * 3_600_000) {
    return "morning";
  }
  const hasNightMessageToday = messages.some((message) => {
    if (new Date(message.time).toDateString() !== todayKey) return false;
    return /晚安|睡了|去睡|休息了/.test(message.text || "");
  });
  if (character.greetings?.night && hour >= 22 && hour < 24
    && lastNightKey !== todayKey
    && !hasNightMessageToday
    && now() - (character.proactive.cooldownHours || 6) * 3_600_000 > lastActivity) {
    return "night";
  }
  return "";
}

async function generateCharacterMoment(character, chat, messages) {
  const config = getDefaultApi("text");
  if (!config || !character) return null;
  const recent = messages.slice(-12).map((message) => {
    const source = message.charId ? getById(state.characters, message.charId)?.name || "角色" : state.settings.userProfile?.name || "用户";
    return `${source}：${message.text || message.type}`;
  }).join("\n");
  const result = await sendTextCompletion(config, [
    {
      role: "system",
      content: `你是${character.name}。写一条第一人称朋友圈动态，内容来自最近聊天或此刻时间，符合角色性格和说话风格。不要提到模型、提示词或“朋友圈”。只返回动态正文，控制在 120 字以内。`
    },
    { role: "user", content: recent || `当前时间：${new Date().toLocaleString("zh-CN")}` }
  ], { sampling: { temperature: .85, max_tokens: 300 } });
  const text = result.text.trim();
  const moment = {
    id: uid(),
    characterId: character.id,
    author: character.name,
    text,
    createdAt: now(),
    likes: [],
    comments: [],
    respondedByChar: false
  };
  state.settings.moments.unshift(moment);
  character.stats = { ...character.stats, lastMomentAt: now() };
  await dbPut("characters", character);
  await saveSettings();
  await addNotification({ type: "moment", title: `${character.name} 发了动态`, text });
  return moment;
}

function isInQuietHours() {
  return insideTimeWindow(state.settings.quietHours || ["23:00", "07:00"]);
}

async function addNotification(notification) {
  state.settings.notifications.unshift({ id: uid(), read: false, createdAt: now(), ...notification });
  state.settings.notifications = state.settings.notifications.slice(0, 100);
  await saveSettings();
  if (state.route === "messages" || state.route === "groups") renderScreen();
}

/* ============================================================
 * 页面渲染
 * ============================================================ */

function renderDatesPage() {
  const dates = state.settings.dates || [];
  return `
    <div class="page">
      <header class="topbar">
        <div class="topbar-main"><div class="topbar-title">约会</div></div>
        <button class="icon-btn" data-action="open-schedules" title="日程">◷</button>
        <button class="icon-btn primary" data-action="create-date" title="新建约会">+</button>
      </header>
      <div class="page-scroll page-content">
        <div class="surface">
          <div class="surface-title"><strong>剧情关系</strong><span>数值只在本页出现</span></div>
          ${dates.length ? dates.map(renderDateCard).join("") : `
            <div class="empty-state" style="min-height:300px;padding:20px">
              <div class="empty-illustration">◇</div>
              <h2>还没有约会剧情</h2>
              <p>为角色建立 beat、分歧点与多结局。关系变化只会显示在这里，不会进入日常聊天。</p>
              <button class="btn primary" data-action="create-date">新建约会</button>
            </div>`}
        </div>
      </div>
    </div>`;
}

function renderDateCard(date) {
  const characters = (date.memberIds || []).map((id) => getById(state.characters, id)).filter(Boolean);
  const current = date.currentBeat || 0;
  const beats = date.beats || [];
  const beat = beats[current];
  return `
    <article class="date-card">
      <div class="card-head">
        <div style="display:flex">${characters.slice(0, 3).map((item) => renderAvatar(item)).join("")}</div>
        <div class="card-head-main">
          <strong>${escapeHtml(date.title || "未命名约会")}</strong>
          <small>${escapeHtml(date.status || "进行中")} · ${beats.length} 个 beat · ${(date.endings || []).length} 个结局</small>
        </div>
        <span class="tag acc">${characters.map((item) => `${item.name} ${date.affection?.[item.id] || 0}`).join(" / ")}</span>
      </div>
      ${beat ? `<div class="entry-preview" style="margin-top:9px">${escapeHtml(beat.text || beat.title || "当前 beat")}</div>` : ""}
      <div class="card-actions">
        <button class="btn small primary" data-action="advance-date" data-id="${escapeAttr(date.id)}">推进剧情</button>
        <button class="btn small" data-action="add-date-beat" data-id="${escapeAttr(date.id)}">添加 beat</button>
        <button class="btn small" data-action="add-date-ending" data-id="${escapeAttr(date.id)}">添加结局</button>
        <button class="btn small danger" data-action="delete-date" data-id="${escapeAttr(date.id)}">删除</button>
      </div>
    </article>`;
}

function renderHealthPage() {
  const health = state.settings.health || {};
  return `
    <div class="page">
      <header class="topbar">
        <div class="topbar-main">
          <div class="topbar-title">体征</div>
          <div class="topbar-subtitle">原始数字只在客户端转换，感知量才进入角色提示词</div>
        </div>
        <button class="icon-btn primary" data-action="edit-health" title="录入数据">+</button>
      </header>
      <div class="page-scroll page-content">
        ${health.updatedAt ? `
          <div class="surface">
            <div class="surface-title"><strong>当前感知</strong><span>${formatRelativeTime(health.updatedAt)}</span></div>
            <div class="grid">
              ${state.healthPerceptions.length
                ? state.healthPerceptions.map((item) => `<div class="metric"><strong>${escapeHtml(item.split("，")[0])}</strong><span>${escapeHtml(item)}</span></div>`).join("")
                : `<div class="entry-preview">本次数据没有形成新的感知状态。</div>`}
            </div>
          </div>
          <div class="surface">
            <div class="surface-title"><strong>原始读数</strong><span>不进入对话上下文</span></div>
            <div class="grid three">
              <div class="metric"><strong>${health.heartRate ?? "—"}</strong><span>心率 bpm</span></div>
              <div class="metric"><strong>${health.temperature ?? "—"}</strong><span>体温 °C</span></div>
              <div class="metric"><strong>${health.sleep ?? "—"}</strong><span>睡眠小时</span></div>
              <div class="metric"><strong>${health.steps ?? "—"}</strong><span>步数</span></div>
              <div class="metric"><strong>${escapeHtml(health.location || "—")}</strong><span>地点</span></div>
              <div class="metric"><strong>${escapeHtml(health.weather || "—")}</strong><span>天气</span></div>
            </div>
            <div class="card-actions">
              <button class="btn small" data-action="edit-health">更新数据</button>
              <button class="btn small" data-action="clear-health">清空</button>
            </div>
          </div>` : `
          <div class="empty-state" style="min-height:520px">
            <div class="empty-illustration">♡</div>
            <h2>还没有体征数据</h2>
            <p>这里可以手动录入、导入 JSON，或对接你已有的健康数据适配层。角色只会在获得授权且状态变化时感知到大致状态。</p>
            <div class="empty-actions">
              <button class="btn primary" data-action="edit-health">录入数据</button>
              <button class="btn" data-action="import-health">导入 JSON</button>
            </div>
          </div>`}
      </div>
    </div>`;
}

function renderProfilePage() {
  const tabs = [
    ["overview", "概览"],
    ["content", "内容"],
    ["models", "模型"],
    ["appearance", "外观"],
    ["data", "数据"]
  ];
  const unreadNotifications = state.settings.notifications.filter((item) => !item.read).length;
  let content = "";

  if (state.profileTab === "overview") {
    content = `
      <div class="dashboard-intro">
        <div>
          <span>POCKETLINK</span>
          <h2>角色陪伴终端</h2>
          <p>先配置模型，再创建角色。所有数据只保存在这台设备。</p>
        </div>
        <div class="dashboard-orbit">PL</div>
      </div>
      <div class="dashboard-grid">
        <button class="dashboard-card primary" data-action="profile-tab" data-tab="models">
          <span class="dashboard-icon">⇄</span>
          <strong>API 与模型</strong>
          <small>${state.apiConfigs.filter((item) => item.category === "text").length} 个文字模型 · 点击配置</small>
        </button>
        <button class="dashboard-card" data-action="profile-tab" data-tab="content">
          <span class="dashboard-icon">✦</span>
          <strong>创作资源</strong>
          <small>${state.characters.length} 角色 · ${state.worldbooks.length} 世界书 · ${state.presets.length} 预设</small>
        </button>
        <button class="dashboard-card" data-action="open-theme-manager">
          <span class="dashboard-icon">◐</span>
          <strong>主题外观</strong>
          <small>六套主题、日夜模式和字体</small>
        </button>
        <button class="dashboard-card" data-action="open-settings">
          <span class="dashboard-icon">⚙</span>
          <strong>应用设置</strong>
          <small>聊天、代理、锁屏和主动消息</small>
        </button>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>最近状态</strong><span>本机数据</span></div>
        <div class="grid three">
          <div class="metric"><strong>${state.chats.length}</strong><span>聊天窗口</span></div>
          <div class="metric"><strong>${state.settings.memoryCards?.length || 0}</strong><span>纪念卡</span></div>
          <div class="metric"><strong>${unreadNotifications}</strong><span>未读通知</span></div>
        </div>
      </div>`;
  } else if (state.profileTab === "content") {
    content = `
      <div class="section-heading"><div><strong>创作资源</strong><span>角色卡、世界书和提示词集中管理</span></div></div>
      <div class="content-resource-grid">
        ${renderContentResourceCard("characters", "☺", "角色库", state.characters.length, "角色人设、头像、开场白和主动消息")}
        ${renderContentResourceCard("worldbooks", "▤", "世界书", state.worldbooks.length, "关键词、常驻条目和私密可见性")}
        ${renderContentResourceCard("presets", "≡", "提示词预设", state.presets.length, "提示词顺序、注入位置和采样参数")}
        ${renderContentResourceCard("regex", "/.*/", "正则脚本", state.regexScripts.length, "状态栏、选择器和内容清洗")}
        ${renderContentResourceCard("quick", "⌘", "快捷回复", state.quickReplies.length, "聊天输入栏的一键按钮")}
        ${renderContentResourceCard("memories", "✦", "纪念卡", state.settings.memoryCards?.length || 0, "约会和关系里程碑")}
      </div>
      <div class="surface">
        <div class="surface-title"><strong>导入</strong><span>从现有素材快速开始</span></div>
        <div class="card-actions">
          <button class="btn primary" data-action="import-character-json">JSON 角色卡</button>
          <button class="btn" data-action="import-character-png">PNG 角色卡</button>
          <button class="btn" data-action="import-file" data-import-kind="worldbook">世界书</button>
          <button class="btn" data-action="import-file" data-import-kind="preset">预设</button>
        </div>
      </div>`;
  } else if (state.profileTab === "models") {
    const textConfigs = state.apiConfigs.filter((item) => item.category === "text");
    const imageConfigs = state.apiConfigs.filter((item) => item.category === "image");
    const videoConfigs = state.apiConfigs.filter((item) => item.category === "video");
    content = `
      <div class="section-heading"><div><strong>API 与模型</strong><span>让聊天、图片和通话真正连上网络</span></div><button class="btn primary small" data-action="open-api-manager">配置模型</button></div>
      <div class="surface">
        <div class="surface-title"><strong>默认接口</strong><span>聊天会优先使用</span></div>
        <div class="menu-list">
          ${renderDefaultApiRow("text", "文字模型", state.settings.defaultTextApiId, textConfigs)}
          ${renderDefaultApiRow("image", "图片模型", state.settings.defaultImageApiId, imageConfigs)}
          ${renderDefaultApiRow("video", "视频模型", state.settings.defaultVideoApiId, videoConfigs)}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>DeepSeek 提示</strong><span>已核实官方行为</span></div>
        <div class="field-hint">DeepSeek 默认开启思考模式。开启时 temperature、presence_penalty、frequency_penalty 会被忽略。需要采样参数时，在接口编辑里选择“关闭思考”。</div>
      </div>`;
  } else if (state.profileTab === "appearance") {
    content = `
      <div class="section-heading"><div><strong>主题外观</strong><span>选择主题并打开完整外观设置</span></div><button class="btn small" data-action="open-settings">详细设置</button></div>
      <div class="theme-card-grid">${state.themes.map(renderThemeCard).join("")}</div>`;
  } else {
    content = `
      <div class="section-heading"><div><strong>数据与工具</strong><span>备份、日程和本机功能</span></div></div>
      <div class="menu-list">
        <button class="menu-item" data-action="export-backup"><span class="menu-icon">↑</span><span><strong>导出存档</strong><small>备份全部本机数据</small></span><span>›</span></button>
        <button class="menu-item" data-action="import-file" data-import-kind="backup"><span class="menu-icon">↺</span><span><strong>恢复存档</strong><small>导入另一台设备的备份</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-notifications"><span class="menu-icon">◉</span><span><strong>通知中心</strong><small>${unreadNotifications} 条未读</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-moments"><span class="menu-icon">◎</span><span><strong>朋友圈</strong><small>${state.settings.moments?.length || 0} 条动态</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-schedules"><span class="menu-icon">◷</span><span><strong>纪念日与日程</strong><small>${state.settings.schedules?.length || 0} 个提醒</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-wallet"><span class="menu-icon">¥</span><span><strong>娱乐钱包</strong><small>${formatMoney(state.settings.walletBalanceFen || 0)}</small></span><span>›</span></button>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>隐私说明</strong><span>本机优先</span></div>
        <div class="field-hint">角色、聊天和 API Key 保存在浏览器 IndexedDB。公开仓库不会包含你的聊天或密钥。</div>
      </div>`;
  }

  return `
    <div class="page">
      <header class="topbar">
        <div class="topbar-main"><div class="topbar-title">设置</div><div class="topbar-subtitle">模型、内容与本机数据</div></div>
        <button class="icon-btn" data-action="open-notifications" title="通知">◉</button>
        <button class="icon-btn" data-action="open-settings" title="更多设置">⚙</button>
      </header>
      <div class="tabs">${tabs.map(([id, label]) => `<button class="tab ${state.profileTab === id ? "active" : ""}" data-action="profile-tab" data-tab="${id}">${label}</button>`).join("")}</div>
      <div class="page-scroll page-content">${content}</div>
    </div>`;
}

function renderContentResourceCard(tab, icon, title, count, description) {
  return `
    <button class="content-resource-card" data-action="open-content-manager" data-tab="${escapeAttr(tab)}">
      <span class="content-resource-icon">${icon}</span>
      <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></span>
      <b>${count}</b>
    </button>`;
}

function renderDefaultApiRow(category, label, defaultId, configs) {
  const config = getById(configs, defaultId) || configs.find((item) => item.enabled);
  const detail = config ? `${config.name || config.provider} · ${config.model}` : "尚未配置";
  return `<button class="menu-item" data-action="open-api-manager-category" data-category="${escapeAttr(category)}"><span class="menu-icon">${category === "text" ? "文" : category === "image" ? "图" : "影"}</span><span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(detail)}</small></span><span>›</span></button>`;
}

function openContentManager(tab = "characters") {
  state.contentTab = tab;
  openModal({
    title: "创作资源",
    size: "wide",
    body: renderContentManagerBody()
  });
}

function renderContentManagerBody() {
  const tabs = [
    ["characters", "角色"],
    ["worldbooks", "世界书"],
    ["presets", "预设"],
    ["regex", "正则"],
    ["quick", "快捷"],
    ["memories", "纪念卡"]
  ];
  return `
    <div class="tabs" style="padding:0 0 12px">${tabs.map(([id, label]) => `<button type="button" class="tab ${state.contentTab === id ? "active" : ""}" data-action="content-tab" data-tab="${id}">${label}</button>`).join("")}</div>
    <div id="contentManagerList">${renderContentManagerList()}</div>
  `;
}

function renderContentManagerList() {
  if (state.contentTab === "characters") {
    return state.characters.length
      ? state.characters.map(renderCharacterCard).join("")
      : `<div class="empty-state" style="min-height:300px"><div class="empty-illustration">☺</div><h2>角色库为空</h2><p>可以手动创建，也可以从相册导入 PNG 角色卡。</p><div class="empty-actions"><button class="btn primary" data-action="create-character">手动创建</button><button class="btn" data-action="import-character-png">导入 PNG</button></div></div>`;
  }
  if (state.contentTab === "worldbooks") {
    return state.worldbooks.length
      ? state.worldbooks.map((book) => `<article class="manager-card"><div class="card-head"><div class="card-head-main"><strong>${escapeHtml(book.name || "未命名世界书")}</strong><small>${book.entries.length} 条 · ${escapeHtml(book.description || "无描述")}</small></div><span class="tag">${escapeHtml(book.rawFormat || "manual")}</span></div><div class="card-actions"><button class="btn small primary" data-action="manage-worldbook" data-id="${escapeAttr(book.id)}">编辑</button><button class="btn small" data-action="test-worldbook" data-id="${escapeAttr(book.id)}">触发测试</button><button class="btn small" data-action="export-worldbook" data-id="${escapeAttr(book.id)}">导出</button><button class="btn small danger" data-action="delete-worldbook" data-id="${escapeAttr(book.id)}">删除</button></div></article>`).join("")
      : `<div class="empty-state" style="min-height:260px"><div class="empty-illustration">▤</div><h2>世界书为空</h2><p>支持 SillyTavern 对象索引和数组格式。</p><button class="btn primary" data-action="create-worldbook">新建世界书</button></div>`;
  }
  if (state.contentTab === "presets") {
    return state.presets.length
      ? state.presets.map((preset) => `<article class="manager-card"><div class="card-head"><div class="card-head-main"><strong>${escapeHtml(preset.name || "未命名预设")}</strong><small>${preset.prompts.length} 条提示词 · 上下文 ${preset.openai_max_context}</small></div></div><div class="card-actions"><button class="btn small primary" data-action="manage-preset" data-id="${escapeAttr(preset.id)}">编辑</button><button class="btn small" data-action="set-default-preset" data-id="${escapeAttr(preset.id)}">设为默认</button><button class="btn small danger" data-action="delete-preset" data-id="${escapeAttr(preset.id)}">删除</button></div></article>`).join("")
      : `<div class="empty-state" style="min-height:260px"><div class="empty-illustration">≡</div><h2>预设为空</h2><p>控制提示词顺序、注入位置和采样参数。</p><button class="btn primary" data-action="create-preset">新建预设</button></div>`;
  }
  if (state.contentTab === "regex") {
    return state.regexScripts.length
      ? state.regexScripts.map((script) => `<article class="manager-card"><div class="card-head"><div class="card-head-main"><strong>${escapeHtml(script.scriptName || "未命名脚本")}</strong><small>placement ${script.placement.join(",")} · ${script.disabled ? "停用" : "启用"}</small></div></div><div class="entry-preview" style="margin-top:8px">${escapeHtml(script.findRegex)}</div><div class="card-actions"><button class="btn small primary" data-action="edit-regex" data-id="${escapeAttr(script.id)}">编辑</button><button class="btn small" data-action="toggle-regex" data-id="${escapeAttr(script.id)}">${script.disabled ? "启用" : "停用"}</button><button class="btn small danger" data-action="delete-regex" data-id="${escapeAttr(script.id)}">删除</button></div></article>`).join("")
      : `<div class="empty-state" style="min-height:260px"><div class="empty-illustration">/.*/</div><h2>没有正则脚本</h2><p>用于状态栏、选择器和提示词处理。</p><button class="btn primary" data-action="create-regex">新建脚本</button></div>`;
  }
  if (state.contentTab === "quick") {
    return state.quickReplies.length
      ? state.quickReplies.map((group) => `<article class="manager-card"><div class="card-head"><div class="card-head-main"><strong>${escapeHtml(group.name || "未命名快捷组")}</strong><small>${group.qrList.length} 个按钮 · ${state.settings.activeQuickReplyIds.includes(group.id) ? "聊天中显示" : "未启用"}</small></div></div><div class="card-actions"><button class="btn small primary" data-action="edit-quick" data-id="${escapeAttr(group.id)}">编辑</button><button class="btn small" data-action="toggle-quick-group" data-id="${escapeAttr(group.id)}">${state.settings.activeQuickReplyIds.includes(group.id) ? "停用" : "启用"}</button><button class="btn small danger" data-action="delete-quick" data-id="${escapeAttr(group.id)}">删除</button></div></article>`).join("")
      : `<div class="empty-state" style="min-height:260px"><div class="empty-illustration">⌘</div><h2>没有快捷回复</h2><button class="btn primary" data-action="create-quick">新建快捷组</button></div>`;
  }
  return state.settings.memoryCards.length
    ? state.settings.memoryCards.map(renderMemoryCard).join("")
    : `<div class="empty-state" style="min-height:260px"><div class="empty-illustration">✦</div><h2>还没有纪念卡</h2><p>在聊天菜单里选择“这一刻值得记住”。</p></div>`;
}

function renderProfilePageLegacy() {
  const unreadNotifications = state.settings.notifications.filter((item) => !item.read).length;
  const tabs = [
    ["characters", "角色"], ["worldbooks", "世界书"], ["presets", "预设"],
    ["regex", "正则"], ["quick", "快捷"], ["memories", "纪念卡"], ["themes", "主题"], ["system", "系统"]
  ];
  let content = "";
  if (state.profileTab === "characters") {
    content = state.characters.length ? state.characters.map(renderCharacterCard).join("") : `
      <div class="empty-state" style="min-height:420px">
        <div class="empty-illustration">☺</div>
        <h2>角色库为空</h2>
        <p>手动创建、文字提炼，或导入 JSON / PNG 角色卡。角色卡中的 YAML、XML 富文本会原样保留。</p>
        <div class="empty-actions">
          <button class="btn primary" data-action="create-character">手动创建</button>
          <button class="btn" data-action="create-character-from-text">文字创建</button>
          <button class="btn" data-action="import-character-json">导入 JSON 角色卡</button>
          <button class="btn" data-action="import-character-png">从相册导入 PNG</button>
        </div>
      </div>`;
  } else if (state.profileTab === "worldbooks") {
    content = state.worldbooks.length ? state.worldbooks.map((book) => `
      <article class="manager-card">
        <div class="card-head"><div class="card-head-main"><strong>${escapeHtml(book.name || "未命名世界书")}</strong><small>${book.entries.length} 条 · ${escapeHtml(book.description || "无描述")}</small></div><span class="tag">${escapeHtml(book.rawFormat || "manual")}</span></div>
        <div class="card-actions"><button class="btn small primary" data-action="manage-worldbook" data-id="${escapeAttr(book.id)}">编辑</button><button class="btn small" data-action="test-worldbook" data-id="${escapeAttr(book.id)}">触发测试</button><button class="btn small" data-action="export-worldbook" data-id="${escapeAttr(book.id)}">导出</button><button class="btn small danger" data-action="delete-worldbook" data-id="${escapeAttr(book.id)}">删除</button></div>
      </article>`).join("") : `<div class="empty-state" style="min-height:420px"><div class="empty-illustration">▤</div><h2>世界书为空</h2><p>支持 SillyTavern 的对象索引与数组两种格式。</p><button class="btn primary" data-action="create-worldbook">新建世界书</button></div>`;
  } else if (state.profileTab === "presets") {
    content = state.presets.length ? state.presets.map((preset) => `
      <article class="manager-card">
        <div class="card-head"><div class="card-head-main"><strong>${escapeHtml(preset.name || "未命名预设")}</strong><small>${preset.prompts.length} 条提示词 · 上下文 ${preset.openai_max_context}</small></div></div>
        <div class="card-actions"><button class="btn small primary" data-action="manage-preset" data-id="${escapeAttr(preset.id)}">编辑</button><button class="btn small" data-action="set-default-preset" data-id="${escapeAttr(preset.id)}">设为默认</button><button class="btn small" data-action="export-preset" data-id="${escapeAttr(preset.id)}">导出</button><button class="btn small danger" data-action="delete-preset" data-id="${escapeAttr(preset.id)}">删除</button></div>
      </article>`).join("") : `<div class="empty-state" style="min-height:420px"><div class="empty-illustration">≡</div><h2>预设为空</h2><p>预设控制提示词排序、注入位置、深度和采样参数。</p><button class="btn primary" data-action="create-preset">新建预设</button></div>`;
  } else if (state.profileTab === "regex") {
    content = state.regexScripts.length ? state.regexScripts.map((script) => `
      <article class="manager-card">
        <div class="card-head"><div class="card-head-main"><strong>${escapeHtml(script.scriptName || "未命名脚本")}</strong><small>placement ${script.placement.join(",")} · ${script.disabled ? "停用" : "启用"}</small></div></div>
        <div class="entry-preview" style="margin-top:8px">${escapeHtml(script.findRegex)}</div>
        <div class="card-actions"><button class="btn small primary" data-action="edit-regex" data-id="${escapeAttr(script.id)}">编辑</button><button class="btn small" data-action="toggle-regex" data-id="${escapeAttr(script.id)}">${script.disabled ? "启用" : "停用"}</button><button class="btn small" data-action="export-regex" data-id="${escapeAttr(script.id)}">导出</button><button class="btn small danger" data-action="delete-regex" data-id="${escapeAttr(script.id)}">删除</button></div>
      </article>`).join("") : `<div class="empty-state" style="min-height:420px"><div class="empty-illustration">/.*/</div><h2>没有正则脚本</h2><p>用于状态栏、选择器、内容清洗与提示词注入。</p><button class="btn primary" data-action="create-regex">新建脚本</button></div>`;
  } else if (state.profileTab === "quick") {
    content = state.quickReplies.length ? state.quickReplies.map((group) => `
      <article class="manager-card">
        <div class="card-head"><div class="card-head-main"><strong>${escapeHtml(group.name || "未命名快捷组")}</strong><small>${group.qrList.length} 个按钮 · ${state.settings.activeQuickReplyIds.includes(group.id) ? "聊天中显示" : "未启用"}</small></div></div>
        <div class="card-actions"><button class="btn small primary" data-action="edit-quick" data-id="${escapeAttr(group.id)}">编辑</button><button class="btn small" data-action="toggle-quick-group" data-id="${escapeAttr(group.id)}">${state.settings.activeQuickReplyIds.includes(group.id) ? "停用" : "启用"}</button><button class="btn small danger" data-action="delete-quick" data-id="${escapeAttr(group.id)}">删除</button></div>
      </article>`).join("") : `<div class="empty-state" style="min-height:420px"><div class="empty-illustration">⌘</div><h2>没有快捷回复</h2><p>导入 SillyTavern QuickReply JSON，或手动建立按钮组。</p><button class="btn primary" data-action="create-quick">新建快捷组</button></div>`;
  } else if (state.profileTab === "memories") {
    const memories = state.settings.memoryCards || [];
    content = memories.length ? memories.map(renderMemoryCard).join("") : `
      <div class="empty-state" style="min-height:420px">
        <div class="empty-illustration">✦</div>
        <h2>还没有纪念卡</h2>
        <p>约会完成、群聊里程碑，或聊天菜单里的“这一刻值得记住”都会保留一份关系片段。</p>
      </div>`;
  } else if (state.profileTab === "themes") {
    content = `<div class="theme-card-grid">${state.themes.map(renderThemeCard).join("")}</div><div class="card-actions" style="margin-top:12px"><button class="btn primary" data-action="create-theme">自定义主题</button><button class="btn" data-action="import-file" data-import-kind="theme">导入主题</button></div>`;
  } else {
    content = `
      <div class="menu-list">
        <button class="menu-item" data-action="open-api-manager"><span class="menu-icon">⇄</span><span><strong>API 配置</strong><small>文字、图片、视频、代理与连接测试</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-settings"><span class="menu-icon">⚙</span><span><strong>设置</strong><small>外观、字体、发送、锁屏与用户资料</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-notifications"><span class="menu-icon">◉</span><span><strong>通知中心</strong><small>${unreadNotifications} 条未读</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-moments"><span class="menu-icon">◎</span><span><strong>朋友圈</strong><small>${state.settings.moments?.length || 0} 条动态</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-wallet"><span class="menu-icon">¥</span><span><strong>娱乐钱包</strong><small>${formatMoney(state.settings.walletBalanceFen || 0)} · 本地互动数值</small></span><span>›</span></button>
        <button class="menu-item" data-action="open-schedules"><span class="menu-icon">◷</span><span><strong>纪念日与日程</strong><small>${state.settings.schedules?.length || 0} 个提醒</small></span><span>›</span></button>
        <button class="menu-item" data-action="import-file" data-import-kind="auto"><span class="menu-icon">↓</span><span><strong>导入文件</strong><small>自动识别角色卡、世界书、预设、主题、正则、快捷回复与存档</small></span><span>›</span></button>
        <button class="menu-item" data-action="export-backup"><span class="menu-icon">↑</span><span><strong>导出存档</strong><small>包含 IndexedDB 中的全部业务数据</small></span><span>›</span></button>
        <button class="menu-item" data-action="import-file" data-import-kind="backup"><span class="menu-icon">↺</span><span><strong>恢复存档</strong><small>恢复会替换当前本地数据</small></span><span>›</span></button>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>存储状态</strong><span>IndexedDB · pocketlink</span></div>
        <div class="grid three">
          <div class="metric"><strong>${state.characters.length}</strong><span>角色</span></div>
          <div class="metric"><strong>${state.chats.length}</strong><span>聊天</span></div>
          <div class="metric"><strong>${state.regexScripts.length}</strong><span>正则</span></div>
        </div>
        <p class="field-hint" style="margin-top:10px">最后备份：${state.settings.lastBackupAt ? formatTime(state.settings.lastBackupAt, true) : "尚未备份"}</p>
      </div>`;
  }
  return `
    <div class="page">
      <header class="topbar">
        <div class="topbar-main"><div class="topbar-title">设置</div><div class="topbar-subtitle">本机数据与创作资源</div></div>
        <button class="icon-btn" data-action="open-notifications" title="通知">◉</button>
        <button class="icon-btn" data-action="open-settings" title="设置">⚙</button>
      </header>
      <div class="tabs">${tabs.map(([id, label]) => `<button class="tab ${state.profileTab === id ? "active" : ""}" data-action="profile-tab" data-tab="${id}">${label}</button>`).join("")}</div>
      <div class="page-scroll page-content">${content}</div>
    </div>`;
}

function renderCharacterCard(character) {
  return `
    <article class="manager-card">
      <div class="card-head">
        ${renderAvatar(character, "large")}
        <div class="card-head-main">
          <strong>${escapeHtml(character.name || "未命名角色")}</strong>
          <small>${escapeHtml(character.tag || character.personality || character.scenario || "未填写角色标签")} · ${character.stats?.totalMessages || 0} 条消息</small>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn small primary" data-action="start-chat-with" data-id="${escapeAttr(character.id)}">新对话</button>
        <button class="btn small" data-action="edit-character" data-id="${escapeAttr(character.id)}">编辑</button>
        <button class="btn small" data-action="export-character" data-id="${escapeAttr(character.id)}">导出</button>
        <button class="btn small danger" data-action="delete-character" data-id="${escapeAttr(character.id)}">删除</button>
      </div>
    </article>`;
}

function renderThemeCard(theme) {
  const active = theme.id === state.settings.theme ? "active" : "";
  const vars = theme.vars || {};
  return `
    <article class="theme-card ${active}" data-action="select-theme" data-theme-id="${escapeAttr(theme.id)}">
      <div class="theme-preview">
        <i style="background:${escapeAttr(vars.bg || "#fff")}"></i>
        <i style="background:${escapeAttr(vars.acc || "#888")}"></i>
        <i style="background:${escapeAttr(vars.bubble || "#eee")}"></i>
      </div>
      <strong>${escapeHtml(theme.name)}</strong>
      <small>${escapeHtml(theme.desc || (theme.builtIn ? "内置主题" : "自定义主题"))}</small>
    </article>`;
}

function renderMemoryCard(memory) {
  const characters = (memory.characterIds || []).map((id) => getById(state.characters, id)).filter(Boolean);
  return `
    <article class="memory-card">
      ${memory.imageUrl ? `<img class="memory-card-image" src="${escapeAttr(memory.imageUrl)}" alt="">` : `<div class="memory-card-pattern">✦</div>`}
      <div class="memory-card-body">
        <div class="card-head">
          <div class="card-head-main"><strong>${escapeHtml(memory.title || "纪念卡")}</strong><small>${formatTime(memory.createdAt, true)}</small></div>
          <span class="tag acc">${escapeHtml(memory.affinityAtTime ? `关系 ${memory.affinityAtTime}` : "值得记住")}</span>
        </div>
        <div style="display:flex;margin:9px 0">${characters.map((item) => renderAvatar(item)).join("")}</div>
        <p class="memory-scene">${escapeHtml(memory.scene || "")}</p>
        ${(memory.keyDialogue || []).slice(0, 4).map((item) => `<div class="memory-line"><strong>${escapeHtml(item.speaker || "")}</strong><span>${escapeHtml(item.text || "")}</span></div>`).join("")}
        <div class="card-actions"><button class="btn small danger" data-action="delete-memory-card" data-id="${escapeAttr(memory.id)}">删除</button></div>
      </div>
    </article>`;
}

/* ---------- 面板与表单基础 ---------- */

function openSheet(title, items) {
  const sheet = $("#sheet");
  sheet.innerHTML = `
    <div class="sheet-panel">
      <div class="sheet-handle"></div>
      <h2 class="sheet-title">${escapeHtml(title)}</h2>
      <div class="sheet-list">
        ${items.map((item) => `
          <button class="menu-item" data-action="${escapeAttr(item.action)}" ${item.id ? `data-id="${escapeAttr(item.id)}"` : ""} ${item.messageId ? `data-message-id="${escapeAttr(item.messageId)}"` : ""}>
            <span class="menu-icon">${item.icon}</span>
            <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.subtitle || "")}</small></span>
            <span class="menu-chevron">›</span>
          </button>`).join("")}
      </div>
    </div>`;
  sheet.classList.remove("hidden");
}

function closeSheet() {
  $("#sheet").classList.add("hidden");
  $("#sheet").innerHTML = "";
}

function openModal({ title, body, actions = [], size = "normal" }) {
  state.modalHandlers = {};
  const modal = $("#modal");
  modal.innerHTML = `
    <div class="modal-panel" style="${size === "wide" ? "width:min(920px,100%)" : ""}">
      <header class="modal-head">
        <h2>${escapeHtml(title)}</h2>
        <button class="icon-btn" data-action="close-modal" title="关闭">×</button>
      </header>
      <div class="modal-body"><form id="modalForm">${body}</form></div>
      ${actions.length ? `<footer class="modal-actions">${actions.map((action) => `<button type="button" class="btn ${action.primary ? "primary" : ""} ${action.danger ? "danger" : ""}" data-action="modal-action" data-modal-action="${escapeAttr(action.id)}">${escapeHtml(action.label)}</button>`).join("")}</footer>` : ""}
    </div>`;
  for (const action of actions) state.modalHandlers[action.id] = action.handler;
  modal.classList.remove("hidden");
  setTimeout(() => $("input,textarea,select", modal)?.focus(), 50);
}

function closeModal() {
  $("#modal").classList.add("hidden");
  $("#modal").innerHTML = "";
  state.modalHandlers = {};
}

function confirmDialog(title, text, confirmLabel = "确认") {
  return new Promise((resolve) => {
    openModal({
      title,
      body: `<p style="margin:0;color:var(--dim);line-height:1.7;font-size:12px">${escapeHtml(text)}</p>`,
      actions: [
        { id: "cancel", label: "取消", handler: () => resolve(false) },
        { id: "confirm", label: confirmLabel, primary: true, danger: true, handler: () => resolve(true) }
      ]
    });
  });
}

function renderFormField(label, name, value = "", options = {}) {
  const full = options.full ? "full" : "";
  if (options.type === "textarea") {
    return `<div class="field ${full}"><label>${escapeHtml(label)}</label><textarea class="${options.tall ? "tall" : ""}" name="${escapeAttr(name)}" ${options.required ? "required" : ""} placeholder="${escapeAttr(options.placeholder || "")}">${escapeHtml(value)}</textarea>${options.hint ? `<div class="field-hint">${escapeHtml(options.hint)}</div>` : ""}</div>`;
  }
  if (options.type === "select") {
    return `<div class="field ${full}"><label>${escapeHtml(label)}</label><select name="${escapeAttr(name)}">${options.options.map(([id, text]) => `<option value="${escapeAttr(id)}" ${String(value) === String(id) ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select></div>`;
  }
  return `<div class="field ${full}"><label>${escapeHtml(label)}</label><input type="${escapeAttr(options.type || "text")}" name="${escapeAttr(name)}" value="${escapeAttr(value)}" ${options.required ? "required" : ""} ${options.min !== undefined ? `min="${escapeAttr(options.min)}"` : ""} ${options.max !== undefined ? `max="${escapeAttr(options.max)}"` : ""} ${options.step !== undefined ? `step="${escapeAttr(options.step)}"` : ""} placeholder="${escapeAttr(options.placeholder || "")}">${options.hint ? `<div class="field-hint">${escapeHtml(options.hint)}</div>` : ""}</div>`;
}

function readForm(form) {
  const data = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (data[key] !== undefined) data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    else data[key] = value;
  }
  for (const input of $$('input[type="checkbox"]', form)) data[input.name] = input.checked;
  return data;
}

/* ---------- 创建面板 ---------- */

function openCreateSheet() {
  openSheet("新建", [
    { icon: "☺", title: "创建角色", subtitle: "手动填写人设与开场白", action: "create-character" },
    { icon: "⌁", title: "创建群聊", subtitle: "选择多个角色建立群聊", action: "create-group" },
    { icon: "✉", title: "与现有角色开新对话", subtitle: "同一角色可以拥有多个独立聊天", action: "new-chat-existing" },
    { icon: "↓", title: "导入 JSON 角色卡", subtitle: "SillyTavern V2 / V3 JSON", action: "import-character-json" },
    { icon: "▧", title: "从相册导入 PNG 角色卡", subtitle: "选择相册或文件中的 PNG", action: "import-character-png" },
    { icon: "✦", title: "粘贴文字创建角色", subtitle: "由已配置模型提炼人设字段", action: "create-character-from-text" },
    { icon: "◉", title: "发布朋友圈", subtitle: "记录一条只在本地保存的动态", action: "create-moment" }
  ]);
}

function openNewChatPicker() {
  if (!state.characters.length) {
    openCharacterForm();
    return;
  }
  openModal({
    title: "选择角色",
    body: `<div class="menu-list">${state.characters.map((character) => `<button type="button" class="menu-item" data-action="start-chat-with" data-id="${escapeAttr(character.id)}">${renderAvatar(character)}<span><strong>${escapeHtml(character.name)}</strong><small>${escapeHtml(character.tag || "新对话")}</small></span><span>›</span></button>`).join("")}</div>`
  });
}

function openGroupPicker() {
  if (state.characters.length < 2) {
    toast("至少需要两个角色才能创建群聊", "error");
    return;
  }
  openModal({
    title: "创建群聊",
    body: `
      <div class="field full"><label>群聊名称</label><input name="title" placeholder="留空则使用角色名组合"></div>
      <div class="field full"><label>选择角色</label><div>${state.characters.map((character) => `<label class="check-row"><span>${escapeHtml(character.name)}<small>${escapeHtml(character.tag || "")}</small></span><span class="switch"><input type="checkbox" data-group-member value="${escapeAttr(character.id)}"><i></i></span></label>`).join("")}</div></div>
      <div class="field full"><label>导演备注</label><textarea name="directorNote" placeholder="例如：当前场景、角色关系或本轮目标"></textarea></div>
      <div class="field full check-row"><span>启用互不知情校验<small>发现疑似包含其他角色私密内容时重生成一次</small></span><span class="switch"><input type="checkbox" name="isolationEnabled" checked><i></i></span></div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "创建", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          const title = $('[name="title"]', form).value.trim();
          const members = $$("[data-group-member]:checked", form).map((input) => input.value);
          if (members.length < 2 || members.length > 8) {
            toast("请选择 2 至 8 个角色", "error");
            return false;
          }
          await createGroupChat(members, title);
          const chat = state.currentChat;
          chat.groupState.directorNote = $('[name="directorNote"]', form).value.trim();
          chat.groupState.directorEnabled = Boolean(chat.groupState.directorNote);
          chat.groupState.isolationCheck.enabled = $('[name="isolationEnabled"]', form).checked;
          await dbPut("chats", chat);
        }
      }
    ]
  });
}

/* ---------- 角色表单 ---------- */

function openCharacterForm(characterId = null) {
  const character = characterId ? getById(state.characters, characterId) : defaultCharacter();
  if (!character) return;
  const worldbookOptions = state.worldbooks.map((item) => `
    <label class="check-row"><span>${escapeHtml(item.name)}<small>${item.entries.length} 条</small></span><span class="switch"><input type="checkbox" name="boundWorldbook" value="${escapeAttr(item.id)}" ${character.boundWorldbooks.includes(item.id) ? "checked" : ""}><i></i></span></label>
  `).join("");
  openModal({
    title: characterId ? `编辑 ${character.name || "角色"}` : "创建角色",
    size: "wide",
    body: `
      <div class="form-grid">
        ${renderFormField("姓名", "name", character.name, { required: true })}
        ${renderFormField("角色标签", "tag", character.tag, { placeholder: "例如：家人 / 搭档 / 向导" })}
        ${renderFormField("头像符号", "avatar", character.avatar, { hint: "可填写 emoji 或单个汉字。" })}
        ${renderFormField("头像底色", "color", character.color, { type: "color" })}
        ${renderFormField("头像类型", "avatarType", character.avatarType, { type: "select", options: [["emoji", "符号"], ["image", "静态图片"], ["video", "动态视频"]] })}
        ${renderFormField("主题标签", "personalityShort", character.personality)}
        <div class="field full">
          <label>人格维度微调</label>
          <div class="personality-grid">
            ${[
              ["rationality", "理性", "感性", character.personalityDimensions.rationality],
              ["humor", "幽默", "严肃", character.personalityDimensions.humor],
              ["empathy", "共情", "冷静", character.personalityDimensions.empathy],
              ["initiative", "主动", "被动", character.personalityDimensions.initiative],
              ["directness", "直接", "含蓄", character.personalityDimensions.directness]
            ].map(([key, left, right, value]) => `<div class="personality-row"><span>${left}</span><input type="range" min="0" max="100" name="dim_${key}" value="${value}"><span>${right}</span><output>${value}</output></div>`).join("")}
          </div>
          <div class="field-hint">只微调 persona 和性格表现，不替代角色卡原始设定。</div>
        </div>
        ${renderFormField("人设（原样保留 YAML / XML）", "persona", character.persona, { type: "textarea", tall: true, full: true })}
        ${renderFormField("场景", "scenario", character.scenario, { type: "textarea", full: true })}
        ${renderFormField("说话风格", "speechStyle", character.speechStyle, { type: "textarea", full: true })}
        ${renderFormField("背景故事", "background", character.background, { type: "textarea", full: true })}
        ${renderFormField("口癖（每行一个）", "catchphrases", character.catchphrases.join("\n"), { type: "textarea" })}
        ${renderFormField("示例对话", "examples", character.examples.map((item) => `${item.user}||${item.char}`).join("\n"), { type: "textarea", hint: "格式：用户内容||角色内容" })}
        ${renderFormField("开场白", "firstMessage", character.firstMessage, { type: "textarea", tall: true, full: true })}
        ${renderFormField("备用开场白（每行一个）", "alternateGreetings", character.alternateGreetings.join("\n"), { type: "textarea", full: true })}
        ${renderFormField("角色专属系统提示词", "systemPrompt", character.systemPrompt, { type: "textarea", full: true })}
        ${renderFormField("历史后指令", "postHistoryInstructions", character.postHistoryInstructions, { type: "textarea", full: true })}
        ${renderFormField("绑定预设", "boundPresetId", character.boundPresetId || "", { type: "select", options: [["", "使用全局默认"], ...state.presets.map((item) => [item.id, item.name])] })}
      </div>
      <div class="surface" style="margin-top:14px">
        <div class="surface-title"><strong>头像工作室</strong><span>相册导入或参考图生成</span></div>
        <div class="avatar-studio">
          <div id="avatarPreview" class="avatar-preview-large">
            ${character.avatarType === "video" && character.avatar
              ? `<video src="${escapeAttr(character.avatar)}" ${character.avatarPoster ? `poster="${escapeAttr(character.avatarPoster)}"` : ""} autoplay muted loop playsinline></video>`
              : character.avatarType === "image" && character.avatar
                ? `<img src="${escapeAttr(character.avatar)}" alt="头像预览">`
                : escapeHtml(character.avatar || initials(character.name))}
          </div>
          <div>
            <div class="field">
              <label>从相册导入头像</label>
              <input type="file" name="avatarFile" accept="image/*,video/*">
              <div class="field-hint">支持静态图片和短视频。图片会自动压缩，视频建议不超过 20 MB。</div>
            </div>
            <div class="field" style="margin-top:9px">
              <label>参考图（用于 AI 生成头像）</label>
              <input type="file" name="avatarReferenceFile" accept="image/*">
            </div>
            <div id="avatarReferencePreview" class="field-hint">未选择参考图。</div>
            <div class="field" style="margin-top:9px">
              <label>头像描述</label>
              <textarea name="avatarPrompt" placeholder="例如：保持人物五官，改成电影感半身肖像，柔和逆光">${escapeHtml(character.avatarPrompt || "")}</textarea>
            </div>
            <div class="workspace-tools">
              <button type="button" class="btn small primary" data-action="generate-avatar-image">生成静态头像</button>
              <button type="button" class="btn small" data-action="generate-avatar-video">生成动态头像</button>
              <button type="button" class="btn small" data-action="clear-avatar-media">清除媒体头像</button>
            </div>
            <input type="hidden" name="avatarGenerated" value="">
            <input type="hidden" name="avatarGeneratedType" value="">
            <input type="hidden" name="avatarGeneratedPoster" value="">
          </div>
        </div>
      </div>
      <div class="surface" style="margin-top:14px">
        <div class="surface-title"><strong>感知权限</strong><span>只给角色授权它应知道的程度</span></div>
        <div class="check-row"><span>心率</span><span class="switch"><input type="checkbox" name="permHeart" ${character.permissions.heartRate ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>体温</span><span class="switch"><input type="checkbox" name="permTemperature" ${character.permissions.temperature ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>睡眠</span><span class="switch"><input type="checkbox" name="permSleep" ${character.permissions.sleep ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>步数</span><span class="switch"><input type="checkbox" name="permSteps" ${character.permissions.steps ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>天气</span><span class="switch"><input type="checkbox" name="permWeather" ${character.permissions.weather ? "checked" : ""}><i></i></span></div>
        ${renderFormField("位置权限", "permLocation", character.permissions.location, { type: "select", options: [["off", "不授权"], ["city", "仅城市"], ["exact", "精确地点"]] })}
      </div>
      <div class="surface">
        <div class="surface-title"><strong>主动消息</strong><span>规则决定是否开口，性格决定如何开口</span></div>
        <div class="check-row"><span>启用主动消息</span><span class="switch"><input type="checkbox" name="proactiveEnabled" ${character.proactive.enabled ? "checked" : ""}><i></i></span></div>
        <div class="form-grid">
          ${renderFormField("静默小时", "silenceHours", character.proactive.trigger.silenceHours, { type: "number", min: 1, max: 168 })}
          ${renderFormField("频率", "proactiveStyle", character.proactive.style, { type: "select", options: [["low", "低频 / 克制"], ["mid", "中频 / 平衡"], ["high", "高频 / 主动"]] })}
          ${renderFormField("冷却小时", "cooldownHours", character.proactive.cooldownHours, { type: "number", min: 1, max: 72 })}
          ${renderFormField("时间段开始", "windowStart", character.proactive.trigger.timeWindow[0], { type: "time" })}
          ${renderFormField("时间段结束", "windowEnd", character.proactive.trigger.timeWindow[1], { type: "time" })}
          ${renderFormField("睡眠少于该小时数时慎发", "sleepLessThan", character.proactive.trigger.sleepLessThan ?? "", { type: "number", step: "0.5" })}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>早晚安</strong><span>低频克制型角色建议保持关闭</span></div>
        <div class="check-row"><span>早安问候<small>6:00-9:00，静默超过 8 小时</small></span><span class="switch"><input type="checkbox" name="morningGreeting" ${character.greetings.morning ? "checked" : ""}><i></i></span></div>
        ${renderFormField("早安自定义要求", "customMorning", character.greetings.customMorning || "", { type: "textarea", full: true })}
        <div class="check-row"><span>晚安问候<small>22:00-24:00，当天尚无晚安</small></span><span class="switch"><input type="checkbox" name="nightGreeting" ${character.greetings.night ? "checked" : ""}><i></i></span></div>
        ${renderFormField("晚安自定义要求", "customNight", character.greetings.customNight || "", { type: "textarea", full: true })}
      </div>
      <div class="surface">
        <div class="surface-title"><strong>语音</strong><span>系统 TTS 可离线朗读</span></div>
        <div class="form-grid">
          ${renderFormField("TTS 来源", "ttsProvider", character.voice.ttsProvider, { type: "select", options: [["system", "系统 TTS"], ["custom", "自定义 TTS"]] })}
          ${renderFormField("音色 ID", "ttsVoiceId", character.voice.ttsVoiceId || "")}
          ${renderFormField("语速", "ttsSpeed", character.voice.ttsSpeed, { type: "number", step: "0.05", min: "0.5", max: "2" })}
          ${renderFormField("音高", "ttsPitch", character.voice.ttsPitch, { type: "number", step: "0.05", min: "0.5", max: "2" })}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>绑定世界书</strong><span>私密条目仅在该角色视角中注入</span></div>
        ${worldbookOptions || `<div class="entry-preview">暂无世界书。</div>`}
      </div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: characterId ? "保存" : "创建", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          if (!form.reportValidity()) return false;
          const data = readForm(form);
          const target = characterId ? clone(character) : defaultCharacter();
          target.name = data.name.trim();
          target.tag = data.tag.trim();
          target.avatar = data.avatar.trim() || initials(target.name);
          target.color = data.color || "";
          target.avatarType = data.avatarType;
          target.personality = data.personalityShort.trim();
          target.personalityDimensions = {
            rationality: clamp(toNumber(data.dim_rationality, 50), 0, 100),
            humor: clamp(toNumber(data.dim_humor, 50), 0, 100),
            empathy: clamp(toNumber(data.dim_empathy, 50), 0, 100),
            initiative: clamp(toNumber(data.dim_initiative, 50), 0, 100),
            directness: clamp(toNumber(data.dim_directness, 50), 0, 100)
          };
          target.persona = data.persona;
          target.scenario = data.scenario;
          target.speechStyle = data.speechStyle;
          target.background = data.background;
          target.catchphrases = toLines(data.catchphrases);
          target.examples = toLines(data.examples).map((line) => {
            const [user, char] = line.split("||");
            return { user: (user || "").trim(), char: (char || "").trim() };
          });
          target.firstMessage = data.firstMessage;
          target.alternateGreetings = toLines(data.alternateGreetings);
          target.systemPrompt = data.systemPrompt;
          target.postHistoryInstructions = data.postHistoryInstructions;
          target.boundPresetId = data.boundPresetId || null;
          target.permissions = {
            heartRate: Boolean(data.permHeart),
            temperature: Boolean(data.permTemperature),
            sleep: Boolean(data.permSleep),
            steps: Boolean(data.permSteps),
            weather: Boolean(data.permWeather),
            location: data.permLocation || "off"
          };
          target.proactive = {
            enabled: Boolean(data.proactiveEnabled),
            trigger: {
              silenceHours: clamp(toNumber(data.silenceHours, 8), 1, 168),
              sleepLessThan: data.sleepLessThan === "" ? null : toNumber(data.sleepLessThan, 0),
              timeWindow: [data.windowStart || "08:00", data.windowEnd || "23:00"]
            },
            style: data.proactiveStyle || "mid",
            cooldownHours: clamp(toNumber(data.cooldownHours, 6), 1, 72),
            lastSentAt: character.proactive?.lastSentAt || 0
          };
          target.greetings = {
            ...target.greetings,
            morning: Boolean(data.morningGreeting),
            night: Boolean(data.nightGreeting),
            customMorning: data.customMorning || "",
            customNight: data.customNight || ""
          };
          target.voice = {
            ...target.voice,
            ttsProvider: data.ttsProvider || "system",
            ttsVoiceId: data.ttsVoiceId || null,
            ttsSpeed: clamp(toNumber(data.ttsSpeed, 1), .5, 2),
            ttsPitch: clamp(toNumber(data.ttsPitch, 1), .5, 2)
          };
          target.boundWorldbooks = $$("[name=boundWorldbook]:checked", form).map((input) => input.value);
          const avatarFile = $('[name="avatarFile"]', form).files?.[0];
          if (avatarFile) {
            if (avatarFile.type.startsWith("video/")) {
              if (avatarFile.size > 20 * 1024 * 1024) throw new Error("动态头像视频超过 20 MB 限制");
              target.avatar = await fileToDataUrl(avatarFile);
              target.avatarType = "video";
              target.avatarPoster = "";
            } else {
              target.avatar = await imageFileToDataUrl(avatarFile, 1024, .88);
              target.avatarType = "image";
              target.avatarPoster = "";
            }
          }
          const referenceFile = $('[name="avatarReferenceFile"]', form).files?.[0];
          if (referenceFile) target.avatarReference = await imageFileToDataUrl(referenceFile, 1280, .86);
          target.avatarPrompt = data.avatarPrompt || "";
          if (data.avatarGenerated) {
            target.avatar = data.avatarGenerated;
            target.avatarType = data.avatarGeneratedType || "image";
            target.avatarPoster = data.avatarGeneratedPoster || "";
          }
          if (!characterId) {
            target.raw = null;
            target.rawFormat = "manual";
          }
          await saveCharacter(target);
          if (!characterId) {
            const makeChat = await confirmDialog("角色已创建", "现在与这个角色开一个新对话？", "开始聊天");
            if (makeChat) {
              await createSingleChat(target.id, target.firstMessage);
              return;
            }
            state.contentTab = "characters";
            state.profileTab = "content";
            navigate("profile");
          } else {
            toast("角色已保存");
          }
        }
      }
    ]
  });
}

async function imageFileToDataUrl(file, maxSize = 1024, quality = .86) {
  if (!file) throw new Error("没有选择图片");
  if (file.type === "image/gif") return fileToDataUrl(file);
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const node = new Image();
      node.onload = () => resolve(node);
      node.onerror = () => reject(new Error("图片读取失败"));
      node.src = sourceUrl;
    });
    const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: true });
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

async function generateAvatarFromForm(mode, button) {
  const form = $(".modal-body form");
  if (!form) return;
  const config = getDefaultApi(mode === "video" ? "video" : "image");
  if (!config) {
    toast(`请先配置默认${mode === "video" ? "视频" : "图片"}模型`, "error");
    return;
  }
  const name = $('[name="name"]', form)?.value.trim() || "角色";
  const persona = $('[name="persona"]', form)?.value.trim() || "";
  const instructions = $('[name="avatarPrompt"]', form)?.value.trim() || "";
  const referenceFile = $('[name="avatarReferenceFile"]', form)?.files?.[0];
  const referenceImage = referenceFile
    ? await imageFileToDataUrl(referenceFile, 1280, .86)
    : "";
  const prompt = [
    `为角色“${name}”制作${mode === "video" ? "动态" : "静态"}头像。`,
    persona ? `角色设定：${persona.slice(0, 1200)}` : "",
    instructions || (mode === "video" ? "轻微呼吸、眨眼或转头，镜头稳定，循环感自然。" : "构图干净，清晰半身肖像，适合作为手机聊天头像。"),
    referenceImage ? "尽量保持参考图中人物身份、五官和整体气质。" : ""
  ].filter(Boolean).join("\n");
  setBusy(button, true, mode === "video" ? "生成动态头像…" : "生成静态头像…");
  try {
    const mediaUrl = await sendMediaRequest(config, prompt, { referenceImage });
    const hidden = $('[name="avatarGenerated"]', form);
    const hiddenType = $('[name="avatarGeneratedType"]', form);
    const hiddenPoster = $('[name="avatarGeneratedPoster"]', form);
    hidden.value = mediaUrl;
    hiddenType.value = mode;
    hiddenPoster.value = mode === "video" && referenceImage ? referenceImage : "";
    const preview = $("#avatarPreview");
    if (preview) {
      preview.innerHTML = mode === "video"
        ? `<video src="${escapeAttr(mediaUrl)}" ${referenceImage ? `poster="${escapeAttr(referenceImage)}"` : ""} autoplay muted loop playsinline></video>`
        : `<img src="${escapeAttr(mediaUrl)}" alt="生成头像预览">`;
    }
    toast(mode === "video" ? "动态头像已生成，保存角色后生效" : "静态头像已生成，保存角色后生效");
  } catch (error) {
    toast(error.message, "error", 5200);
  } finally {
    setBusy(button, false);
  }
}

function captureVideoFrame(video, maxSize = 1280, quality = .82) {
  if (!video || !video.videoWidth || !video.videoHeight) return "";
  const scale = Math.min(1, maxSize / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
  canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

function dataUrlMime(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;,]+)/);
  return match?.[1] || "";
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function openCharacterFromText() {
  const config = getDefaultApi("text");
  if (!config) {
    toast("请先在设置中配置文字模型", "error");
    return;
  }
  openModal({
    title: "文字创建角色",
    body: `
      ${renderFormField("人物描述", "text", "", { type: "textarea", tall: true, required: true, full: true, hint: "可以粘贴小说片段、人物小传或零散设定。" })}
      ${renderFormField("附加要求", "instructions", "", { type: "textarea", full: true, placeholder: "例如：优化说话风格，补全开场白。" })}
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "extract", label: "AI 提炼", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          const source = $('[name="text"]', form).value.trim();
          if (!source) return false;
          const button = $('[data-modal-action="extract"]', $("#modal"));
          setBusy(button, true, "提炼中…");
          try {
            const result = await sendTextCompletion(config, [
              { role: "system", content: "你负责把人物描述提炼为角色卡字段。只返回 JSON 对象，包含 name、tag、persona、personality、scenario、speechStyle、background、catchphrases 数组、firstMessage。不要返回 Markdown 代码块。" },
              { role: "user", content: `${source}\n\n附加要求：${$('[name="instructions"]', form).value.trim() || "无"}` }
            ], { sampling: { temperature: 0.6, max_tokens: 2500 } });
            const parsed = JSON.parse(result.text.replace(/^```json\s*|\s*```$/g, "").trim());
            const character = defaultCharacter();
            Object.assign(character, {
              name: parsed.name || "未命名角色",
              tag: parsed.tag || "",
              persona: normalizeText(parsed.persona || ""),
              personality: normalizeText(parsed.personality || ""),
              scenario: normalizeText(parsed.scenario || ""),
              speechStyle: normalizeText(parsed.speechStyle || ""),
              background: normalizeText(parsed.background || ""),
              catchphrases: Array.isArray(parsed.catchphrases) ? parsed.catchphrases.map(String) : [],
              firstMessage: normalizeText(parsed.firstMessage || ""),
              rawFormat: "manual",
              raw: { source, aiResult: parsed }
            });
            await saveCharacter(character);
            closeModal();
            state.contentTab = "characters";
            state.profileTab = "content";
            navigate("profile");
            setTimeout(() => openCharacterForm(character.id), 0);
          } catch (error) {
            toast(`提炼失败：${error.message}`, "error", 5000);
            return false;
          } finally {
            setBusy(button, false);
          }
        }
      }
    ]
  });
}

/* ---------- 世界书表单 ---------- */

function openWorldbookForm(worldbookId = null) {
  const worldbook = worldbookId ? getById(state.worldbooks, worldbookId) : defaultWorldbook();
  if (!worldbook) return;
  openModal({
    title: worldbookId ? `编辑 ${worldbook.name}` : "新建世界书",
    body: `
      <div class="form-grid">
        ${renderFormField("名称", "name", worldbook.name, { required: true })}
        ${renderFormField("描述", "description", worldbook.description)}
        <div class="field full">
          <div class="surface-title"><strong>条目</strong><button type="button" class="btn small primary" data-action="add-world-entry">+ 添加</button></div>
          <div id="worldEntryList" data-drop-zone>${worldbook.entries.map(renderWorldEntryEditor).join("") || `<div class="entry-preview">暂无条目。</div>`}</div>
        </div>
      </div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          if (!form.reportValidity()) return false;
          worldbook.name = $('[name="name"]', form).value.trim();
          worldbook.description = $('[name="description"]', form).value.trim();
          worldbook.entries = collectWorldEntries(form, worldbook.id);
          worldbook.updatedAt = now();
          if (!worldbookId) worldbook.rawFormat = "manual";
          await dbPut("worldbooks", worldbook);
          await refreshAll();
          renderScreen();
          toast("世界书已保存");
        }
      }
    ]
  });
}

function renderWorldEntryEditor(entry) {
  return `
    <div class="prompt-item" data-world-entry data-entry-id="${escapeAttr(entry.id)}">
      <span class="drag-handle">⋮⋮</span>
      <div>
        <div class="form-grid">
          <div class="field"><label>备注名</label><input name="entryComment" value="${escapeAttr(entry.comment)}"></div>
          <div class="field"><label>关键词（逗号分隔）</label><input name="entryKeys" value="${escapeAttr(entry.key.join(", "))}"></div>
          <div class="field full"><label>内容</label><textarea name="entryContent">${escapeHtml(entry.content)}</textarea></div>
          <div class="field"><label>可见性</label><select name="entryVisibility">
            <option value="public" ${entry.visibility === "public" ? "selected" : ""}>公开</option>
            <option value="private" ${entry.visibility === "private" ? "selected" : ""}>仅自己</option>
            <option value="pov-only" ${entry.visibility === "pov-only" ? "selected" : ""}>仅单人线</option>
          </select></div>
          <div class="field"><label>所属角色</label><select name="entryOwner"><option value="">无</option>${state.characters.map((item) => `<option value="${escapeAttr(item.id)}" ${entry.ownerCharId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></div>
          <div class="field"><label>注入位置</label><select name="entryPosition"><option value="0" ${entry.position === 0 ? "selected" : ""}>角色描述前</option><option value="1" ${entry.position === 1 ? "selected" : ""}>角色描述后</option><option value="4" ${entry.position === 4 ? "selected" : ""}>指定深度</option></select></div>
          <div class="field"><label>深度</label><input type="number" name="entryDepth" value="${entry.depth}"></div>
          <div class="field"><label>顺序</label><input type="number" name="entryOrder" value="${entry.order}"></div>
          <div class="field"><label>概率</label><input type="number" name="entryProbability" value="${entry.probability}" min="0" max="100"></div>
          <div class="field full check-row"><span>常驻<small>忽略关键词，每轮注入</small></span><span class="switch"><input type="checkbox" name="entryConstant" ${entry.constant ? "checked" : ""}><i></i></span></div>
          <div class="field full check-row"><span>停用<small>SillyTavern 原字段为 disable</small></span><span class="switch"><input type="checkbox" name="entryDisable" ${entry.disable ? "checked" : ""}><i></i></span></div>
        </div>
      </div>
      <button type="button" class="icon-btn danger" data-action="remove-world-entry">×</button>
    </div>`;
}

function collectWorldEntries(form, worldbookId) {
  return $$("[data-world-entry]", form).map((node) => {
    const base = defaultWorldbookEntry(worldbookId);
    base.id = node.dataset.entryId || uid();
    base.comment = $('[name="entryComment"]', node).value.trim();
    base.key = $('[name="entryKeys"]', node).value.split(/[,，]/).map((item) => item.trim()).filter(Boolean);
    base.content = $('[name="entryContent"]', node).value;
    base.visibility = $('[name="entryVisibility"]', node).value;
    base.ownerCharId = $('[name="entryOwner"]', node).value || null;
    base.position = toNumber($('[name="entryPosition"]', node).value, 0);
    base.depth = toNumber($('[name="entryDepth"]', node).value, 4);
    base.order = toNumber($('[name="entryOrder"]', node).value, 100);
    base.probability = clamp(toNumber($('[name="entryProbability"]', node).value, 100), 0, 100);
    base.constant = $('[name="entryConstant"]', node).checked;
    base.disable = $('[name="entryDisable"]', node).checked;
    return base;
  });
}

function openWorldbookTest(worldbookId) {
  const worldbook = getById(state.worldbooks, worldbookId);
  if (!worldbook) return;
  openModal({
    title: `触发测试 · ${worldbook.name}`,
    body: `${renderFormField("测试文本", "testText", "", { type: "textarea", required: true, full: true, placeholder: "输入一句话，查看哪些关键词条目会被激活。" })}<div id="worldTestResult"></div>`,
    actions: [
      { id: "cancel", label: "关闭" },
      {
        id: "test", label: "测试", primary: true,
        handler: async (body) => {
          const text = $('[name="testText"]', body).value;
          const hits = (worldbook.entries || []).filter((entry) => {
            if (entry.disable) return false;
            if (entry.constant) return true;
            const keys = [...(entry.key || []), ...(entry.keysecondary || [])];
            const source = entry.caseSensitive ? text : text.toLowerCase();
            return keys.some((key) => source.includes(entry.caseSensitive ? key : String(key).toLowerCase()));
          });
          $("#worldTestResult").innerHTML = hits.length
            ? hits.map((entry) => `<div class="search-result"><strong>${escapeHtml(entry.comment || entry.key.join(", ") || "常驻条目")}</strong><p>${escapeHtml(entry.content.slice(0, 180))}</p></div>`).join("")
            : `<div class="entry-preview">没有条目被激活。</div>`;
          for (const entry of hits) {
            entry.triggerCount = (entry.triggerCount || 0) + 1;
            entry.lastTriggeredAt = now();
          }
          worldbook.updatedAt = now();
          await dbPut("worldbooks", worldbook);
          return false;
        }
      }
    ]
  });
}

/* ---------- 预设表单 ---------- */

function openPresetForm(presetId = null) {
  const preset = presetId ? getById(state.presets, presetId) : defaultPreset();
  if (!preset) return;
  openModal({
    title: presetId ? `编辑 ${preset.name}` : "新建预设",
    size: "wide",
    body: `
      <div class="form-grid">
        ${renderFormField("名称", "name", preset.name, { required: true })}
        ${renderFormField("描述", "description", preset.description)}
        ${renderFormField("temperature", "temperature", preset.temperature, { type: "number", step: "0.01" })}
        ${renderFormField("top_p", "top_p", preset.top_p, { type: "number", step: "0.01" })}
        ${renderFormField("max tokens", "openai_max_tokens", preset.openai_max_tokens, { type: "number" })}
        ${renderFormField("max context", "openai_max_context", preset.openai_max_context, { type: "number" })}
        ${renderFormField("frequency_penalty", "frequency_penalty", preset.frequency_penalty, { type: "number", step: "0.01" })}
        ${renderFormField("presence_penalty", "presence_penalty", preset.presence_penalty, { type: "number", step: "0.01" })}
        ${renderFormField("top_k", "top_k", preset.top_k, { type: "number" })}
        ${renderFormField("top_a", "top_a", preset.top_a, { type: "number" })}
        ${renderFormField("min_p", "min_p", preset.min_p, { type: "number" })}
        ${renderFormField("repetition_penalty", "repetition_penalty", preset.repetition_penalty, { type: "number", step: "0.01" })}
      </div>
      <div class="surface">
        <div class="surface-title"><strong>提示词</strong><button type="button" class="btn small primary" data-action="add-preset-prompt">+ 添加</button></div>
        <div id="presetPromptList">${preset.prompts.map(renderPresetPrompt).join("")}</div>
      </div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          const data = readForm($("form", body));
          Object.assign(preset, {
            name: data.name.trim(),
            description: data.description,
            temperature: toNumber(data.temperature, 1),
            top_p: toNumber(data.top_p, 1),
            openai_max_tokens: toNumber(data.openai_max_tokens, 4096),
            openai_max_context: toNumber(data.openai_max_context, 128000),
            frequency_penalty: toNumber(data.frequency_penalty, 0),
            presence_penalty: toNumber(data.presence_penalty, 0),
            top_k: toNumber(data.top_k, 0),
            top_a: toNumber(data.top_a, 0),
            min_p: toNumber(data.min_p, 0),
            repetition_penalty: toNumber(data.repetition_penalty, 1),
            prompts: collectPresetPrompts(body),
            updatedAt: now()
          });
          preset.prompt_order = [{ character_id: 100001, order: preset.prompts.map((item) => ({ identifier: item.identifier, enabled: item.enabled })) }];
          if (!presetId) preset.rawFormat = "manual";
          await dbPut("presets", preset);
          await refreshAll();
          renderScreen();
          toast("预设已保存");
        }
      }
    ]
  });
}

function renderPresetPrompt(prompt) {
  return `
    <div class="prompt-item" draggable="true" data-preset-prompt data-identifier="${escapeAttr(prompt.identifier)}">
      <span class="drag-handle">⋮⋮</span>
      <div>
        <div class="form-grid">
          <div class="field"><label>标识符</label><input name="promptIdentifier" value="${escapeAttr(prompt.identifier)}"></div>
          <div class="field"><label>名称</label><input name="promptName" value="${escapeAttr(prompt.name)}"></div>
          <div class="field"><label>角色</label><select name="promptRole"><option value="system" ${prompt.role === "system" ? "selected" : ""}>system</option><option value="user" ${prompt.role === "user" ? "selected" : ""}>user</option><option value="assistant" ${prompt.role === "assistant" ? "selected" : ""}>assistant</option></select></div>
          <div class="field"><label>注入深度</label><input type="number" name="promptDepth" value="${prompt.injection_depth}"></div>
          <div class="field"><label>注入位置</label><input type="number" name="promptPosition" value="${prompt.injection_position}"></div>
          <div class="field"><label>顺序</label><input type="number" name="promptOrder" value="${prompt.injection_order}"></div>
          <div class="field full"><label>内容</label><textarea name="promptContent">${escapeHtml(prompt.content)}</textarea></div>
          <div class="field check-row"><span>启用</span><span class="switch"><input type="checkbox" name="promptEnabled" ${prompt.enabled ? "checked" : ""}><i></i></span></div>
          <div class="field check-row"><span>系统提示</span><span class="switch"><input type="checkbox" name="promptSystem" ${prompt.system_prompt ? "checked" : ""}><i></i></span></div>
        </div>
      </div>
      <button type="button" class="icon-btn danger" data-action="remove-preset-prompt">×</button>
    </div>`;
}

function collectPresetPrompts(body) {
  return $$("[data-preset-prompt]", body).map((node) => ({
    identifier: $('[name="promptIdentifier"]', node).value.trim() || `prompt-${uid()}`,
    name: $('[name="promptName"]', node).value.trim(),
    enabled: $('[name="promptEnabled"]', node).checked,
    injection_position: toNumber($('[name="promptPosition"]', node).value, 0),
    injection_depth: toNumber($('[name="promptDepth"]', node).value, 4),
    injection_order: toNumber($('[name="promptOrder"]', node).value, 100),
    role: $('[name="promptRole"]', node).value,
    content: $('[name="promptContent"]', node).value,
    system_prompt: $('[name="promptSystem"]', node).checked,
    marker: false, forbid_overrides: false, injection_trigger: []
  }));
}

/* ---------- 正则与快捷回复表单 ---------- */

function openRegexForm(id = null) {
  const script = id ? getById(state.regexScripts, id) : defaultRegexScript();
  if (!script) return;
  openModal({
    title: id ? "编辑正则脚本" : "新建正则脚本",
    size: "wide",
    body: `
      <div class="form-grid">
        ${renderFormField("脚本名称", "scriptName", script.scriptName, { required: true })}
        ${renderFormField("findRegex", "findRegex", script.findRegex, { required: true, placeholder: "/<tag>[\\s\\S]*?<\\/tag>/g" })}
        ${renderFormField("replaceString", "replaceString", script.replaceString, { type: "textarea", tall: true, full: true })}
        ${renderFormField("裁剪字符串（每行一个）", "trimStrings", script.trimStrings.join("\n"), { type: "textarea", full: true })}
        <div class="field full"><span>placement</span><div class="chip-row">${[[1, "用户输入"], [2, "AI 输出显示"], [3, "发送提示词"]].map(([value, label]) => `<label class="chip ${script.placement.includes(value) ? "active" : ""}"><input type="checkbox" name="placement" value="${value}" ${script.placement.includes(value) ? "checked" : ""} style="margin-right:5px">${label}</label>`).join("")}</div></div>
        ${renderFormField("minDepth", "minDepth", script.minDepth ?? "", { type: "number" })}
        ${renderFormField("maxDepth", "maxDepth", script.maxDepth ?? "", { type: "number" })}
      </div>
      <div class="surface">
        <div class="check-row"><span>停用</span><span class="switch"><input type="checkbox" name="disabled" ${script.disabled ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>仅影响显示</span><span class="switch"><input type="checkbox" name="markdownOnly" ${script.markdownOnly ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>仅影响提示词</span><span class="switch"><input type="checkbox" name="promptOnly" ${script.promptOnly ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>编辑消息后重新运行</span><span class="switch"><input type="checkbox" name="runOnEdit" ${script.runOnEdit ? "checked" : ""}><i></i></span></div>
      </div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          if (!form.reportValidity()) return false;
          const data = readForm(form);
          Object.assign(script, {
            scriptName: data.scriptName.trim(),
            findRegex: data.findRegex.trim(),
            replaceString: data.replaceString,
            trimStrings: toLines(data.trimStrings),
            placement: $$("[name=placement]:checked", form).map((input) => Number(input.value)),
            disabled: Boolean(data.disabled),
            markdownOnly: Boolean(data.markdownOnly),
            promptOnly: Boolean(data.promptOnly),
            runOnEdit: Boolean(data.runOnEdit),
            minDepth: data.minDepth === "" ? null : toNumber(data.minDepth, 0),
            maxDepth: data.maxDepth === "" ? null : toNumber(data.maxDepth, 0),
            updatedAt: now()
          });
          await dbPut("regexScripts", script);
          await refreshAll();
          renderScreen();
          toast("正则脚本已保存");
        }
      }
    ]
  });
}

function openQuickReplyForm(id = null) {
  const group = id ? getById(state.quickReplies, id) : defaultQuickReply();
  if (!group) return;
  openModal({
    title: id ? "编辑快捷回复组" : "新建快捷回复组",
    size: "wide",
    body: `
      ${renderFormField("组名称", "name", group.name, { required: true, full: true })}
      <div class="surface-title" style="margin-top:14px"><strong>按钮</strong><button type="button" class="btn small primary" data-action="add-quick-button">+ 添加</button></div>
      <div id="quickButtonList">${group.qrList.map(renderQuickButton).join("")}</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          group.name = $('[name="name"]', form).value.trim();
          group.qrList = $$("[data-quick-button]", form).map((node, index) => ({
            id: index + 1,
            showLabel: $('[name="qrShowLabel"]', node).checked,
            label: $('[name="qrLabel"]', node).value.trim(),
            title: "",
            message: $('[name="qrMessage"]', node).value,
            contextList: [], preventAutoExecute: true,
            isHidden: $('[name="qrHidden"]', node).checked,
            executeOnStartup: false, executeOnUser: false, executeOnAi: false,
            executeOnChatChange: false, executeOnGroupMemberDraft: false,
            executeOnNewChat: false, automationId: ""
          }));
          group.idIndex = group.qrList.length + 1;
          group.updatedAt = now();
          await dbPut("quickReplies", group);
          await refreshAll();
          renderScreen();
          toast("快捷回复组已保存");
        }
      }
    ]
  });
}

function renderQuickButton(item) {
  return `
    <div class="prompt-item" data-quick-button>
      <span class="drag-handle">⌘</span>
      <div class="form-grid">
        <div class="field"><label>按钮名</label><input name="qrLabel" value="${escapeAttr(item.label)}"></div>
        <div class="field"><label>内容</label><input name="qrMessage" value="${escapeAttr(item.message)}"></div>
        <div class="field check-row"><span>显示标签</span><span class="switch"><input type="checkbox" name="qrShowLabel" ${item.showLabel ? "checked" : ""}><i></i></span></div>
        <div class="field check-row"><span>隐藏按钮</span><span class="switch"><input type="checkbox" name="qrHidden" ${item.isHidden ? "checked" : ""}><i></i></span></div>
      </div>
      <button type="button" class="icon-btn danger" data-action="remove-quick-button">×</button>
    </div>`;
}

/* ---------- API 管理 ---------- */

function openApiManager(category = "text") {
  state.apiTab = category;
  openModal({ title: "API 配置", size: "wide", body: renderApiManagerBody() });
}

function renderApiManagerBody() {
  const tabs = [["text", "文字"], ["image", "图片"], ["video", "视频"]];
  const configs = state.apiConfigs.filter((item) => item.category === state.apiTab);
  const templates = API_CATALOG[state.apiTab] || [];
  return `
    <div class="tabs" style="padding:0 0 12px">${tabs.map(([id, label]) => `<button type="button" class="tab ${state.apiTab === id ? "active" : ""}" data-action="api-tab" data-tab="${id}">${label}</button>`).join("")}</div>
    ${configs.length ? configs.map((config) => `
      <article class="api-card">
        <div class="card-head">
          <div class="card-head-main"><strong>${escapeHtml(config.name || config.provider)}</strong><small>${escapeHtml(config.model || "未填写模型")} ${config.category === "text" ? `· 思考：${config.reasoning?.mode === "off" ? "关闭" : config.reasoning?.mode === "on" ? "开启" : "自动"}` : ""} · ${config.lastTestResult ? `最近测试：${escapeHtml(config.lastTestResult)}` : "尚未测试"}</small></div>
          <span class="tag ${config.enabled ? "acc" : ""}">${config.enabled ? "启用" : "停用"}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn small primary" data-action="edit-api" data-id="${escapeAttr(config.id)}">编辑</button>
          <button type="button" class="btn small" data-action="test-api" data-id="${escapeAttr(config.id)}">测试连接</button>
          <button type="button" class="btn small" data-action="set-default-api" data-id="${escapeAttr(config.id)}">设为默认</button>
          <button type="button" class="btn small danger" data-action="delete-api" data-id="${escapeAttr(config.id)}">删除</button>
        </div>
      </article>`).join("") : `<div class="empty-state" style="min-height:220px;padding:20px"><div class="empty-illustration">⇄</div><h2>还没有 ${state.apiTab === "text" ? "文字" : state.apiTab === "image" ? "图片" : "视频"}接口</h2><p>选择下方默认模板开始，所有 URL、请求体和解析路径均可修改。</p></div>`}
    <div class="surface" style="margin-top:14px">
      <div class="surface-title"><strong>默认模板</strong><span>点击后创建独立配置，不会提交请求</span></div>
      <div class="menu-list">
        ${templates.map((template, index) => `<button type="button" class="provider-template" data-action="add-api-template" data-template-index="${index}"><strong>${escapeHtml(template.name)}</strong><br>${escapeHtml(template.model || "自定义")} · ${escapeHtml(template.hint || "")}</button>`).join("")}
      </div>
    </div>`;
}

function refreshApiManager() {
  const form = $(".modal-body form");
  if (form) form.innerHTML = renderApiManagerBody();
}

function openApiEditor(config) {
  const categoryName = config.category === "text" ? "文字" : config.category === "image" ? "图片" : "视频";
  openModal({
    title: `${categoryName}接口配置`,
    size: "wide",
    body: `
      <div class="form-grid">
        ${renderFormField("配置名称", "name", config.name, { required: true })}
        ${renderFormField("Provider", "provider", config.provider)}
        ${renderFormField("Base URL", "baseUrl", config.baseUrl, { required: true, full: true })}
        ${renderFormField("API Key", "apiKey", config.apiKey, { type: "password", full: true })}
        ${renderFormField("模型", "model", config.model, { required: true, full: true })}
        ${renderFormField("温度", "temperature", config.sampling.temperature ?? "", { type: "number", step: "0.01" })}
        ${renderFormField("top_p", "top_p", config.sampling.top_p ?? "", { type: "number", step: "0.01" })}
        ${renderFormField("max_tokens", "max_tokens", config.sampling.max_tokens ?? "", { type: "number" })}
        ${renderFormField("top_k", "top_k", config.sampling.top_k ?? "", { type: "number" })}
        ${config.category === "text" ? renderFormField("思考模式", "reasoningMode", config.reasoning?.mode || "auto", { type: "select", options: [["auto", "自动 / 使用模型默认"], ["off", "关闭思考"], ["on", "开启思考"]] }) : ""}
        ${config.category === "text" ? renderFormField("思考强度", "reasoningEffort", config.reasoning?.effort || "high", { type: "select", options: [["low", "低"], ["high", "高"], ["max", "最高"]] }) : ""}
      </div>
      ${config.category === "text" ? `<div class="surface" style="margin-top:14px"><div class="surface-title"><strong>DeepSeek 采样兼容</strong><span>官方行为</span></div><div class="field-hint">DeepSeek 思考模式默认开启。开启时 temperature、presence_penalty、frequency_penalty 会被忽略，top_p 最低按 0.95 生效；关闭思考后 temperature 等采样参数恢复。选择“关闭思考”会发送 <code>thinking: {type:"disabled"}</code>。</div></div>` : ""}
      <div class="surface" style="margin-top:14px">
        <div class="surface-title"><strong>通用 HTTP 请求</strong><span>支持 {{model}}、{{prompt}}、{{apiKey}}、{{referenceImage}}</span></div>
        <div class="form-grid">
          ${renderFormField("请求方法", "method", config.requestTemplate.method, { type: "select", options: [["POST", "POST"], ["GET", "GET"]] })}
          ${renderFormField("响应解析路径", "responsePath", config.requestTemplate.responsePath, { placeholder: "data.images[0].url" })}
          ${renderFormField("请求头 JSON", "headers", JSON.stringify(config.requestTemplate.headers || {}, null, 2), { type: "textarea", full: true })}
          ${renderFormField("请求体模板", "bodyTemplate", config.requestTemplate.bodyTemplate, { type: "textarea", tall: true, full: true })}
        </div>
      </div>
      <div class="check-row"><span>启用此配置</span><span class="switch"><input type="checkbox" name="enabled" ${config.enabled ? "checked" : ""}><i></i></span></div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          if (!form.reportValidity()) return false;
          const data = readForm(form);
          config.name = data.name.trim();
          config.provider = data.provider.trim();
          config.baseUrl = data.baseUrl.trim();
          config.apiKey = data.apiKey.trim();
          config.model = data.model.trim();
          config.sampling = {
            ...config.sampling,
            temperature: data.temperature === "" ? null : toNumber(data.temperature),
            top_p: data.top_p === "" ? null : toNumber(data.top_p),
            max_tokens: data.max_tokens === "" ? null : toNumber(data.max_tokens),
            top_k: data.top_k === "" ? null : toNumber(data.top_k)
          };
          config.reasoning = {
            mode: data.reasoningMode || "auto",
            effort: data.reasoningEffort || "high"
          };
          config.requestTemplate = {
            method: data.method || "POST",
            headers: parseJsonSafe(data.headers, {}),
            bodyTemplate: data.bodyTemplate,
            responsePath: data.responsePath
          };
          config.enabled = Boolean(data.enabled);
          config.updatedAt = now();
          await dbPut("apiConfigs", config);
          await refreshAll();
          openApiManager(config.category);
          toast("API 配置已保存");
        }
      }
    ]
  });
}

/* ---------- 设置与锁屏 ---------- */

function openSettings() {
  const settings = state.settings;
  openModal({
    title: "设置",
    size: "wide",
    body: `
      <div class="surface">
        <div class="surface-title"><strong>外观</strong><span>主题可在左侧快速切换</span></div>
        <div class="form-grid">
          ${renderFormField("字体缩放", "fontScale", settings.fontScale, { type: "number", step: "0.05", min: "0.8", max: "1.5" })}
          ${renderFormField("气泡圆角（留空跟随主题）", "bubbleRadius", settings.bubbleRadius ?? "", { type: "number" })}
          ${renderFormField("日夜主题", "themeMode", settings.themeMode || "system", { type: "select", options: [["system", "跟随系统"], ["day", "日间版"], ["night", "夜间版"]] })}
          <div class="field full check-row"><span>跟随系统浅色 / 深色</span><span class="switch"><input type="checkbox" name="followSystem" ${settings.followSystem ? "checked" : ""}><i></i></span></div>
          ${renderFormField("额外 CSS", "customCss", settings.customCss, { type: "textarea", full: true })}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>聊天行为</strong><span>消息与上下文</span></div>
        <div class="check-row"><span>显示正在输入</span><span class="switch"><input type="checkbox" name="typingIndicator" ${settings.typingIndicator ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>自动生成摘要</span><span class="switch"><input type="checkbox" name="autoSummary" ${settings.autoSummary ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>每日回顾</span><span class="switch"><input type="checkbox" name="dailyReviewEnabled" ${settings.dailyReviewEnabled !== false ? "checked" : ""}><i></i></span></div>
        <div class="check-row"><span>回车发送</span><span class="switch"><input type="checkbox" name="sendOnEnter" ${settings.sendOnEnter ? "checked" : ""}><i></i></span></div>
        <div class="form-grid">
          ${renderFormField("默认预设", "defaultPresetId", settings.defaultPresetId || "", { type: "select", options: [["", "不使用全局预设"], ...state.presets.map((item) => [item.id, item.name])] })}
          ${renderFormField("用户姓名", "userName", settings.userProfile?.name || "你")}
          ${renderFormField("用户设定", "userDescription", settings.userProfile?.description || "", { type: "textarea", full: true })}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>代理</strong><span>解决 file:// 打开时的 CORS</span></div>
        <div class="form-grid">
          ${renderFormField("反向代理地址", "proxyUrl", settings.proxyUrl || "", { full: true, placeholder: "http://127.0.0.1:8787/proxy" })}
          ${renderFormField("自定义请求头 JSON", "proxyHeaders", JSON.stringify(settings.proxyHeaders || {}, null, 2), { type: "textarea", full: true })}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>主动消息</strong><span>--warn 暖色只用于此类提示</span></div>
        <div class="check-row"><span>全局启用</span><span class="switch"><input type="checkbox" name="proactiveGlobalEnabled" ${settings.proactiveGlobalEnabled ? "checked" : ""}><i></i></span></div>
        <div class="form-grid">
          ${renderFormField("每周期最多主动消息", "proactiveMaxPerCycle", settings.proactiveMaxPerCycle ?? 3, { type: "number", min: 1, max: 20 })}
          ${renderFormField("安静时段开始", "quietStart", settings.quietHours[0], { type: "time" })}
          ${renderFormField("安静时段结束", "quietEnd", settings.quietHours[1], { type: "time" })}
        </div>
      </div>
      <div class="surface">
        <div class="surface-title"><strong>锁屏</strong><span>本机 PIN，不用于加密数据库</span></div>
        <div class="check-row"><span>启用锁屏</span><span class="switch"><input type="checkbox" name="lockEnabled" ${settings.lockEnabled ? "checked" : ""}><i></i></span></div>
        ${renderFormField("锁屏 PIN", "lockPin", settings.lockPin || "", { type: "password", full: true })}
      </div>
      <div class="surface">
        <div class="surface-title"><strong>数据</strong><span>IndexedDB · 版本 ${settings.version}</span></div>
        <div class="card-actions">
          <button type="button" class="btn small primary" data-action="open-api-manager">API 配置</button>
          <button type="button" class="btn small" data-action="export-backup">导出存档</button>
          <button type="button" class="btn small" data-action="import-file" data-import-kind="backup">恢复存档</button>
        </div>
      </div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存设置", primary: true,
        handler: async (body) => {
          const data = readForm($("form", body));
          Object.assign(settings, {
            fontScale: clamp(toNumber(data.fontScale, 1), .8, 1.5),
            bubbleRadius: data.bubbleRadius === "" ? null : toNumber(data.bubbleRadius, 0),
            themeMode: data.themeMode || "system",
            followSystem: Boolean(data.followSystem),
            customCss: data.customCss,
            typingIndicator: Boolean(data.typingIndicator),
            autoSummary: Boolean(data.autoSummary),
            dailyReviewEnabled: Boolean(data.dailyReviewEnabled),
            sendOnEnter: Boolean(data.sendOnEnter),
            defaultPresetId: data.defaultPresetId || null,
            userProfile: { name: data.userName.trim() || "你", description: data.userDescription },
            proxyUrl: data.proxyUrl.trim(),
            proxyHeaders: parseJsonSafe(data.proxyHeaders, {}),
            proactiveGlobalEnabled: Boolean(data.proactiveGlobalEnabled),
            proactiveMaxPerCycle: clamp(toNumber(data.proactiveMaxPerCycle, 3), 1, 20),
            quietHours: [data.quietStart || "23:00", data.quietEnd || "07:00"],
            lockEnabled: Boolean(data.lockEnabled),
            lockPin: data.lockPin.trim()
          });
          await saveSettings();
          applyTheme();
          renderThemeRail();
          renderScreen();
          toast("设置已保存");
        }
      }
    ]
  });
}

async function saveSettings() {
  await dbPut("settings", state.settings);
}

function lockApp() {
  state.settings.lockEnabled = true;
  $("#lockScreen").classList.remove("hidden");
}

async function unlockApp() {
  const pin = state.settings.lockPin || "";
  if (pin && window.prompt("输入锁屏 PIN") !== pin) {
    toast("PIN 不正确", "error");
    return;
  }
  $("#lockScreen").classList.add("hidden");
}

function openNotifications() {
  const notifications = state.settings.notifications || [];
  openModal({
    title: "通知中心",
    body: notifications.length ? notifications.map((item) => `
      <article class="notification ${item.read ? "" : "unread"}">
        <strong>${escapeHtml(item.title || "通知")}</strong>
        <span>${escapeHtml(item.text || "")}</span>
        <span>${formatRelativeTime(item.createdAt)}</span>
        ${item.chatId ? `<div class="card-actions"><button type="button" class="btn small" data-action="open-notification-chat" data-chat-id="${escapeAttr(item.chatId)}">打开聊天</button></div>` : ""}
      </article>`).join("") : `<div class="empty-state" style="min-height:260px"><div class="empty-illustration">◉</div><h2>没有通知</h2><p>角色主动消息和本地日程提醒会出现在这里。</p></div>`,
    actions: [
      { id: "clear", label: "清空", danger: true, handler: async () => { state.settings.notifications = []; await saveSettings(); renderScreen(); } },
      { id: "close", label: "关闭", primary: true, handler: async () => { state.settings.notifications = state.settings.notifications.map((item) => ({ ...item, read: true })); await saveSettings(); renderScreen(); } }
    ]
  });
}

/* ---------- 日程、朋友圈与健康 ---------- */

function openSchedules() {
  const schedules = state.settings.schedules || [];
  openModal({
    title: "纪念日与日程",
    body: `
      <div class="surface-title"><strong>提醒</strong><button type="button" class="btn small primary" data-action="add-schedule">+ 添加</button></div>
      <div id="scheduleList">${schedules.length ? schedules.map((item) => `
        <div class="prompt-item" data-schedule data-id="${escapeAttr(item.id)}">
          <span class="drag-handle">◷</span>
          <div><div class="form-grid">
            <div class="field"><label>名称</label><input name="scheduleTitle" value="${escapeAttr(item.title)}"></div>
            <div class="field"><label>时间</label><input type="datetime-local" name="scheduleTime" value="${escapeAttr(item.time)}"></div>
            <div class="field full"><label>备注</label><input name="scheduleNote" value="${escapeAttr(item.note || "")}"></div>
          </div></div>
          <button type="button" class="icon-btn danger" data-action="remove-schedule">×</button>
        </div>`).join("") : `<div class="entry-preview">暂无日程。</div>`}</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          state.settings.schedules = $$("[data-schedule]", body).map((node) => ({
            id: node.dataset.id || uid(),
            title: $('[name="scheduleTitle"]', node).value.trim(),
            time: $('[name="scheduleTime"]', node).value,
            note: $('[name="scheduleNote"]', node).value.trim(),
            notified: false
          })).filter((item) => item.title && item.time);
          await saveSettings();
          renderScreen();
          toast("日程已保存");
        }
      }
    ]
  });
}

function checkScheduledNotifications() {
  setInterval(async () => {
    let changed = false;
    for (const schedule of state.settings.schedules || []) {
      if (schedule.notified || !schedule.time) continue;
      if (new Date(schedule.time).getTime() <= now()) {
        schedule.notified = true;
        changed = true;
        await addNotification({ type: "schedule", title: schedule.title, text: schedule.note || "日程时间已到", scheduleId: schedule.id });
      }
    }
    if (changed) {
      await saveSettings();
      renderScreen();
    }
  }, 60_000);
}

/* ---------- 每日回顾 ---------- */

async function checkDailyReview() {
  if (!state.settings.dailyReviewEnabled) return;
  const todayKey = new Date().toDateString();
  if (state.settings.lastDailyReviewKey === todayKey) return;
  const since = now() - 24 * 3_600_000;
  const recentMessages = await dbGetAll("messages");
  const recent = recentMessages.filter((message) => message.time >= since);
  if (!recent.length) return;
  const chatIds = [...new Set(recent.map((message) => message.chatId))];
  const conversations = chatIds.map((chatId) => {
    const chat = state.chats.find((item) => item.id === chatId);
    const messages = recent.filter((message) => message.chatId === chatId).sort((a, b) => a.time - b.time);
    const last = messages.at(-1);
    const question = [...messages].reverse().find((message) => /\?|？|吗|还记得|怎么办/.test(message.text || ""));
    return {
      chat,
      count: messages.length,
      last,
      unfinished: question?.text || ""
    };
  }).filter((item) => item.chat);
  const memories = (state.settings.memoryCards || []).filter((memory) => memory.createdAt >= since);
  const lines = conversations.map((item) => `和“${item.chat.title}”聊了 ${item.count} 条消息`);
  if (memories.length) lines.push(`新增 ${memories.length} 张纪念卡：${memories.map((item) => item.title).join("、")}`);
  const unfinished = conversations.map((item) => item.unfinished).filter(Boolean);
  if (unfinished.length) lines.push(`未完成的话题：${unfinished[0].slice(0, 60)}`);
  openModal({
    title: "今日回顾",
    body: `
      <div class="surface">
        <div class="surface-title"><strong>过去 24 小时</strong><span>${conversations.length} 个聊天窗口</span></div>
        ${lines.map((line) => `<div class="search-result">${escapeHtml(line)}</div>`).join("")}
      </div>
      <div class="field-hint">回顾只在本地生成。使用 AI 深化时会发送最近对话的摘要片段。</div>
    `,
    actions: [
      {
        id: "later", label: "今天不再显示",
        handler: async () => {
          state.settings.lastDailyReviewKey = todayKey;
          await saveSettings();
        }
      },
      {
        id: "ai", label: "AI 深化",
        handler: async (body) => {
          const config = getDefaultApi("text");
          if (!config) {
            toast("未配置文字模型", "error");
            return false;
          }
          const button = $('[data-modal-action="ai"]', $("#modal"));
          setBusy(button, true, "整理中");
          try {
            const result = await sendTextCompletion(config, [
              { role: "system", content: "把过去24小时的聊天整理成一份温柔的今日回顾。分别写：关系变化、未完成话题、明天可以自然接上的话。不要评价用户，控制在150字以内。" },
              { role: "user", content: conversations.map((item) => `${item.chat.title}：${recent.filter((message) => message.chatId === item.chat.id).map(messagePreview).join("；")}`).join("\n") }
            ], { sampling: { temperature: .5, max_tokens: 500 } });
            $(".modal-body", $("#modal")).innerHTML = `<div class="surface"><p class="memory-scene">${escapeHtml(result.text.trim()).replace(/\n/g, "<br>")}</p></div>`;
            state.settings.lastDailyReviewKey = todayKey;
            await saveSettings();
          } catch (error) {
            toast(error.message, "error");
          } finally {
            setBusy(button, false);
          }
          return false;
        }
      }
    ]
  });
}

function openMoments() {
  const moments = state.settings.moments || [];
  openModal({
    title: "朋友圈",
    body: `
      <div class="card-actions" style="margin:0 0 12px">
        <button type="button" class="btn primary" data-action="create-moment">发布动态</button>
        ${state.characters.length ? `<button type="button" class="btn" data-action="generate-character-moment">让角色发动态</button>` : ""}
      </div>
      <div style="margin-top:12px">${moments.length ? moments.map((item) => `
        <article class="notification">
          <strong>${escapeHtml(item.author || state.settings.userProfile?.name || "你")}</strong>
          <span>${escapeHtml(item.text)}</span>
          <span>${formatRelativeTime(item.createdAt)} · ${(item.likes || []).length} 个赞 · ${(item.comments || []).length} 条评论</span>
          <div class="card-actions"><button type="button" class="btn small" data-action="like-moment" data-id="${escapeAttr(item.id)}">赞</button><button type="button" class="btn small" data-action="comment-moment" data-id="${escapeAttr(item.id)}">评论</button><button type="button" class="btn small danger" data-action="delete-moment" data-id="${escapeAttr(item.id)}">删除</button></div>
        </article>`).join("") : `<div class="empty-state" style="min-height:240px;padding:18px"><div class="empty-illustration">◎</div><h2>还没有动态</h2><p>动态只保存在本机，也可以让角色看到后自然回应。</p></div>`}</div>
    `
  });
}

function openCreateMoment() {
  openModal({
    title: "发布动态",
    body: renderFormField("内容", "momentText", "", { type: "textarea", tall: true, required: true, full: true }),
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "发布", primary: true,
        handler: async (body) => {
          const text = $('[name="momentText"]', body).value.trim();
          if (!text) return false;
          state.settings.moments.unshift({
            id: uid(), author: state.settings.userProfile?.name || "你",
            text, createdAt: now(), likes: [], comments: []
          });
          await saveSettings();
          closeModal();
          toast("动态已发布");
        }
      }
    ]
  });
}

function openHealthEditor() {
  const health = state.settings.health || {};
  openModal({
    title: "录入体征数据",
    body: `
      <div class="form-grid">
        ${renderFormField("心率 bpm", "heartRate", health.heartRate ?? "", { type: "number" })}
        ${renderFormField("体温 °C", "temperature", health.temperature ?? "", { type: "number", step: "0.1" })}
        ${renderFormField("睡眠小时", "sleep", health.sleep ?? "", { type: "number", step: "0.1" })}
        ${renderFormField("步数", "steps", health.steps ?? "", { type: "number" })}
        ${renderFormField("地点", "location", health.location || "")}
        ${renderFormField("天气", "weather", health.weather || "")}
      </div>
      <p class="field-hint">原始读数不会直接发送给角色。应用只会在授权且状态变化时生成感知量。</p>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          const data = readForm($("form", body));
          state.settings.health = {
            heartRate: data.heartRate === "" ? null : toNumber(data.heartRate),
            temperature: data.temperature === "" ? null : toNumber(data.temperature),
            sleep: data.sleep === "" ? null : toNumber(data.sleep),
            steps: data.steps === "" ? null : toNumber(data.steps),
            location: data.location.trim(),
            weather: data.weather.trim(),
            updatedAt: now(),
            lastPerceptions: {}
          };
          updateHealthPerceptions();
          await saveSettings();
          renderScreen();
          toast("体征数据已更新");
        }
      }
    ]
  });
}

/* ---------- 存档 ---------- */

async function exportBackup() {
  const stores = {};
  for (const storeName of Object.keys(STORE_DEFS)) stores[storeName] = await dbGetAll(storeName);
  const payload = { app: "PocketLink", version: APP_VERSION, exportedAt: now(), stores };
  state.settings.lastBackupAt = now();
  await saveSettings();
  downloadJson(`pocketlink-backup-${new Date().toISOString().slice(0, 10)}.json`, payload);
  toast("存档已导出");
}

async function restoreBackup(payload) {
  assert(payload.app === "PocketLink" && isObject(payload.stores), "不是 PocketLink 存档");
  if (!await confirmDialog("恢复存档？", "当前本地数据会被存档中的内容替换。", "恢复")) return false;
  for (const storeName of Object.keys(STORE_DEFS)) {
    await dbClear(storeName);
    for (const item of payload.stores[storeName] || []) await dbPut(storeName, item);
  }
  await refreshAll();
  renderScreen();
  return true;
}

/* ---------- 约会系统 ---------- */

function openCreateDate() {
  if (!state.characters.length) {
    toast("请先创建角色", "error");
    return;
  }
  openModal({
    title: "新建约会",
    body: `
      ${renderFormField("标题", "title", "", { required: true, full: true })}
      <div class="field full"><label>参与角色</label><div>${state.characters.map((item) => `<label class="check-row"><span>${escapeHtml(item.name)}</span><span class="switch"><input type="checkbox" name="dateMember" value="${escapeAttr(item.id)}"><i></i></span></label>`).join("")}</div></div>
      ${renderFormField("起点 beat", "firstBeat", "", { type: "textarea", tall: true, full: true, placeholder: "场景、目标或第一段剧情。" })}
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "创建", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          const name = $('[name="title"]', form).value.trim();
          const memberIds = $$("[name=dateMember]:checked", form).map((input) => input.value);
          if (!name || !memberIds.length) return false;
          state.settings.dates.unshift({
            id: uid(), title: name, createdAt: now(), updatedAt: now(),
            memberIds, currentBeat: 0,
            beats: [{ id: uid(), title: "起点", text: $('[name="firstBeat"]', form).value.trim(), choice: "", branch: null }],
            endings: [],
            affection: Object.fromEntries(memberIds.map((id) => [id, 0])),
            status: "进行中"
          });
          await saveSettings();
          renderScreen();
          toast("约会已创建");
        }
      }
    ]
  });
}

function openAddDateBeat(dateId) {
  const date = state.settings.dates.find((item) => item.id === dateId);
  if (!date) return;
  openModal({
    title: "添加剧情 beat",
    body: `${renderFormField("标题", "beatTitle", "", { required: true, full: true })}${renderFormField("剧情", "beatText", "", { type: "textarea", tall: true, full: true })}${renderFormField("分歧点", "beatChoice", "", { type: "textarea", full: true, placeholder: "例如：去海边 / 留在咖啡馆" })}`,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "添加", primary: true,
        handler: async () => {
          date.beats.push({
            id: uid(),
            title: $('[name="beatTitle"]', $("#modal")).value.trim(),
            text: $('[name="beatText"]', $("#modal")).value.trim(),
            choice: $('[name="beatChoice"]', $("#modal")).value.trim(),
            branch: null
          });
          date.updatedAt = now();
          await saveSettings();
          renderScreen();
        }
      }
    ]
  });
}

function openAddDateEnding(dateId) {
  const date = state.settings.dates.find((item) => item.id === dateId);
  if (!date) return;
  openModal({
    title: "添加结局",
    body: `${renderFormField("结局名称", "endingTitle", "", { required: true, full: true })}${renderFormField("结局内容", "endingText", "", { type: "textarea", tall: true, full: true })}`,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "添加", primary: true,
        handler: async () => {
          date.endings.push({
            id: uid(),
            title: $('[name="endingTitle"]', $("#modal")).value.trim(),
            text: $('[name="endingText"]', $("#modal")).value.trim()
          });
          date.updatedAt = now();
          await saveSettings();
          renderScreen();
        }
      }
    ]
  });
}

async function advanceDate(dateId) {
  const date = state.settings.dates.find((item) => item.id === dateId);
  if (!date) return;
  if (date.currentBeat < date.beats.length - 1) date.currentBeat += 1;
  else if (date.endings.length) {
    date.status = date.endings[0].title;
    openModal({ title: date.endings[0].title, body: `<p style="font-size:12px;line-height:1.8">${escapeHtml(date.endings[0].text)}</p>` });
    if (!date.memoryCardId) {
      const memory = await createMemoryCard({
        characterIds: date.memberIds,
        title: `${date.title} · ${date.endings[0].title}`,
        scene: date.endings[0].text || date.beats.at(-1)?.text || "",
        keyDialogue: (date.beats || []).slice(-4).map((beat) => ({
          speaker: "剧情",
          text: beat.choice || beat.text || beat.title
        })),
        affinityAtTime: Math.max(...Object.values(date.affection || { value: 0 })),
        imageUrl: null
      });
      date.memoryCardId = memory.id;
    }
  } else {
    date.status = "等待结局";
  }
  for (const memberId of date.memberIds) date.affection[memberId] = (date.affection[memberId] || 0) + 1;
  date.updatedAt = now();
  await saveSettings();
  renderScreen();
}

/* ---------- 主题编辑器 ---------- */

function normalizeHex(value) {
  const source = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(source)) return source;
  if (/^#[0-9a-f]{3}$/i.test(source)) return `#${source.slice(1).split("").map((char) => char + char).join("")}`;
  return "#888888";
}

function openThemeManager() {
  openModal({
    title: "主题外观",
    size: "wide",
    body: `
      <div class="theme-card-grid">${state.themes.map(renderThemeCard).join("")}</div>
      <div class="card-actions" style="margin-top:12px">
        <button type="button" class="btn primary" data-action="create-theme">自定义主题</button>
        <button type="button" class="btn" data-action="import-file" data-import-kind="theme">导入主题</button>
        <button type="button" class="btn" data-action="open-settings">字体、日夜模式等设置</button>
      </div>
    `
  });
}

function openThemeEditor() {
  const theme = {
    id: uid(), createdAt: now(), updatedAt: now(), name: "",
    builtIn: false, desc: "自定义主题", vars: clone(BUILTIN_THEMES[0].vars),
    raw: null, rawFormat: "manual", customCss: ""
  };
  const colorKeys = ["bg", "bg2", "panel", "panel2", "pop", "line", "line2", "fg", "dim", "faint", "acc", "acc2", "ok", "warn", "err", "meFg", "bubble"];
  openModal({
    title: "自定义主题",
    size: "wide",
    body: `
      ${renderFormField("主题名称", "name", theme.name, { required: true, full: true })}
      <div class="form-grid">
        ${colorKeys.map((key) => `<div class="field"><label>${key}</label><input type="${theme.vars[key]?.startsWith("linear-gradient") ? "text" : "color"}" name="var_${key}" value="${escapeAttr(theme.vars[key]?.startsWith("linear-gradient") ? theme.vars[key] : normalizeHex(theme.vars[key]))}"></div>`).join("")}
        ${renderFormField("自己气泡", "var_me", theme.vars.me)}
        ${renderFormField("全局圆角", "var_radius", theme.vars.radius)}
        ${renderFormField("气泡圆角", "var_radiusBubble", theme.vars.radiusBubble)}
        ${renderFormField("字体族", "var_font", theme.vars.font, { full: true })}
        ${renderFormField("全局阴影", "var_shadow", theme.vars.shadow, { full: true })}
        ${renderFormField("气泡阴影", "var_shadowBubble", theme.vars.shadowBubble, { full: true })}
      </div>
      ${renderFormField("附加 CSS", "customCss", theme.customCss, { type: "textarea", tall: true, full: true })}
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存主题", primary: true,
        handler: async (body) => {
          const data = readForm($("form", body));
          theme.name = data.name.trim();
          theme.vars = { ...theme.vars };
          for (const key of [...colorKeys, "me", "radius", "radiusBubble", "font", "shadow", "shadowBubble"]) theme.vars[key] = data[`var_${key}`];
          theme.customCss = data.customCss;
          theme.updatedAt = now();
          await dbPut("themes", theme);
          state.settings.theme = theme.id;
          state.settings.followSystem = false;
          await saveSettings();
          await refreshAll();
          applyTheme();
          renderScreen();
          toast("主题已保存并切换");
        }
      }
    ]
  });
}

/* ============================================================
 * 聊天菜单与消息交互
 * ============================================================ */

function openChatMenu() {
  const chat = state.currentChat;
  assert(chat, "聊天不存在");
  openSheet("聊天设置", [
    { icon: "☎", title: "语音通话", subtitle: "使用麦克风和角色语音", action: "start-voice-call" },
    { icon: "▣", title: "视频通话", subtitle: "摄像头预览与生成画面", action: "start-video-call" },
    { icon: "▧", title: "从相册发送图片", subtitle: "选择本机图片发送", action: "send-photo" },
    { icon: "▶", title: "从相册发送视频", subtitle: "选择本机视频发送", action: "send-video" },
    { icon: "☺", title: "发送表情", subtitle: "Emoji 表情消息", action: "send-emoji" },
    { icon: "⌖", title: "分享位置", subtitle: "发送“我在这里”位置卡片", action: "send-location" },
    { icon: "¥", title: "发红包", subtitle: "本地娱乐钱包，不连接真实支付", action: "send-transfer" },
    { icon: "✦", title: "互动问答", subtitle: "真心话、五五开、记忆考验", action: "open-interactions" },
    { icon: "☾", title: "哄睡模式", subtitle: "白噪音与角色轻声朗读", action: "open-sleep-mode" },
    { icon: "⌕", title: "搜索消息", subtitle: "在本地聊天记录中查找", action: "search-chat" },
    { icon: "✎", title: "编辑聊天标题", subtitle: chat.title, action: "rename-chat" },
    { icon: "⌖", title: chat.pinned ? "取消置顶" : "置顶聊天", subtitle: "调整首页排序", action: "toggle-pin-chat" },
    { icon: chat.muted ? "◉" : "○", title: chat.muted ? "取消静音" : "静音聊天", subtitle: "停止未读提示", action: "toggle-mute-chat" },
    { icon: "▦", title: "聊天摘要", subtitle: chat.summary ? "查看或重建摘要" : "压缩较早对话", action: "manage-summary" },
    { icon: "✦", title: "这一刻值得记住", subtitle: "把最近的消息保存成纪念卡", action: "create-memory" },
    { icon: "⌁", title: "生成图片", subtitle: "使用已配置的图片接口", action: "generate-image" },
    { icon: "▶", title: "生成视频", subtitle: "使用已配置的视频接口", action: "generate-video" },
    { icon: "▣", title: "系统附加提示", subtitle: "只影响当前聊天", action: "edit-chat-extra" },
    { icon: "×", title: "删除聊天", subtitle: "同时删除该窗口全部消息", danger: true, action: "delete-chat" }
  ]);
}

function openChatMore() {
  openSheet("更多", [
    { icon: "▧", title: "从相册发送图片", subtitle: "相册图片会压缩后保存在本机", action: "send-photo" },
    { icon: "▶", title: "从相册发送视频", subtitle: "选择手机或电脑中的视频", action: "send-video" },
    { icon: "☺", title: "发送表情", subtitle: "发送一个表情反应", action: "send-emoji" },
    { icon: "⌖", title: "分享位置", subtitle: "发送位置卡片", action: "send-location" },
    { icon: "¥", title: "发红包", subtitle: "本地娱乐红包", action: "send-transfer" },
    { icon: "✦", title: "互动问答", subtitle: "进入角色引导的小互动", action: "open-interactions" },
    { icon: "☾", title: "哄睡模式", subtitle: "白噪音与轻声朗读", action: "open-sleep-mode" },
    { icon: "▧", title: "生成图片", subtitle: "向图片模型描述画面", action: "generate-image" },
    { icon: "▶", title: "生成视频", subtitle: "向视频模型描述镜头", action: "generate-video" },
    { icon: "☎", title: "语音通话", subtitle: "麦克风识别、角色语音回复", action: "start-voice-call" },
    { icon: "▣", title: "视频通话", subtitle: "摄像头预览与模型生成画面", action: "start-video-call" },
    { icon: "⌕", title: "搜索消息", subtitle: "本地全文检索", action: "search-chat" },
    { icon: "▦", title: "摘要与记忆", subtitle: "压缩旧对话", action: "manage-summary" },
    { icon: "⌘", title: "快捷回复管理", subtitle: "配置输入栏按钮", action: "manage-quick-replies" }
    ,{ icon: "✦", title: "这一刻值得记住", subtitle: "保存为纪念卡", action: "create-memory" }
  ]);
}

function openRenameChat() {
  closeSheet();
  openModal({
    title: "聊天标题",
    body: renderFormField("标题", "title", state.currentChat.title, { required: true, full: true }),
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async () => {
          state.currentChat.title = $('[name="title"]', $("#modal")).value.trim();
          await dbPut("chats", state.currentChat);
          renderScreen();
        }
      }
    ]
  });
}

function openSummaryManager() {
  const chat = state.currentChat;
  if (!chat) return;
  openModal({
    title: "聊天摘要",
    body: `
      ${renderFormField("摘要", "summary", chat.summary || "", { type: "textarea", tall: true, full: true, hint: "摘要会作为系统上下文发送，原文不会重复进入 token 预算。" })}
      <div class="field-hint">已覆盖到消息序号：${chat.summaryCoversUpTo || 0} / ${state.currentMessages.length}</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "generate", label: "AI 重建",
        handler: async (body) => {
          const button = $('[data-modal-action="generate"]', $("#modal"));
          setBusy(button, true, "生成中");
          try {
            await rebuildSummary();
            $('[name="summary"]', body).value = state.currentChat.summary;
            toast("摘要已更新");
          } catch (error) {
            toast(error.message, "error");
          } finally {
            setBusy(button, false);
          }
          return false;
        }
      },
      {
        id: "save", label: "保存", primary: true,
        handler: async (body) => {
          state.currentChat.summary = $('[name="summary"]', body).value;
          state.currentChat.summaryUpdatedAt = now();
          state.currentChat.summaryCoversUpTo = state.currentMessages.length;
          await dbPut("chats", state.currentChat);
        }
      }
    ]
  });
}

async function maybeAutoSummary() {
  if (!state.settings.autoSummary || state.currentMessages.length < 40) return;
  if (state.currentChat.summaryCoversUpTo >= state.currentMessages.length - 20) return;
  try {
    await rebuildSummary();
  } catch (error) {
    console.warn("自动摘要失败", error);
  }
}

async function rebuildSummary() {
  const chat = state.currentChat;
  if (!chat) return;
  const config = getDefaultApi("text");
  const end = Math.max(0, state.currentMessages.length - 12);
  const source = state.currentMessages.slice(0, end).map((message) => {
    const character = message.charId ? getById(state.characters, message.charId) : null;
    return `${message.role === "user" ? state.settings.userProfile?.name || "用户" : character?.name || "角色"}：${message.text}`;
  }).join("\n");
  if (!config || !source) {
    chat.summary = state.currentMessages.slice(0, end).map(messagePreview).join("\n").slice(0, 1600);
  } else {
    const result = await sendTextCompletion(config, [
      { role: "system", content: "把对话压缩成长期记忆摘要。保留关系变化、承诺、未完成话题、重要偏好和事实，不写评价。使用简洁中文。" },
      { role: "user", content: source }
    ], { sampling: { temperature: 0.3, max_tokens: 900 } });
    chat.summary = result.text.trim();
  }
  chat.summaryUpdatedAt = now();
  chat.summaryCoversUpTo = end;
  await dbPut("chats", chat);
}

function openChatSearch() {
  openModal({
    title: "搜索消息",
    body: `${renderFormField("关键词", "query", state.searchQuery, { full: true, placeholder: "输入后点击搜索" })}<div id="searchResults"></div>`,
    actions: [
      { id: "close", label: "关闭" },
      {
        id: "search", label: "搜索", primary: true,
        handler: async (body) => {
          state.searchQuery = $('[name="query"]', body).value.trim();
          const results = state.searchQuery
            ? state.currentMessages.filter((item) => String(item.text || "").toLowerCase().includes(state.searchQuery.toLowerCase()))
            : [];
          $("#searchResults").innerHTML = results.length
            ? results.map((message) => `<div class="search-result"><strong>${escapeHtml(message.role === "user" ? "你" : getById(state.characters, message.charId)?.name || "角色")} · ${formatTime(message.time)}</strong><p>${escapeHtml(message.text.slice(0, 180))}</p><button type="button" class="btn small" data-action="jump-message" data-message-id="${escapeAttr(message.id)}">定位</button></div>`).join("")
            : `<div class="entry-preview">没有找到匹配消息。</div>`;
          return false;
        }
      }
    ]
  });
}

function openChatExtra() {
  closeSheet();
  openModal({
    title: "当前聊天附加提示",
    body: renderFormField("系统提示附加内容", "extra", state.currentChat.systemPromptExtra || "", { type: "textarea", tall: true, full: true }),
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "save", label: "保存", primary: true,
        handler: async () => {
          state.currentChat.systemPromptExtra = $('[name="extra"]', $("#modal")).value;
          await dbPut("chats", state.currentChat);
        }
      }
    ]
  });
}

function openMediaGenerator(category) {
  const config = getDefaultApi(category);
  if (!config) {
    toast(`请先配置默认${category === "image" ? "图片" : "视频"}接口`, "error");
    return;
  }
  openModal({
    title: category === "image" ? "生成图片" : "生成视频",
    body: `
      ${renderFormField("画面描述", "prompt", "", { type: "textarea", tall: true, required: true, full: true })}
      ${renderFormField("发送身份", "sender", "user", { type: "select", options: [["user", "由我发送"], ["char", "由角色发送"]] })}
      ${renderFormField("参考图（可选）", "referenceFile", "", { type: "file", full: true, hint: "选择相册图片后，会按请求模板尽量作为参考图提交。" })}
      <div class="field-hint">当前接口：${escapeHtml(config.name)} · ${escapeHtml(config.model)}</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "generate", label: "生成", primary: true,
        handler: async (body) => {
          const prompt = $('[name="prompt"]', body).value.trim();
          if (!prompt) return false;
          const button = $('[data-modal-action="generate"]', $("#modal"));
          setBusy(button, true, "生成中");
          try {
            const referenceFile = $('[name="referenceFile"]', body).files?.[0];
            const referenceImage = referenceFile ? await imageFileToDataUrl(referenceFile, 1280, .86) : "";
            const mediaUrl = await sendMediaRequest(config, prompt, { referenceImage });
            const mediaMeta = await storeMessageMedia(state.currentChat.id, mediaUrl, {
              thumbnail: category === "image" ? mediaUrl : null,
              mime: category === "video" ? "video/mp4" : "image/png"
            });
            const sender = $('[name="sender"]', body).value;
            const message = defaultMessage(
              state.currentChat.id,
              sender === "char" ? "char" : "user",
              sender === "char" ? state.currentChat.members[0] || null : null,
              category,
              prompt,
              {
                ...mediaMeta
              }
            );
            state.currentMessages.push(message);
            await dbPut("messages", message);
            state.currentChat.lastActiveAt = now();
            await dbPut("chats", state.currentChat);
            renderScreen();
            toast(category === "image" ? "图片已生成" : "视频已生成");
          } catch (error) {
            toast(error.message, "error", 5200);
            return false;
          } finally {
            setBusy(button, false);
          }
        }
      }
    ]
  });
}

function openMessageMediaGenerator(messageId, category) {
  const sourceMessage = state.currentMessages.find((item) => item.id === messageId);
  if (!sourceMessage) return;
  const config = getDefaultApi(category);
  if (!config) {
    toast(`请先配置默认${category === "image" ? "图片" : "视频"}接口`, "error");
    return;
  }
  openModal({
    title: category === "image" ? "为这条消息生成配图" : "为这条消息生成短片",
    body: `
      ${renderFormField("画面描述", "prompt", sourceMessage.text || "", { type: "textarea", tall: true, required: true, full: true, hint: "可以继续补充镜头、构图、角色动作与氛围。" })}
      ${renderFormField("参考图（可选）", "referenceFile", "", { type: "file", full: true, hint: "从相册选择一张图片，例如用户本人、服装、场景或角色参考。" })}
      <div class="field-hint">由 ${escapeHtml(getById(state.characters, sourceMessage.charId)?.name || "角色")} 发送 · ${escapeHtml(config.model)}</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "generate", label: "生成并发送", primary: true,
        handler: async (body) => {
          const prompt = $('[name="prompt"]', body).value.trim();
          if (!prompt) return false;
          const button = $('[data-modal-action="generate"]', $("#modal"));
          setBusy(button, true, "生成中");
          try {
            const referenceFile = $('[name="referenceFile"]', body).files?.[0];
            const referenceImage = referenceFile ? await imageFileToDataUrl(referenceFile, 1280, .86) : "";
            const mediaUrl = await sendMediaRequest(config, prompt, { referenceImage });
            const mediaMeta = await storeMessageMedia(state.currentChat.id, mediaUrl, {
              thumbnail: category === "image" ? mediaUrl : referenceImage || null,
              mime: category === "video" ? "video/mp4" : "image/png"
            });
            const message = defaultMessage(
              state.currentChat.id,
              "char",
              sourceMessage.charId || state.currentChat.members[0] || null,
              category,
              prompt,
              { ...mediaMeta }
            );
            message.replyTo = sourceMessage.id;
            state.currentMessages.push(message);
            await dbPut("messages", message);
            state.currentChat.lastActiveAt = now();
            await dbPut("chats", state.currentChat);
            renderScreen();
            toast(category === "image" ? "配图已生成并发送" : "短片已生成并发送");
          } catch (error) {
            toast(error.message, "error", 5200);
            return false;
          } finally {
            setBusy(button, false);
          }
        }
      }
    ]
  });
}

async function sendMessageFromComposer() {
  const input = $("#chatInput");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  await sendUserMessage(text);
  await maybeAutoSummary();
}

function autoSizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(104, Math.max(38, textarea.scrollHeight))}px`;
}

async function toggleVoiceRecord() {
  if (state.mediaRecorder && state.mediaRecorder.state === "recording") {
    state.mediaRecorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    toast("当前浏览器不支持录音", "error");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    state.recordedChunks = [];
    state.recordingStartedAt = now();
    recorder.ondataavailable = (event) => {
      if (event.data.size) state.recordedChunks.push(event.data);
    };
    recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(state.recordedChunks, { type: recorder.mimeType || "audio/webm" });
      const url = await blobToDataUrl(blob);
      const duration = (now() - state.recordingStartedAt) / 1000;
      const mediaMeta = await storeMessageMedia(state.currentChat.id, url, {
        mime: recorder.mimeType || "audio/webm"
      });
      await sendUserMessage("", "voice", {
        ...mediaMeta,
        duration,
        waveform: Array.from({ length: 28 }, () => 4 + Math.random() * 20)
      });
      state.mediaRecorder = null;
      toast("语音已发送");
    };
    state.mediaRecorder = recorder;
    recorder.start();
    toast("正在录音，再次点击结束");
  } catch (error) {
    toast(`无法开始录音：${error.message}`, "error");
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function playVoiceMessage(messageId) {
  const message = state.currentMessages.find((item) => item.id === messageId);
  const media = message?.meta.mediaId ? await getCachedMedia(message.meta.mediaId) : null;
  const source = message?.meta.audioUrl || media?.data;
  if (!source) {
    speakMessage(messageId);
    return;
  }
  new Audio(source).play().catch((error) => toast(`播放失败：${error.message}`, "error"));
}

function speakMessage(messageId) {
  const message = state.currentMessages.find((item) => item.id === messageId);
  const character = getById(state.characters, message?.charId);
  if (!message || !("speechSynthesis" in window)) {
    toast("当前浏览器不支持语音朗读", "error");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message.text);
  const voices = speechSynthesis.getVoices();
  if (character?.voice?.ttsVoiceId) {
    const voice = voices.find((item) => item.voiceURI === character.voice.ttsVoiceId || item.name === character.voice.ttsVoiceId);
    if (voice) utterance.voice = voice;
  }
  utterance.rate = character?.voice?.ttsSpeed || 1;
  utterance.pitch = character?.voice?.ttsPitch || 1;
  utterance.lang = "zh-CN";
  speechSynthesis.speak(utterance);
}

async function deleteCurrentChat() {
  const chat = state.currentChat;
  const messages = await dbGetByIndex("messages", "chatId", chat.id);
  for (const message of messages) {
    await deleteMessageMedia(message);
    await dbDelete("messages", message.id);
  }
  await dbDelete("chats", chat.id);
  state.currentChat = null;
  state.currentMessages = [];
  state.currentChatId = null;
  await refreshAll();
  navigate("messages");
}

/* ---------- 语音通话与视频通话 ---------- */

async function startCall(type) {
  assert(state.currentChat, "请先打开聊天");
  const character = getById(state.characters, state.currentChat.members[0]);
  assert(character, "当前聊天没有可用角色");
  assert(navigator.mediaDevices?.getUserMedia, "当前浏览器不支持摄像头或麦克风");
  if (state.call.type) await endCall(false);
  try {
    const constraints = type === "video"
      ? { audio: true, video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } }
      : { audio: true, video: false };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.call = {
      type,
      chatId: state.currentChat.id,
      startedAt: now(),
      stream,
      recognition: null,
      muted: false,
      cameraEnabled: type === "video",
      interimText: "",
      sceneUrl: null,
      sceneType: type === "video" ? "video" : "image",
      busy: false,
      timerId: null
    };
    renderCallOverlay();
    $("#callOverlay").classList.remove("hidden");
    attachCallStream();
    startCallRecognition();
    state.call.timerId = setInterval(updateCallTimer, 1000);
    updateCallTimer();
  } catch (error) {
    toast(`无法开始通话：${error.message}`, "error", 5200);
  }
}

function getCallCharacter() {
  const chat = state.currentChat || state.chats.find((item) => item.id === state.call.chatId);
  return getById(state.characters, chat?.members?.[0]);
}

function renderCallOverlay() {
  const overlay = $("#callOverlay");
  const character = getCallCharacter();
  if (!overlay || !character) return;
  const isVideo = state.call.type === "video";
  const media = state.call.sceneUrl || character.avatar;
  const mediaType = state.call.sceneUrl ? state.call.sceneType : character.avatarType;
  const characterStage = mediaType === "video" && media
    ? `<video id="callCharacterVideo" src="${escapeAttr(media)}" ${character.avatarPoster && !state.call.sceneUrl ? `poster="${escapeAttr(character.avatarPoster)}"` : ""} autoplay muted loop playsinline></video>`
    : mediaType === "image" && media
      ? `<img src="${escapeAttr(media)}" alt="${escapeAttr(character.name)}">`
      : `<div class="call-avatar-fallback">${escapeHtml(character.avatar || initials(character.name))}</div>`;
  overlay.dataset.callType = state.call.type;
  overlay.innerHTML = `
    <div class="call-stage">
      <div class="call-character-media">${characterStage}</div>
    </div>
    <div class="call-top">
      <div class="call-person">
        <strong>${escapeHtml(character.name)}</strong>
        <span>${isVideo ? "视频通话" : "语音通话"} · ${state.call.busy ? "正在回应" : "已接通"}</span>
      </div>
      <span id="callTimer" class="call-status-pill">00:00</span>
    </div>
    ${isVideo ? `<div class="call-user-video"><video id="callUserVideo" autoplay muted playsinline></video></div>` : ""}
    <div id="callSubtitle" class="call-subtitle">正在聆听…</div>
    <form class="call-text-form" data-call-text-form>
      <input name="callText" placeholder="${isVideo ? "输入台词或生成画面描述" : "无法语音识别时，可在这里输入"}">
      <button type="submit" title="发送">➤</button>
    </form>
    <div class="call-controls">
      <button class="call-control ${state.call.muted ? "active" : ""}" data-action="toggle-call-mute" title="静音">${state.call.muted ? "×" : "◉"}</button>
      ${isVideo ? `<button class="call-control ${state.call.cameraEnabled ? "active" : ""}" data-action="toggle-call-camera" title="摄像头">▣</button>` : ""}
      <button class="call-control generate" data-action="generate-call-scene" title="生成一幕">✦</button>
      <button class="call-control end" data-action="end-call" title="挂断">✕</button>
    </div>
  `;
  attachCallStream();
}

function attachCallStream() {
  const video = $("#callUserVideo");
  if (video && state.call.stream) {
    video.srcObject = state.call.stream;
    video.play().catch(() => {});
  }
}

function startCallRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    const subtitle = $("#callSubtitle");
    if (subtitle) subtitle.textContent = "当前浏览器不支持语音识别，请使用下方输入框继续通话。";
    return;
  }
  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    let interim = "";
    let finalText = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const text = event.results[index][0].transcript;
      if (event.results[index].isFinal) finalText += text;
      else interim += text;
    }
    const subtitle = $("#callSubtitle");
    if (subtitle) subtitle.textContent = finalText || interim || "正在聆听…";
    if (finalText.trim()) handleCallSpeech(finalText.trim());
  };
  recognition.onerror = (event) => {
    const subtitle = $("#callSubtitle");
    if (subtitle && event.error !== "no-speech") subtitle.textContent = `语音识别暂不可用：${event.error}`;
  };
  recognition.onend = () => {
    if (state.call.type && state.call.recognition === recognition) {
      setTimeout(() => {
        if (state.call.recognition === recognition && state.call.type) {
          try {
            recognition.start();
          } catch {}
        }
      }, 300);
    }
  };
  state.call.recognition = recognition;
  try {
    recognition.start();
  } catch {}
}

async function handleCallSpeech(text) {
  if (!text || state.call.busy || !state.currentChat) return;
  const character = getCallCharacter();
  if (!character) return;
  state.call.busy = true;
  renderCallOverlay();
  const userMessage = defaultMessage(state.currentChat.id, "user", null, "text", text);
  state.currentMessages.push(userMessage);
  await dbPut("messages", userMessage);
  state.currentChat.lastActiveAt = now();
  await dbPut("chats", state.currentChat);
  const reply = await generateCharacterReply(state.currentChat, character, { userInput: text });
  if (reply) {
    speakText(reply.text, character);
    const subtitle = $("#callSubtitle");
    if (subtitle) subtitle.textContent = reply.text;
  }
  state.call.busy = false;
  if (state.call.type) renderCallOverlay();
}

function speakText(text, character) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  if (character?.voice?.ttsVoiceId) {
    const voice = voices.find((item) => item.voiceURI === character.voice.ttsVoiceId || item.name === character.voice.ttsVoiceId);
    if (voice) utterance.voice = voice;
  }
  utterance.rate = character?.voice?.ttsSpeed || 1;
  utterance.pitch = character?.voice?.ttsPitch || 1;
  utterance.lang = "zh-CN";
  speechSynthesis.speak(utterance);
}

async function handleCallTextSubmit(form) {
  const input = $('[name="callText"]', form);
  const text = input?.value.trim();
  if (!text) return;
  input.value = "";
  if (state.call.type === "video" && /生成|画面|镜头|拍|视频|看看/.test(text)) {
    await generateCallScene(text);
  } else {
    await handleCallSpeech(text);
  }
}

async function generateCallScene(promptOverride = "") {
  if (!state.currentChat || state.call.busy) return;
  const character = getCallCharacter();
  const config = getDefaultApi("video") || getDefaultApi("image");
  if (!config) {
    toast("请先配置默认视频或图片接口", "error");
    return;
  }
  const input = $('[name="callText"]');
  const subtitle = $("#callSubtitle");
  const prompt = promptOverride || input?.value.trim() || subtitle?.textContent || "";
  if (!prompt || prompt === "正在聆听…") {
    toast("先输入想生成的画面或说一句话", "error");
    return;
  }
  if (input) input.value = "";
  state.call.busy = true;
  if (subtitle) subtitle.textContent = "正在生成通话画面…";
  try {
    const userVideo = $("#callUserVideo");
    const referenceImage = captureVideoFrame(userVideo, 1280, .82) || character.avatarReference || "";
    const sceneUrl = await sendMediaRequest(config, [
      `生成视频通话中的一幕。角色：${character.name}。`,
      `场景与动作：${prompt}`,
      referenceImage ? "保持参考图中的用户外貌、服装或环境特征。" : ""
    ].filter(Boolean).join("\n"), { referenceImage });
    state.call.sceneUrl = sceneUrl;
    state.call.sceneType = config.category === "video" ? "video" : "image";
    renderCallOverlay();
    const nextSubtitle = $("#callSubtitle");
    if (nextSubtitle) nextSubtitle.textContent = "通话画面已更新。";
  } catch (error) {
    toast(error.message, "error", 5200);
    if (subtitle) subtitle.textContent = error.message;
  } finally {
    state.call.busy = false;
    if (state.call.type) renderCallOverlay();
  }
}

function toggleCallMute() {
  state.call.muted = !state.call.muted;
  state.call.stream?.getAudioTracks().forEach((track) => { track.enabled = !state.call.muted; });
  if (state.call.recognition) {
    if (state.call.muted) state.call.recognition.stop();
    else {
      try { state.call.recognition.start(); } catch {}
    }
  }
  renderCallOverlay();
}

function toggleCallCamera() {
  state.call.cameraEnabled = !state.call.cameraEnabled;
  state.call.stream?.getVideoTracks().forEach((track) => { track.enabled = state.call.cameraEnabled; });
  renderCallOverlay();
}

function updateCallTimer() {
  const node = $("#callTimer");
  if (!node || !state.call.startedAt) return;
  node.textContent = formatDuration((now() - state.call.startedAt) / 1000);
}

async function endCall(renderMessage = true) {
  const duration = state.call.startedAt ? Math.round((now() - state.call.startedAt) / 1000) : 0;
  const type = state.call.type;
  if (state.call.timerId) clearInterval(state.call.timerId);
  if (state.call.recognition) {
    const recognition = state.call.recognition;
    state.call.recognition = null;
    try { recognition.stop(); } catch {}
  }
  state.call.stream?.getTracks().forEach((track) => track.stop());
  window.speechSynthesis?.cancel();
  $("#callOverlay").classList.add("hidden");
  $("#callOverlay").innerHTML = "";
  state.call = {
    type: null, chatId: null, startedAt: 0, stream: null, recognition: null,
    muted: false, cameraEnabled: true, interimText: "", sceneUrl: null,
    sceneType: "image", busy: false, timerId: null
  };
  if (renderMessage && state.currentChat && duration >= 3 && type) {
    const message = defaultMessage(
      state.currentChat.id,
      "system",
      null,
      "system",
      `${type === "video" ? "视频" : "语音"}通话结束 · ${formatDuration(duration)}`
    );
    state.currentMessages.push(message);
    await dbPut("messages", message);
    await dbPut("chats", state.currentChat);
    renderScreen();
  }
}

/* ---------- 哄睡模式 ---------- */

function openSleepMode() {
  const character = state.currentChat ? getById(state.characters, state.currentChat.members[0]) : null;
  const defaultText = character
    ? `放松下来，我就在这里陪着你。今天已经结束了，不需要再想那些还没有解决的事情。慢慢呼吸，闭上眼睛，晚安。`
    : "慢慢呼吸，放松身体，闭上眼睛。";
  openModal({
    title: "哄睡模式",
    body: `
      ${renderFormField("白噪音", "noise", "rain", { type: "select", options: [["rain", "雨声"], ["fireplace", "壁炉"], ["ocean", "海浪"]] })}
      ${renderFormField("朗读文字", "text", defaultText, { type: "textarea", tall: true, full: true })}
      <div class="field-hint">使用 Web Audio 生成环境声，并用系统 TTS 轻声朗读。页面会逐渐变暗，最长播放 30 分钟。</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "start", label: "开始哄睡", primary: true,
        handler: async (body) => {
          const text = $('[name="text"]', body).value.trim();
          const noise = $('[name="noise"]', body).value;
          await startSleepMode(text, noise, character);
        }
      }
    ]
  });
}

async function startSleepMode(text, noiseType, character) {
  stopSleepMode(false);
  const context = new (window.AudioContext || window.webkitAudioContext)();
  await context.resume();
  const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
  const channel = buffer.getChannelData(0);
  let fireplaceEnvelope = 0;
  for (let index = 0; index < channel.length; index += 1) {
    const white = Math.random() * 2 - 1;
    if (noiseType === "fireplace") {
      fireplaceEnvelope = Math.max(0, fireplaceEnvelope - .0004) + (Math.random() < .00012 ? .9 : 0);
      channel[index] = white * (.08 + fireplaceEnvelope * .65);
    } else if (noiseType === "ocean") {
      channel[index] = white * (.15 + .1 * Math.sin(index / context.sampleRate * Math.PI * .18));
    } else {
      channel[index] = white * .22;
    }
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = noiseType === "rain" ? "highpass" : "lowpass";
  filter.frequency.value = noiseType === "rain" ? 900 : noiseType === "ocean" ? 520 : 780;
  const gain = context.createGain();
  gain.gain.value = noiseType === "rain" ? .2 : .16;
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
  state.sleep = {
    active: true,
    audioContext: context,
    source,
    gain,
    nodes: [filter],
    stopTimer: setTimeout(() => stopSleepMode(true), 30 * 60_000),
    dimTimer: setTimeout(() => $("#sleepOverlay")?.classList.add("dim"), 15_000)
  };
  const overlay = $("#sleepOverlay");
  overlay.innerHTML = `
    <div class="sleep-orb"></div>
    <strong>${escapeHtml(character?.name || "PocketLink")} 正在陪你入睡</strong>
    <p>${escapeHtml(noiseType === "rain" ? "雨声" : noiseType === "ocean" ? "海浪" : "壁炉声")} · 屏幕会逐渐变暗</p>
    <button class="sleep-stop" data-action="stop-sleep">停止</button>
  `;
  overlay.classList.remove("hidden");
  if ("speechSynthesis" in window && text) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (character?.voice?.ttsVoiceId) {
      const voice = speechSynthesis.getVoices().find((item) => item.voiceURI === character.voice.ttsVoiceId || item.name === character.voice.ttsVoiceId);
      if (voice) utterance.voice = voice;
    }
    utterance.rate = Math.min(.9, character?.voice?.ttsSpeed || .9);
    utterance.pitch = character?.voice?.ttsPitch || 1;
    utterance.lang = "zh-CN";
    speechSynthesis.speak(utterance);
  }
}

function stopSleepMode(showToast = true) {
  if (state.sleep.stopTimer) clearTimeout(state.sleep.stopTimer);
  if (state.sleep.dimTimer) clearTimeout(state.sleep.dimTimer);
  try { state.sleep.source?.stop(); } catch {}
  try { state.sleep.audioContext?.close(); } catch {}
  window.speechSynthesis?.cancel();
  $("#sleepOverlay").classList.add("hidden");
  $("#sleepOverlay").innerHTML = "";
  state.sleep = { active: false, audioContext: null, source: null, gain: null, nodes: [], stopTimer: null, dimTimer: null };
  if (showToast) toast("哄睡模式已停止");
}

/* ---------- 互动问答 ---------- */

function openInteractionMenu() {
  openSheet("互动问答", [
    { icon: "?", title: "真心话", subtitle: "角色向你提出一个只属于你们的问题", action: "start-interaction", id: "truth" },
    { icon: "½", title: "五五开", subtitle: "两个选项，角色根据你的选择回应", action: "start-interaction", id: "choice" },
    { icon: "⌘", title: "记忆考验", subtitle: "角色问你一个关于过往对话的问题", action: "start-interaction", id: "memory" }
  ]);
}

async function startInteractionGame(type) {
  closeSheet();
  const character = state.currentChat ? getById(state.characters, state.currentChat.members[0]) : null;
  assert(character, "当前聊天没有角色");
  const instructions = {
    truth: "进行一轮“真心话”。向用户提出一个符合你们关系和角色性格的问题。问题应当具体、有情绪重量，不要列一堆问题。",
    choice: "进行一轮“五五开”。给出两个互斥且都有吸引力的选择，让用户选择。先描述两个选项，再让用户回答。",
    memory: "进行一轮“记忆考验”。从已有摘要、记忆或最近对话中选一件具体的事，问用户是否还记得。不要编造没有依据的回忆。"
  };
  const message = await generateCharacterReply(state.currentChat, character, {
    interactionPrompt: instructions[type] || instructions.truth
  });
  if (!message) toast("互动问题生成失败", "error");
}

/* ---------- 表情、位置与本地红包 ---------- */

function openEmojiPicker() {
  openSheet("发送表情", [
    { icon: "😊", title: "微笑", action: "send-special-emoji", id: "😊" },
    { icon: "🥺", title: "撒娇", action: "send-special-emoji", id: "🥺" },
    { icon: "😭", title: "委屈", action: "send-special-emoji", id: "😭" },
    { icon: "😳", title: "害羞", action: "send-special-emoji", id: "😳" },
    { icon: "😤", title: "生气", action: "send-special-emoji", id: "😤" },
    { icon: "🥰", title: "喜欢", action: "send-special-emoji", id: "🥰" },
    { icon: "🫠", title: "无奈", action: "send-special-emoji", id: "🫠" },
    { icon: "🌙", title: "晚安", action: "send-special-emoji", id: "🌙" }
  ]);
}

async function sendSpecialMessage(type, payload, sender = "user") {
  const chat = state.currentChat;
  assert(chat, "请先打开聊天");
  const characterId = sender === "char" ? chat.members[0] || null : null;
  const message = defaultMessage(chat.id, sender === "char" ? "char" : "user", characterId, type, payload.text || "", payload.meta || {});
  state.currentMessages.push(message);
  await dbPut("messages", message);
  chat.updatedAt = now();
  chat.lastActiveAt = now();
  await dbPut("chats", chat);
  state.lastMessages.set(chat.id, message);
  renderScreen();
  if (type !== "transfer" && sender === "user") {
    const character = getById(state.characters, chat.members[0]);
    if (character) await generateCharacterReply(chat, character, { userInput: message.text });
  }
  return message;
}

function openLocationComposer() {
  const health = state.settings.health || {};
  openModal({
    title: "分享位置",
    body: `
      ${renderFormField("地点名称", "label", health.location || "", { required: true, full: true, placeholder: "例如：上海 · 静安区" })}
      ${renderFormField("地点说明", "detail", "", { full: true, placeholder: "例如：刚从地铁站出来" })}
      ${renderFormField("发送身份", "sender", "user", { type: "select", options: [["user", "由我发送"], ["char", "由角色发送"]] })}
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "send", label: "发送", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          const label = $('[name="label"]', form).value.trim();
          if (!label) return false;
          await sendSpecialMessage("location", {
            text: label,
            meta: { location: { label, detail: $('[name="detail"]', form).value.trim() } }
          }, $('[name="sender"]', form).value);
        }
      }
    ]
  });
}

function openTransferComposer() {
  openModal({
    title: "发红包",
    body: `
      <div class="metric"><strong>${formatMoney(state.settings.walletBalanceFen || 0)}</strong><span>本地娱乐钱包余额</span></div>
      ${renderFormField("金额（元）", "amount", "8.88", { type: "number", step: "0.01", min: "0.01", required: true })}
      ${renderFormField("祝福语", "title", "给你一个小红包", { full: true })}
      ${renderFormField("发送身份", "sender", "user", { type: "select", options: [["user", "由我发送"], ["char", "由角色发送"]] })}
      <div class="field-hint">金额以“分”为整数存储，不接入真实支付。</div>
    `,
    actions: [
      { id: "cancel", label: "取消" },
      {
        id: "send", label: "发送", primary: true,
        handler: async (body) => {
          const form = $("form", body);
          const amountFen = Math.round(toNumber($('[name="amount"]', form).value, 0) * 100);
          const sender = $('[name="sender"]', form).value;
          if (amountFen <= 0) return false;
          if (sender === "user" && amountFen > (state.settings.walletBalanceFen || 0)) {
            toast("本地钱包余额不足", "error");
            return false;
          }
          if (sender === "user") {
            state.settings.walletBalanceFen -= amountFen;
            await saveSettings();
          }
          await sendSpecialMessage("transfer", {
            text: $('[name="title"]', form).value.trim(),
            meta: {
              amountFen,
              title: $('[name="title"]', form).value.trim() || "红包",
              status: "pending"
            }
          }, sender);
        }
      }
    ]
  });
}

function openWallet() {
  openModal({
    title: "娱乐钱包",
    body: `
      <div class="metric"><strong>${formatMoney(state.settings.walletBalanceFen || 0)}</strong><span>仅用于本地角色互动，不连接真实支付</span></div>
      ${renderFormField("增加余额（元）", "amount", "10", { type: "number", min: "0.01", step: "0.01" })}
      <div class="field-hint">这是应用内娱乐数值，不会产生真实资金流动。</div>
    `,
    actions: [
      { id: "cancel", label: "关闭" },
      {
        id: "add", label: "增加", primary: true,
        handler: async (body) => {
          const fen = Math.round(toNumber($('[name="amount"]', body).value, 0) * 100);
          if (fen > 0) state.settings.walletBalanceFen += fen;
          await saveSettings();
          toast("娱乐余额已更新");
        }
      }
    ]
  });
}

/* ============================================================
 * 全局事件
 * ============================================================ */

async function handleDocumentClick(event) {
  const target = event.target.closest("[data-action], [data-route]");
  if (!target) {
    if (event.target.id === "sheet") closeSheet();
    if (event.target.id === "modal") closeModal();
    return;
  }
  const action = target.dataset.action;
  const route = target.dataset.route;
  const id = target.dataset.id;
  try {
    if (route) {
      navigate(route);
      return;
    }
    if (!action) return;

    if (action === "close-modal") closeModal();
    else if (action === "modal-action") {
      const handler = state.modalHandlers[target.dataset.modalAction];
      if (handler) {
        const result = await handler($(".modal-body"));
        if (result !== false) closeModal();
      } else {
        closeModal();
      }
    }
    else if (action === "open-create-sheet") openCreateSheet();
    else if (action === "open-notifications") openNotifications();
    else if (action === "open-settings") openSettings();
    else if (action === "open-api-manager") openApiManager("text");
    else if (action === "lock-app") lockApp();
    else if (action === "unlock-app") unlockApp();
    else if (action === "select-theme") selectTheme(target.dataset.themeId);
    else if (action === "open-theme-manager") openThemeManager();
    else if (action === "profile-tab") { state.profileTab = target.dataset.tab; renderScreen(); }
    else if (action === "open-content-manager") openContentManager(target.dataset.tab || "characters");
    else if (action === "content-tab") {
      state.contentTab = target.dataset.tab || "characters";
      const managerList = $("#contentManagerList");
      if (managerList) managerList.innerHTML = renderContentManagerList();
      $$("[data-action=content-tab]", $("#modal")).forEach((button) => button.classList.toggle("active", button.dataset.tab === state.contentTab));
    }
    else if (action === "open-api-manager-category") openApiManager(target.dataset.category || "text");
    else if (action === "import-file") pickFile(target.dataset.importKind || "auto", target.dataset.importKind === "character" ? ".json,.png,application/json,image/png" : ".json,application/json");
    else if (action === "import-character-json") pickFile("character", ".json,application/json");
    else if (action === "import-character-png") pickFile("character-png", ".png,image/png,image/*");
    else if (action === "create-character") { closeSheet(); openCharacterForm(); }
    else if (action === "create-character-from-text") { closeSheet(); openCharacterFromText(); }
    else if (action === "new-chat-existing") { closeSheet(); openNewChatPicker(); }
    else if (action === "create-group") { closeSheet(); openGroupPicker(); }
    else if (action === "create-moment") { closeSheet(); openCreateMoment(); }
    else if (action === "open-moments") openMoments();
    else if (action === "open-wallet") openWallet();
    else if (action === "create-date") openCreateDate();
    else if (action === "edit-health") openHealthEditor();
    else if (action === "import-health") pickFile("health", ".json,application/json");
    else if (action === "clear-health") {
      if (await confirmDialog("清空体征？", "原始读数和感知缓存会被删除。")) {
        state.settings.health = clone(DEFAULT_SETTINGS.health);
        updateHealthPerceptions();
        await saveSettings();
        renderScreen();
      }
    }
    else if (action === "open-schedules") openSchedules();
    else if (action === "add-schedule") {
      const list = $("#scheduleList");
      if (list) list.innerHTML += `<div class="prompt-item" data-schedule data-id="${uid()}"><span class="drag-handle">◷</span><div><div class="form-grid"><div class="field"><label>名称</label><input name="scheduleTitle"></div><div class="field"><label>时间</label><input type="datetime-local" name="scheduleTime"></div><div class="field full"><label>备注</label><input name="scheduleNote"></div></div></div><button type="button" class="icon-btn danger" data-action="remove-schedule">×</button></div>`;
    }
    else if (action === "remove-schedule") target.closest("[data-schedule]")?.remove();
    else if (action === "open-notification-chat") {
      const chat = state.chats.find((item) => item.id === target.dataset.chatId);
      if (chat) {
        chat.unread = 0;
        await dbPut("chats", chat);
      }
      closeModal();
      await openChat(target.dataset.chatId);
    }
    else if (action === "open-chat") await openChat(target.dataset.chatId);
    else if (action === "start-chat-with") {
      const character = getById(state.characters, id);
      if (!character) return;
      closeModal();
      await createSingleChat(character.id);
    }
    else if (action === "edit-character") openCharacterForm(id);
    else if (action === "delete-character") {
      const character = getById(state.characters, id);
      if (character && await confirmDialog(`删除 ${character.name}？`, "角色会被删除，已有聊天窗口仍保留，但可能出现缺失成员。")) {
        await dbDelete("characters", id);
        await refreshAll();
        renderScreen();
      }
    }
    else if (action === "export-character") {
      const character = getById(state.characters, id);
      if (character) downloadJson(`${safeFilename(character.name || "character")}.json`, character.raw || character);
    }
    else if (action === "back-from-chat") navigate(state.returnRoute || "messages");
    else if (action === "send-message") await sendMessageFromComposer();
    else if (action === "chat-more") openChatMore();
    else if (action === "toggle-voice-record") await toggleVoiceRecord();
    else if (action === "reply-message") {
      state.replyTo = state.currentMessages.find((item) => item.id === target.dataset.messageId) || null;
      renderScreen();
    }
    else if (action === "cancel-reply") { state.replyTo = null; renderScreen(); }
    else if (action === "copy-message") {
      const message = state.currentMessages.find((item) => item.id === target.dataset.messageId);
      if (message) {
        await navigator.clipboard.writeText(message.text || "");
        toast("已复制");
      }
    }
    else if (action === "edit-message") await editMessage(target.dataset.messageId);
    else if (action === "delete-message") await deleteMessage(target.dataset.messageId);
    else if (action === "regenerate-message") await regenerateMessage(target.dataset.messageId);
    else if (action === "speak-message") speakMessage(target.dataset.messageId);
    else if (action === "play-voice") playVoiceMessage(target.dataset.messageId);
    else if (action === "jump-message") {
      closeModal();
      const node = document.querySelector(`[data-message-id="${CSS.escape(target.dataset.messageId)}"]`);
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    else if (action === "chat-menu") openChatMenu();
    else if (action === "rename-chat") openRenameChat();
    else if (action === "toggle-pin-chat") { state.currentChat.pinned = !state.currentChat.pinned; await dbPut("chats", state.currentChat); closeSheet(); renderScreen(); }
    else if (action === "toggle-mute-chat") { state.currentChat.muted = !state.currentChat.muted; await dbPut("chats", state.currentChat); closeSheet(); renderScreen(); }
    else if (action === "delete-chat") {
      closeSheet();
      if (await confirmDialog("删除聊天？", "消息会从本机删除，角色本身会保留。")) await deleteCurrentChat();
    }
    else if (action === "manage-summary") { closeSheet(); openSummaryManager(); }
    else if (action === "search-chat") { closeSheet(); openChatSearch(); }
    else if (action === "generate-image") { closeSheet(); openMediaGenerator("image"); }
    else if (action === "generate-video") { closeSheet(); openMediaGenerator("video"); }
    else if (action === "generate-message-image") openMessageMediaGenerator(target.dataset.messageId, "image");
    else if (action === "generate-message-video") openMessageMediaGenerator(target.dataset.messageId, "video");
    else if (action === "character-emoji") {
      const message = state.currentMessages.find((item) => item.id === target.dataset.messageId);
      const text = message?.text || "";
      const emoji = /晚安|睡/.test(text) ? "🌙" : /生气|讨厌/.test(text) ? "😤" : /抱|喜欢|爱/.test(text) ? "🥰" : /委屈|难过|哭/.test(text) ? "🥺" : "😊";
      await sendSpecialMessage("emoji", { text: emoji }, "char");
    }
    else if (action === "send-photo") { closeSheet(); pickFile("chat-image", "image/*"); }
    else if (action === "send-video") { closeSheet(); pickFile("chat-video", "video/*"); }
    else if (action === "send-special-emoji") { closeSheet(); await sendSpecialMessage("emoji", { text: id }, "user"); }
    else if (action === "send-emoji") { closeSheet(); openEmojiPicker(); }
    else if (action === "send-location") { closeSheet(); openLocationComposer(); }
    else if (action === "send-transfer") { closeSheet(); openTransferComposer(); }
    else if (action === "open-interactions") { closeSheet(); openInteractionMenu(); }
    else if (action === "start-interaction") { await startInteractionGame(id); }
    else if (action === "open-sleep-mode") { closeSheet(); openSleepMode(); }
    else if (action === "stop-sleep") stopSleepMode();
    else if (action === "create-memory") { closeSheet(); await createMemoryFromCurrentChat(); }
    else if (action === "delete-memory-card") {
      if (await confirmDialog("删除纪念卡？", "只删除这张纪念卡，不影响聊天记录。")) {
        state.settings.memoryCards = state.settings.memoryCards.filter((item) => item.id !== id);
        await saveSettings();
        renderScreen();
      }
    }
    else if (action === "generate-character-moment") {
      const character = state.currentChat
        ? getById(state.characters, state.currentChat.members[0])
        : state.characters[0];
      if (!character) return;
      const chat = state.currentChat || sortByTimeDesc(state.chats.filter((item) => item.members.includes(character.id)))[0] || { id: null, members: [character.id] };
      const messages = chat.id ? await dbGetByIndex("messages", "chatId", chat.id) : [];
      try {
        await generateCharacterMoment(character, chat, messages.sort((a, b) => a.time - b.time));
        closeModal();
        toast("角色动态已生成");
      } catch (error) {
        toast(error.message, "error");
      }
    }
    else if (action === "accept-transfer") {
      const message = state.currentMessages.find((item) => item.id === target.dataset.messageId);
      if (message) {
        message.meta.status = "accepted";
        if (message.role === "char") {
          state.settings.walletBalanceFen = (state.settings.walletBalanceFen || 0) + toNumber(message.meta.amountFen, 0);
          await saveSettings();
        }
        await dbPut("messages", message);
        renderScreen();
        toast("红包已领取");
      }
    }
    else if (action === "start-voice-call") { closeSheet(); await startCall("voice"); }
    else if (action === "start-video-call") { closeSheet(); await startCall("video"); }
    else if (action === "end-call") await endCall();
    else if (action === "toggle-call-mute") toggleCallMute();
    else if (action === "toggle-call-camera") toggleCallCamera();
    else if (action === "generate-call-scene") await generateCallScene();
    else if (action === "generate-avatar-image") await generateAvatarFromForm("image", target);
    else if (action === "generate-avatar-video") await generateAvatarFromForm("video", target);
    else if (action === "clear-avatar-media") {
      const form = target.closest("form");
      const preview = $("#avatarPreview");
      if (form) {
        $('[name="avatarGenerated"]', form).value = "";
        $('[name="avatarGeneratedType"]', form).value = "";
        $('[name="avatarGeneratedPoster"]', form).value = "";
        const fileInput = $('[name="avatarFile"]', form);
        if (fileInput) fileInput.value = "";
        const name = $('[name="name"]', form)?.value.trim() || "角色";
        if (preview) preview.textContent = initials(name);
      }
    }
    else if (action === "edit-chat-extra") openChatExtra();
    else if (action === "use-quick-reply") {
      const group = getById(state.quickReplies, target.dataset.qrGroup);
      const item = group?.qrList.find((qr) => String(qr.id) === target.dataset.qrId);
      const input = $("#chatInput");
      if (item && input) {
        if (item.preventAutoExecute) {
          input.value = item.message;
          autoSizeTextarea(input);
          input.focus();
        } else {
          await sendUserMessage(item.message);
        }
      }
    }
    else if (action === "manage-quick-replies") openContentManager("quick");
    else if (action === "create-worldbook") openWorldbookForm();
    else if (action === "manage-worldbook") openWorldbookForm(id);
    else if (action === "test-worldbook") openWorldbookTest(id);
    else if (action === "add-world-entry") {
      const list = $("#worldEntryList");
      if (list) {
        if ($(".entry-preview", list)) list.innerHTML = "";
        list.insertAdjacentHTML("beforeend", renderWorldEntryEditor(defaultWorldbookEntry()));
      }
    }
    else if (action === "remove-world-entry") target.closest("[data-world-entry]")?.remove();
    else if (action === "export-worldbook") {
      const worldbook = getById(state.worldbooks, id);
      if (worldbook) downloadJson(`${safeFilename(worldbook.name)}.json`, worldbook.raw || worldbook);
    }
    else if (action === "delete-worldbook") {
      if (await confirmDialog("删除世界书？", "已绑定它的角色会自动失去这份资料。")) {
        await dbDelete("worldbooks", id);
        for (const character of state.characters) {
          if (character.boundWorldbooks.includes(id)) {
            character.boundWorldbooks = character.boundWorldbooks.filter((bookId) => bookId !== id);
            await dbPut("characters", character);
          }
        }
        await refreshAll();
        renderScreen();
      }
    }
    else if (action === "create-preset") openPresetForm();
    else if (action === "manage-preset") openPresetForm(id);
    else if (action === "set-default-preset") { state.settings.defaultPresetId = id; await saveSettings(); renderScreen(); toast("已设为默认预设"); }
    else if (action === "delete-preset") {
      if (await confirmDialog("删除预设？", "角色如果绑定了它，将回退到全局默认预设。")) {
        await dbDelete("presets", id);
        await refreshAll();
        renderScreen();
      }
    }
    else if (action === "export-preset") {
      const preset = getById(state.presets, id);
      if (preset) downloadJson(`${safeFilename(preset.name)}.json`, preset.raw || preset);
    }
    else if (action === "add-preset-prompt") {
      const list = $("#presetPromptList");
      if (list) list.insertAdjacentHTML("beforeend", renderPresetPrompt(defaultPreset().prompts[0]));
    }
    else if (action === "remove-preset-prompt") target.closest("[data-preset-prompt]")?.remove();
    else if (action === "create-regex") openRegexForm();
    else if (action === "edit-regex") openRegexForm(id);
    else if (action === "toggle-regex") {
      const script = getById(state.regexScripts, id);
      if (script) {
        script.disabled = !script.disabled;
        script.updatedAt = now();
        await dbPut("regexScripts", script);
        await refreshAll();
        renderScreen();
      }
    }
    else if (action === "delete-regex") {
      if (await confirmDialog("删除正则脚本？", "此操作无法撤销。")) {
        await dbDelete("regexScripts", id);
        await refreshAll();
        renderScreen();
      }
    }
    else if (action === "export-regex") {
      const script = getById(state.regexScripts, id);
      if (script) downloadJson(`${safeFilename(script.scriptName)}.json`, script.raw || script);
    }
    else if (action === "create-quick") openQuickReplyForm();
    else if (action === "edit-quick") openQuickReplyForm(id);
    else if (action === "toggle-quick-group") {
      const active = state.settings.activeQuickReplyIds.includes(id);
      state.settings.activeQuickReplyIds = active
        ? state.settings.activeQuickReplyIds.filter((item) => item !== id)
        : [...state.settings.activeQuickReplyIds, id];
      await saveSettings();
      renderScreen();
    }
    else if (action === "delete-quick") {
      if (await confirmDialog("删除快捷回复组？", "按钮配置会被移除。")) {
        await dbDelete("quickReplies", id);
        state.settings.activeQuickReplyIds = state.settings.activeQuickReplyIds.filter((item) => item !== id);
        await saveSettings();
        await refreshAll();
        renderScreen();
      }
    }
    else if (action === "add-quick-button") {
      const list = $("#quickButtonList");
      if (list) list.insertAdjacentHTML("beforeend", renderQuickButton({ label: "", message: "", showLabel: false, isHidden: false }));
    }
    else if (action === "remove-quick-button") target.closest("[data-quick-button]")?.remove();
    else if (action === "api-tab") { state.apiTab = target.dataset.tab; refreshApiManager(); }
    else if (action === "add-api-template") {
      const template = API_CATALOG[state.apiTab][Number(target.dataset.templateIndex)];
      if (template) openApiEditor(defaultApiConfig(state.apiTab, template));
    }
    else if (action === "edit-api") openApiEditor(clone(getApiConfig(id)));
    else if (action === "test-api") {
      setBusy(target, true, "测试中");
      try {
        await testApiConfig(id);
        toast("连接成功");
      } catch (error) {
        toast(error.message, "error", 5200);
      } finally {
        setBusy(target, false);
      }
    }
    else if (action === "set-default-api") {
      const config = getApiConfig(id);
      if (config) {
        const key = config.category === "text" ? "defaultTextApiId" : config.category === "image" ? "defaultImageApiId" : "defaultVideoApiId";
        state.settings[key] = id;
        await saveSettings();
        renderScreen();
        toast("已设为默认");
      }
    }
    else if (action === "delete-api") {
      if (await confirmDialog("删除 API 配置？", "使用该配置的聊天会回退到同类默认接口。")) {
        await dbDelete("apiConfigs", id);
        await refreshAll();
        openApiManager(state.apiTab);
      }
    }
    else if (action === "export-backup") { closeModal(); await exportBackup(); }
    else if (action === "create-theme") openThemeEditor();
    else if (action === "advance-date") await advanceDate(id);
    else if (action === "add-date-beat") openAddDateBeat(id);
    else if (action === "add-date-ending") openAddDateEnding(id);
    else if (action === "delete-date") {
      if (await confirmDialog("删除约会？", "剧情、分歧点与好感数值会一起删除。")) {
        state.settings.dates = state.settings.dates.filter((item) => item.id !== id);
        await saveSettings();
        renderScreen();
      }
    }
    else if (action === "like-moment") {
      const moment = state.settings.moments.find((item) => item.id === id);
      const name = state.settings.userProfile?.name || "你";
      if (moment) {
        moment.likes = moment.likes || [];
        if (!moment.likes.includes(name)) moment.likes.push(name);
        moment.respondedByChar = false;
      }
      await saveSettings();
      openMoments();
    }
    else if (action === "comment-moment") {
      const text = window.prompt("写一条评论");
      if (text) {
        const moment = state.settings.moments.find((item) => item.id === id);
        moment.comments = moment.comments || [];
        moment.comments.push({ id: uid(), author: state.settings.userProfile?.name || "你", text, createdAt: now() });
        moment.respondedByChar = false;
        await saveSettings();
        openMoments();
      }
    }
    else if (action === "delete-moment") {
      if (await confirmDialog("删除动态？")) {
        state.settings.moments = state.settings.moments.filter((item) => item.id !== id);
        await saveSettings();
        openMoments();
      }
    }
  } catch (error) {
    console.error(error);
    toast(error.message || "操作失败", "error", 5000);
  }
}

function handleDocumentInput(event) {
  if (event.target.matches("[data-input=chat]")) autoSizeTextarea(event.target);
  if (event.target.name?.startsWith("dim_")) {
    const output = event.target.closest(".personality-row")?.querySelector("output");
    if (output) output.textContent = event.target.value;
  }
}

async function handleDocumentChange(event) {
  const target = event.target;
  if (target.name === "avatarFile" && target.files?.[0]) {
    const file = target.files[0];
    const preview = $("#avatarPreview");
    if (!preview) return;
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<video src="${escapeAttr(url)}" autoplay muted loop playsinline></video>`;
    } else {
      const dataUrl = await imageFileToDataUrl(file, 1024, .88);
      preview.innerHTML = `<img src="${escapeAttr(dataUrl)}" alt="头像预览">`;
    }
  }
  if (target.name === "avatarReferenceFile" && target.files?.[0]) {
    const dataUrl = await imageFileToDataUrl(target.files[0], 1280, .86);
    const preview = $("#avatarReferencePreview");
    if (preview) preview.innerHTML = `<span class="avatar-reference-card"><img src="${escapeAttr(dataUrl)}" alt="参考图预览"><span>已选择参考图，生成头像时会一并提交。</span></span>`;
  }
}

async function handleDocumentSubmit(event) {
  event.preventDefault();
  if (event.target.matches("[data-call-text-form]")) await handleCallTextSubmit(event.target);
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape") {
    if (!$("#modal").classList.contains("hidden")) closeModal();
    else if (!$("#sheet").classList.contains("hidden")) closeSheet();
  }
  if (event.key === "Enter" && !event.shiftKey && event.target.id === "chatInput" && state.settings.sendOnEnter) {
    event.preventDefault();
    sendMessageFromComposer();
  }
}

function handleDragStart(event) {
  const item = event.target.closest("[data-preset-prompt], [data-world-entry], [data-quick-button]");
  if (!item) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", "pocketlink-drag");
  item.classList.add("dragging");
  state.draggingElement = item;
}

function handleDrop(event) {
  const parent = event.target.closest("[data-drop-zone], #presetPromptList, #quickButtonList");
  if (!parent || !state.draggingElement) return;
  event.preventDefault();
  const target = event.target.closest("[data-preset-prompt], [data-world-entry], [data-quick-button]");
  if (target && target !== state.draggingElement) {
    const rect = target.getBoundingClientRect();
    parent.insertBefore(state.draggingElement, event.clientY < rect.top + rect.height / 2 ? target : target.nextSibling);
  } else {
    parent.append(state.draggingElement);
  }
  state.draggingElement.classList.remove("dragging");
  state.draggingElement = null;
}

/* 启动应用。 */
bootstrap();
