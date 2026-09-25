export const QUESTION_BANK_ADAPTER_VERSION = "1.0";

const requiredText = (value, field) => {
  const text = String(value || "").trim();
  if (!text) throw new Error(`Question-bank adapter requires ${field}`);
  return text;
};

const uniqueIndex = (items, keyFor, label) => {
  const index = new Map();
  items.forEach((item, position) => {
    const key = requiredText(keyFor(item), `${label}[${position}] key`);
    if (index.has(key)) throw new Error(`Duplicate ${label} key: ${key}`);
    index.set(key, item);
  });
  return index;
};

const sourceTypeIds = (item) => [...new Set([
  ...(Array.isArray(item?.typeIds) ? item.typeIds : []),
  item?.typeId
].filter(Boolean))];

export function defineQuestionBankAdapter(config = {}) {
  const id = requiredText(config.id, "id");
  const label = requiredText(config.label, "label");
  const adapterVersion = requiredText(config.adapterVersion || QUESTION_BANK_ADAPTER_VERSION, "adapterVersion");
  const types = Object.freeze([...(config.types || [])]);
  const sourceItems = Object.freeze([...(config.sourceItems || [])]);
  const typeIndex = uniqueIndex(types, (item) => item?.id, "type");
  const sourceIndex = uniqueIndex(sourceItems, (item) => item?.sourceKey, "source item");

  if (!config.allowUnresolvedTypes) {
    sourceItems.forEach((item) => {
      sourceTypeIds(item).forEach((typeId) => {
        if (!typeIndex.has(typeId)) {
          throw new Error(`Unknown typeId ${typeId} in ${item.sourceKey}`);
        }
      });
    });
  }

  const services = Object.freeze({ ...(config.services || {}) });
  const capabilities = Object.freeze({
    generators: typeof config.getGenerator === "function",
    renderers: typeof config.getRenderer === "function",
    sourceValidation: typeof config.validateSourceItem === "function",
    ...(config.capabilities || {})
  });

  return Object.freeze({
    adapterVersion,
    id,
    label,
    types,
    sourceItems,
    catalog: Object.freeze({ ...(config.catalog || {}) }),
    services,
    capabilities,
    listTypes: () => types,
    listSourceItems: () => sourceItems,
    typeById: (typeId) => typeIndex.get(typeId),
    sourceItemByKey: (sourceKey) => sourceIndex.get(sourceKey),
    getGenerator: typeof config.getGenerator === "function" ? config.getGenerator : () => null,
    getRenderer: typeof config.getRenderer === "function" ? config.getRenderer : () => null,
    validateSourceItem: typeof config.validateSourceItem === "function"
      ? config.validateSourceItem
      : (item) => Boolean(item?.sourceKey && sourceTypeIds(item).every((typeId) => typeIndex.has(typeId)))
  });
}
export function createQuestionBankAdapterRegistry(initialAdapters = []) {
  const adapters = new Map();

  const register = (adapter) => {
    if (!adapter || adapter.adapterVersion !== QUESTION_BANK_ADAPTER_VERSION) {
      throw new Error(`Unsupported question-bank adapter version: ${adapter?.adapterVersion || "missing"}`);
    }
    if (adapters.has(adapter.id)) throw new Error(`Duplicate question-bank adapter: ${adapter.id}`);
    adapters.set(adapter.id, adapter);
    return adapter;
  };

  initialAdapters.forEach(register);

  return Object.freeze({
    register,
    get: (id) => adapters.get(id),
    list: () => Object.freeze([...adapters.values()])
  });
}
