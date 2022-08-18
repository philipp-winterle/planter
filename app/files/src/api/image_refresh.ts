import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import downloadDirectusAssets from "../node_lib/download_directus_assets";

// Update Images if new USERS or PLANTS are added
export default async function (req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) {
  const body = req.body;
  let collectionName: string | null = null;
  let itemIds: any;

  if (body) {
    const isImageChange = body?.payload?.photo !== undefined || body?.payload?.avatar !== undefined;

    // If no image as changed return 204 directly
    if (!isImageChange) {
      return res.status(204).json({ success: false });
    }

    const collection = body.collection;

    // Check if user create or update
    // Create has single key
    // Update has keys array
    const keys = body.keys ?? [body.key] ?? [];

    const ids = keys?.map((k: string): number => parseInt(k));

    collectionName = collection;
    itemIds = ids;
  }

  await downloadDirectusAssets({
    itemCollection: collectionName,
    itemIds: itemIds,
  })
    .then(() => {
      console.log("Downloading Directus Assets successfull", collectionName, itemIds);
      return res.status(200).json({ success: true });
    })
    .catch((err) => {
      console.error("Downloading Directus Assets failed", err);
      return res.status(404).json({ success: false, error: err.message });
    });
}
