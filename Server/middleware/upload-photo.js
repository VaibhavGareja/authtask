const multer = require("multer");
const storage = require("../helper/upload-multer");
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
});
module.exports = upload;
