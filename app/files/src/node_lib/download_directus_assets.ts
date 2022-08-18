import { Directus, ID } from "@directus/sdk";
import downloadImage from "./download_image";

const DIRECTUS_HOST: string = process.env.DIRECTUS_HOST ?? "";
const TOKEN: string = process.env.GATSBY_DIRECTUS_ACCESS_TOKEN ?? "";
const directusUploadsURL = `${DIRECTUS_HOST}/assets/`;

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
};

const directus = new Directus<PlanterCollections>(DIRECTUS_HOST, {
  auth: {
    staticToken: TOKEN,
  },
});

const downloadDirectusAssets = async ({
  itemCollection,
  itemIds,
}: { itemCollection?: string | null; itemIds?: Array<number> } = {}): Promise<void> => {
  // Transporm itemIDs into numbers

  console.log(
    `Downloading new image assets from directus. Collection: "${itemCollection}" | ItemIds: "${itemIds?.join()}" `
  );

  if (!itemCollection || itemCollection === "user") {
    let items: any;

    const usersCol = await directus.items("user");

    if (itemIds) {
      items = await usersCol.readMany(itemIds, {
        fields: ["id", "avatar.*"],
        limit: 100,
      });
    } else {
      items = await usersCol.readByQuery({
        fields: ["id", "avatar.*"],
        limit: 100,
      });
    }

    const users = items.data;

    for (const user of users) {
      const image = user.avatar ?? {};

      if (image.filename_disk) {
        const filenameDisk = image.filename_disk;
        const filenameDownload = image.filename_download;

        await downloadImage(`${directusUploadsURL}${filenameDisk}`, filenameDisk).then(() => {
          console.log(`User Image (${directusUploadsURL}${filenameDisk} | ${filenameDisk}) successfully downloaded`);
        });
      }
    }
  }

  if (!itemCollection || itemCollection === "plant") {
    let items: any;

    const plantsCol = await directus.items("plant");

    if (itemIds) {
      items = await plantsCol.readMany(itemIds, {
        fields: ["id", "photo.*"],
        limit: 100,
      });
    } else {
      items = await plantsCol.readByQuery({
        fields: ["id", "photo.*"],
        limit: 100,
      });
    }

    const plants = items.data;

    for (const plant of plants) {
      const image = plant.photo ?? {};

      if (image.filename_disk) {
        const filenameDisk = image.filename_disk;
        const filenameDownload = image.filename_download;

        await downloadImage(`${directusUploadsURL}${filenameDisk}`, filenameDisk).then(() => {
          console.log(`Plant Image (${directusUploadsURL}${filenameDisk} | ${filenameDisk}) successfully downloaded`);
        });
      }
    }
  }
};

export default downloadDirectusAssets;
export { downloadDirectusAssets };
