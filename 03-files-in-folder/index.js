const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const fileSizeInKB = (stats.size / 1024).toFixed(3);
        const fileName = path.parse(file.name).name;
        const fileExt = path.parse(file.name).ext.slice(1);

        console.log(`${fileName} - ${fileExt} - ${fileSizeInKB}kb`);
      });
    }
  });
});
