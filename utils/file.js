const fs = require("fs");

const deleteFile = (filePath) => {
  filePath = filePath.slice(1);
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
