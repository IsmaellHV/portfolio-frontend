import { AdapterEncrypt } from './AdapterEncrypt';
import { AdapterGeneric } from './AdapterGeneric';

export class AdapterIndexedDB {
  private name: string;
  private version: number;
  private stores: Array<{ name: string; pk: string; index: Array<{ key: string; unique: boolean }>; encrpyt: boolean }>;
  private online: boolean = false;

  constructor(name: string, version: number, stores: Array<{ name: string; pk: string; index: Array<{ key: string; unique: boolean }>; encrpyt: boolean }>) {
    this.name = name;
    this.version = version;
    this.stores = stores;
  }

  public run() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.name, this.version);

      req.onsuccess = () => {
        this.version = req.result.version;
        this.online = true;
        resolve(true);
      };

      req.onerror = () => {
        reject(req.error);
      };

      req.onupgradeneeded = () => {
        if (this.stores.length > 0) {
          for (const store of this.stores) {
            if (!req.result.objectStoreNames.contains(store.name)) {
              const newStore = req.result.createObjectStore(store.name, { keyPath: store.pk, autoIncrement: false });
              this.stores.push(store);
              newStore.createIndex(store.pk, store.pk, { unique: true });

              if (store.index.length > 0) {
                for (const row of store.index) {
                  newStore.createIndex(row.key, row.key, { unique: row.unique });
                }
              }
            }
          }
        }
      };
    });
  }

  public drop() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(this.name);
      req.onsuccess = () => {
        this.online = false;
        resolve(true);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  public existsStore(nameStore: string) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.name);

      req.onsuccess = () => {
        resolve(!req.result.objectStoreNames.contains(nameStore) ? false : true);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  public async insertDataStore(params: Array<{ nameStore: string; data: Array<object> | object }> | { nameStore: string; data: Array<object> | object }) {
    const promisesInsert = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesInsert.push(this.operationDataStore(row.nameStore, 'insert', row.data));
      }
      data = await Promise.all(promisesInsert);
    } else {
      data = await this.operationDataStore(params.nameStore, 'insert', params.data);
    }
    return data;
  }

  public async selectAllStore(params: Array<string> | string) {
    const promisesSelect = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesSelect.push(this.operationDataStore(row, 'selectAll', undefined));
      }
      data = await Promise.all(promisesSelect);
    } else {
      data = await this.operationDataStore(params, 'selectAll', undefined);
    }
    return data;
  }

  public async countStore(params: Array<string> | string) {
    const promisesSelect = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesSelect.push(this.operationDataStore(row, 'count', undefined));
      }
      data = await Promise.all(promisesSelect);
    } else {
      data = await this.operationDataStore(params, 'count', undefined);
    }
    return data;
  }

  public async selectByIndexStore(params: Array<{ nameStore: string; value: any }> | { nameStore: string; value: any }) {
    const promisesSelect = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesSelect.push(this.operationDataStore(row.nameStore, 'selectIndex', row.value));
      }
      data = await Promise.all(promisesSelect);
    } else {
      data = await this.operationDataStore(params.nameStore, 'selectIndex', params.value);
    }
    return data;
  }

  public async updateByIndexStore(params: Array<{ nameStore: string; value: any }> | { nameStore: string; value: any }) {
    const promisesUpdate = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesUpdate.push(this.operationDataStore(row.nameStore, 'update', row.value));
      }
      data = await Promise.all(promisesUpdate);
    } else {
      data = await this.operationDataStore(params.nameStore, 'update', params.value);
    }
    return data;
  }

  public async deleteByIndexStore(params: Array<{ nameStore: string; value: any }> | { nameStore: string; value: any }) {
    const promisesDelete = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesDelete.push(this.operationDataStore(row.nameStore, 'delete', row.value));
      }
      data = await Promise.all(promisesDelete);
    } else {
      data = await this.operationDataStore(params.nameStore, 'delete', params.value);
    }
    return data;
  }

  public async clearStore(params: Array<string> | string) {
    const promisesDelete = [];
    let data: any = [];

    if (Array.isArray(params)) {
      for (const row of params) {
        promisesDelete.push(this.operationDataStore(row, 'clear', undefined));
      }
      data = await Promise.all(promisesDelete);
    } else {
      data = await this.operationDataStore(params, 'clear', undefined);
    }
    return data;
  }

  private operationDataStore(nameStore: string, actionStore: 'insert' | 'selectIndex' | 'selectAll' | 'update' | 'delete' | 'clear' | 'count', value: any) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.name);

      req.onsuccess = () => {
        try {
          const transac = req.result.transaction(nameStore, 'readwrite');
          const store = transac.objectStore(nameStore);

          const dataStore = this.stores.find((row) => row.name === nameStore);
          if (!dataStore) {
            resolve(null);
          }

          const key: string = dataStore?.pk as string;
          let newRow: any = null;

          switch (actionStore) {
            case 'insert':
              if (Array.isArray(value)) {
                for (const row of value) {
                  if (import.meta.env?.VITE_REQUIRE_ENCRYPT === '1' && dataStore?.encrpyt) {
                    newRow = { [key]: row[key], value: AdapterEncrypt.encrypt(JSON.stringify(row), import.meta.env?.VITE_KEY_ENCRYPT as string) };
                    store.put(newRow);
                  } else {
                    store.put(row);
                  }
                }
              } else {
                if (import.meta.env?.VITE_REQUIRE_ENCRYPT === '1' && dataStore?.encrpyt) {
                  newRow = { [key]: value[key], value: AdapterEncrypt.encrypt(JSON.stringify(value), import.meta.env?.VITE_KEY_ENCRYPT as string) };
                  store.put(newRow);
                } else {
                  store.put(value);
                }
              }
              resolve(value);
              break;
            case 'selectIndex': {
              const reqSelectIndex: IDBRequest<any> = store.get(value);
              reqSelectIndex.onsuccess = () => {
                if (import.meta.env?.VITE_REQUIRE_ENCRYPT === '1' && dataStore?.encrpyt) {
                  newRow = AdapterEncrypt.decrypt(reqSelectIndex.result.value, import.meta.env?.VITE_KEY_ENCRYPT as string);
                  newRow = AdapterGeneric.isJSON(newRow) ? JSON.parse(newRow) : newRow;
                  resolve(newRow);
                } else {
                  resolve(reqSelectIndex.result);
                }
              };
              reqSelectIndex.onerror = () => {
                reject(reqSelectIndex.error);
              };
              break;
            }
            case 'selectAll': {
              const reqAll: IDBRequest<any> = store.getAll();
              reqAll.onsuccess = () => {
                newRow = [];
                if (import.meta.env?.VITE_REQUIRE_ENCRYPT === '1' && dataStore?.encrpyt) {
                  for (let row of reqAll.result) {
                    row = AdapterEncrypt.decrypt(row.value, import.meta.env?.VITE_KEY_ENCRYPT as string);
                    row = AdapterGeneric.isJSON(row) ? JSON.parse(row) : row;
                    newRow.push(row);
                  }
                  resolve(newRow);
                } else {
                  resolve(reqAll.result);
                }
              };
              reqAll.onerror = () => {
                reject(reqAll.error);
              };
              break;
            }
            case 'update': {
              if (import.meta.env?.VITE_REQUIRE_ENCRYPT === '1' && dataStore?.encrpyt) {
                newRow = { [key]: value[key], value: AdapterEncrypt.encrypt(JSON.stringify(value), import.meta.env?.VITE_KEY_ENCRYPT as string) };
                // store.put(newRow);
              } else {
                newRow = value;
                // store.put(value);
              }
              const reqUpdate: IDBRequest<any> = store.put(newRow);
              reqUpdate.onsuccess = () => {
                resolve(value);
              };
              reqUpdate.onerror = () => {
                reject(reqUpdate.error);
              };
              break;
            }
            case 'delete': {
              const reqDelete: IDBRequest<any> = store.delete(value);
              reqDelete.onsuccess = () => {
                resolve(reqDelete.result);
              };
              reqDelete.onerror = () => {
                reject(reqDelete.error);
              };
              break;
            }
            case 'clear': {
              const reqClear: IDBRequest<any> = store.clear();
              reqClear.onsuccess = () => {
                resolve(reqClear.result);
              };
              reqClear.onerror = () => {
                reject(reqClear.error);
              };
              break;
            }
            case 'count': {
              const reqCount: IDBRequest<any> = store.count();
              reqCount.onsuccess = () => {
                resolve(reqCount.result);
              };
              reqCount.onerror = () => {
                reject(reqCount.error);
              };
              break;
            }
            default:
              break;
          }
        } catch (error) {
          reject(error);
        }
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  }
}
