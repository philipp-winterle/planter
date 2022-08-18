import { Directus, ID } from "@directus/sdk";

const TOKEN: string = process.env.GATSBY_DIRECTUS_ACCESS_TOKEN ?? "";
const DIRECTUS_PORT = process.env.GATSBY_DIRECTUS_PORT ?? 8099;

type User = {
  id: ID;
  avatar: Object;
};

type Plant = {
  id: ID;
  photo: Object;
};

type PlanterCollections = {
  users: User;
  plants: Plant;
  site: any;
};

class DataClient {
  client;

  constructor() {
    // Local Adress
    const host = `${window.location.protocol}//${window.location.hostname}:${DIRECTUS_PORT}`;

    this.client = new Directus<PlanterCollections>(host, {
      auth: {
        staticToken: TOKEN,
      },
    });

    this.init();
  }

  async init() {}

  getNativeClient(): Directus<PlanterCollections> {
    return this.client;
  }

  async read(collection: string, queryObj: object = { limit: -1 }) {
    const data = await this.client.items(collection).readByQuery(queryObj);

    return data.data;
  }

  async readOne(collection: string, id: ID, queryObj = {}): Promise<any> {
    const data = await this.client.items(collection).readOne(id, queryObj);

    return data;
  }

  async update(collection: string, itemId: number, queryObj = {}) {
    const data = await await this.client.items(collection).updateOne(itemId, queryObj);

    return data;
  }
}

export default DataClient;
