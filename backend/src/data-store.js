import fs from 'fs';
import path from 'path';

const DEFAULT_APP_DATA = {
  projects: [],
  members: [],
  tasks: [],
  statuses: [],
  priorities: [],
  scorecards: [],
  insights: [],
  lastUpdated: new Date().toISOString(),
};

export class DataStore {
  constructor(rootDir) {
    this.baseDir = rootDir;
    this.dataDir = path.join(this.baseDir, 'data');
    this.dataFile = path.join(this.dataDir, 'app-data.json');
    this.snapshotDir = path.join(this.dataDir, 'snapshots');
    this.ensureDirectories();
  }

  ensureDirectories() {
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.mkdirSync(this.snapshotDir, { recursive: true });
  }

  loadData() {
    if (!fs.existsSync(this.dataFile)) {
      this.saveData(DEFAULT_APP_DATA);
      return DEFAULT_APP_DATA;
    }

    try {
      const raw = fs.readFileSync(this.dataFile, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Failed to parse app-data.json, resetting to default data.', error);
      this.saveData(DEFAULT_APP_DATA);
      return DEFAULT_APP_DATA;
    }
  }

  saveData(data) {
    const payload = { ...data, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(this.dataFile, JSON.stringify(payload, null, 2), 'utf-8');
    return payload;
  }

  saveSnapshot(data) {
    const date = new Date().toISOString().split('T')[0];
    const snapshotFile = path.join(this.snapshotDir, `${date}.json`);
    fs.writeFileSync(snapshotFile, JSON.stringify({ ...data, snapshotDate: date }, null, 2), 'utf-8');
    return snapshotFile;
  }

  listSnapshots() {
    return fs.readdirSync(this.snapshotDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace(/\.json$/, ''))
      .sort()
      .reverse();
  }

  loadSnapshot(date) {
    const snapshotFile = path.join(this.snapshotDir, `${date}.json`);
    if (!fs.existsSync(snapshotFile)) return null;
    const raw = fs.readFileSync(snapshotFile, 'utf-8');
    return JSON.parse(raw);
  }
}
