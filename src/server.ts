import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req: Request, res: Response) => {
    // Get the image_url from the query
    const { image_url } = req.query;

    if (typeof image_url !== "string") {
      return res.status(500).json({ error: "Invalid image url" });
    }

    // Check if the image_url is provided
    if (!image_url) {
      return res.status(400).send({ message: "image_url is required" });
    }

    try {
      // Filter the image
      const filteredpath = await filterImageFromURL(image_url);

      // Send the filtered image
      res.status(200).sendFile(filteredpath, () => {
        // Delete the filtered image from server after sending it as response
        deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      // Error handling for invalid image_url
      res.status(422).send({ message: "Unable to process the image" });
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();