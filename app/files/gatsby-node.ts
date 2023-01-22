import downloadDirectusAssets from "./src/node_lib/download_directus_assets";

// GATSBY STUFF
const onPostBootstrap = async ({ reporter }) => {
  reporter.info(`Downloading images from directus for users and plants`);

  await downloadDirectusAssets().catch((err) => {
    console.error("Downloading new images for plants/users failed", err);
  });

  reporter.info(`Images are all downloaded successfully!`);
};

export { onPostBootstrap };
