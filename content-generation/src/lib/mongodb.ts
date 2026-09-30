import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore if custom DNS server assignment is restricted by environment
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let _clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const options = {};

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  if (!_clientPromise) {
    const client = new MongoClient(uri, options);
    _clientPromise = client.connect();
  }
  return _clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function getDb(databaseName?: string): Promise<Db> {
  const dbName = databaseName || process.env.MONGODB_DB || 'demoly_cms';
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}

export default getClientPromise;
