// IndexedDB utility for storing user settings
export class SettingsDB {
  private dbName = 'vibeTimerDB';
  private version = 1;
  private storeName = 'settings';

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async setSetting(key: string, value: any): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await store.put({ key, value });
      db.close();
    } catch (error) {
      console.warn(`Error saving setting ${key}:`, error);
    }
  }

  async getSetting(key: string): Promise<any> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        
        request.onsuccess = () => {
          db.close();
          resolve(request.result?.value || null);
        };
        
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    } catch (error) {
      console.warn(`Error loading setting ${key}:`, error);
      return null;
    }
  }
}

export const settingsDB = new SettingsDB();
