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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMETERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // ! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user

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