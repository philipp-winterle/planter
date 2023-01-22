import path from "path";
import fs from "fs";
import axios from "axios";

const TOKEN: string = process.env.GATSBY_DIRECTUS_ACCESS_TOKEN ?? "";
const pathToPublicStatic = "./public/static/";

const downloadImage = async (url: string, filename: string): Promise<void> => {
  return new Promise(async (resolve, reject): Promise<void> => {
    const filePath = path.join(pathToPublicStatic, filename);

    // axios image download with response type "stream"
    await axios({
      url,
      method: "GET",
      responseType: "stream",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((response) => {
        response.data.pipe(fs.createWriteStream(filePath));

        // return a promise and resolve when download finishes

        response.data.on("end", () => {
          resolve();
        });

        response.data.on("error", () => {
          reject();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

export default downloadImage;
export { downloadImage };
