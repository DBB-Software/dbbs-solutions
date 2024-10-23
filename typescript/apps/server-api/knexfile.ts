import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Knex } from 'knex'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_DIR = resolve(__dirname, 'src', 'db');

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: resolve(BASE_DIR, '../../data.db'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: resolve(BASE_DIR, 'migrations'),
    extension: 'ts',
  },
};

export default config;