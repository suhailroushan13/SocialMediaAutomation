import express from "express";
import config from "config";
import multer from "multer";
import fs from "fs/promises";
import { addPost, getMediumArticles } from "medium-api-npm";
import imageModel from "../model/images/index.js";
import generateRandomId from "../utils/randomString.js";
import request from "request-promise";
import { IgApiClient } from "instagram-private-api";
import axios from "axios";
import { fdatasync } from "fs";
import sendSMS from "../utils/sendSMS.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    let fileName = req.file.originalname;

    let kb = Math.floor(req.file.size / 1024).toPrecision(3);
    let mb = Math.floor(kb / 1024);

    if (req.file.originalname == undefined)
      return res.send("Only JPG and JPEG Files are Accepted");
    if (mb >= 5) return res.send("Only 5 MB Files are Accepted");
    if (!req.file.originalname.endsWith(".jpg")) {
      return res.send("Only JPG and JPEG Files are Accepted");
    }

    let caption = req.body.caption;

    let readFile = await fs.readFile(
      `${config.get("PATH")}/captions.json`,
      "utf-8"
    );
    let stringToObject = JSON.parse(readFile);
    stringToObject.push(caption);

    let writeFile = await fs.writeFile(
      `${config.get("PATH")}/captions.json`,
      JSON.stringify(stringToObject)
    );

    let imageData = req.file;

    let imageBuffer = Buffer.from(imageData.buffer);

    await fs.writeFile(`${config.get("PATH")}/upload/${fileName}`, imageBuffer);

    // Save in DB

    let clientData = await imageModel.create({
      _id: generateRandomId(),
      name: fileName,
      imageBuffer: imageBuffer,
      caption: caption,
    });

    await clientData.save();

    console.log("Saved In DB");

    // Imgur
    let imageLink;
    let clientId = config.get("Client_ID");
    let imagePath = `${config.get("PATH")}/upload/${fileName}`;

    const options = {
      url: "https://api.imgur.com/3/image",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      formData: {
        image: await fs.readFile(imagePath),
      },
    };

    await request.post(options, (err, response, body) => {
      if (err) {
        console.error(err);
      } else {
        let obj = JSON.parse(body);
        imageLink = obj.data.link;
      }
    });

    const ig = new IgApiClient();
    ig.state.generateDevice(config.get("IG_USERNAME"));
    await ig.account.login(
      config.get("IG_USERNAME"),
      config.get("IG_PASSWORD")
    );
    await ig.publish.photo({
      file: imageData.buffer,
      caption: String(caption),
    });
    console.log("Uploaded On Instagram");

    const response = await axios.post(
      "https://api.linkedin.com/v2/shares",
      {
        content: {
          contentEntities: [
            {
              entityLocation: "suhailroushan.com",
              thumbnails: [
                {
                  resolvedUrl: String(imageLink),
                },
              ],
            },
          ],
          title: String(caption),
        },
        distribution: {
          linkedInDistributionTarget: {},
        },
        owner: "urn:li:person:0tO1NFnwen",
        subject: String(caption),
        text: {
          text: String(caption),
        },
      },
      {
        headers: {
          Authorization:
            "Bearer TOKEN",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Uploaded On LinkedIn");

    // Medium
    const auth =
      "MEDIUM AUTH KEY";

    const userData = await getMediumArticles({ auth });
    // console.log(userData);

    const postData = {
      auth,
      title: caption,
      html: `< !DOCTYPE html >
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${caption}</title>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                                rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                                crossorigin="anonymous">
                            </head>
                            <body>
                                <div style="margin:30px">
                                    <h4>
                                        <a href="https://github.com/suhailroushan13/">Suhail Roushan 🚀</a>
                                    </h4>
                                    <h5>𝗙𝗲𝗹𝗹𝗼𝘄 𝗮𝘁 𝗖𝗦.𝗖𝗢𝗗𝗘.𝗜𝗡 - 𝗖𝗹𝗮𝘀𝘀 𝗼𝗳 𝗖𝗦 𝟮𝟬𝟮𝟭</h5>
                                    <ul style="text-decoration: none">
                                        <li>
                                            <a href="https://www.instagram.com/metacode.live/">Instagram</a>
                                        </li>
                                        <li>
                                            <a href="https://www.linkedin.com/in/suhailroushan/recent-activity/">LinkedIn</a>
                                        </li>
                                        <li>
                                            <a href="https://twitter.com/0xsuhailroushan">Twitter</a>
                                        </li>
                                    </ul>
                                    <img src="${imageLink}" alt="${caption}">
                                        <h1>${caption}</h1>
                                </div>
                            </body>
                        </html>`,
      canonicalUrl: `https://medium.com/@${caption}`,
      tags: ["test"],
      publishStatus: "public",
    };
    const postResponse = await addPost(postData);
  
    console.log("Uploaded On Medium");

     console.log("Start SMS");

     await sendSMS({
       body: `SomeOne Has Uploaded a Image : https://www.linkedin.com/in/suhailroushan/recent-activity/`,
       phone: "+919618211626",
     });

     console.log("End SMS");

   


    res.status(200).json({ success: "Automation Successfull" });

    process.exit();
  } catch (error) {
    console.log(error);
  }
});

export default router;
