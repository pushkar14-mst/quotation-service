require("dotenv").config();
const express = require("express");
const http = require("http");
const { selectAQuotation } = require("./db-access");

const PORT = process.env.PORT;
const FILE_STORAGE_HOST = process.env.FILE_STORAGE_HOST;
const FILE_STORAGE_PORT = process.env.FILE_STORAGE_PORT;

const app = express();

app.get("/quotation", async (req, res) => {
  const quotation = await selectAQuotation();
  res.status(200).json(quotation);
});

app.get("/image", async (req, res) => {
  const imagePath = req.query.path;
  const options = {
    hostname: FILE_STORAGE_HOST,
    port: FILE_STORAGE_PORT,
    path: `/image?path=${imagePath}`,
    method: "GET",
  };
  const fileStorageReq = http.request(options, (fileStorageRes) => {
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": fileStorageRes.headers["content-length"],
    });
    fileStorageRes.pipe(res);
  });
  fileStorageReq.end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
