const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

fs.mkdir(outputDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка:', err);
    return;
  }

  const output = fs.createWriteStream(outputFile);

  fs.readdir(stylesDir, (err, files) => {
    if (err) {
      console.error('Ошибка:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(stylesDir, file);

      if (path.extname(file) === '.css') {
        const input = fs.createReadStream(filePath, 'utf-8');
        input.pipe(output, { end: false });
        input.on('end', () => {
          output.write('\n');
        });
      }
    });
  });
});
