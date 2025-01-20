const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'project-dist');

fs.mkdir(folderPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const outputPath = path.join(folderPath, 'index.html');

  fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
      return console.error(err);
    }

    let templateContent = data;
    const regex = /{{(.*?)}}/g;
    const matches = templateContent.match(regex);

    if (matches) {
      let pending = matches.length;

      matches.forEach((match) => {
        const componentName = match.slice(2, -2).trim();
        const componentPath = path.join(
          componentsPath,
          `${componentName}.html`,
        );

        fs.readFile(componentPath, 'utf8', (err, componentData) => {
          if (err) {
            return console.error(err);
          }

          templateContent = templateContent.replace(match, componentData);
          pending -= 1;

          if (pending === 0) {
            fs.writeFile(outputPath, templateContent, (err) => {
              if (err) {
                return console.error(err);
              }
            });
          }
        });
      });
    } else {
      fs.writeFile(outputPath, templateContent, (err) => {
        if (err) {
          return console.error(err);
        }
      });
    }
  });
  const stylesFolderPath = path.join(__dirname, 'styles');
  const outputStylePath = path.join(folderPath, 'style.css');

  fs.readdir(stylesFolderPath, (err, files) => {
    if (err) {
      return console.error(err);
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    let stylesContent = '';

    cssFiles.forEach((file, index) => {
      const filePath = path.join(stylesFolderPath, file);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return console.error(err);
        }

        stylesContent += data;

        if (index === cssFiles.length - 1) {
          fs.writeFile(outputStylePath, stylesContent, (err) => {
            if (err) {
              return console.error(err);
            }
          });
        }
      });
    });
  });
  const assetsSourcePath = path.join(__dirname, 'assets');
  const assetsDestPath = path.join(folderPath, 'assets');

  function copyFolder(source, destination) {
    fs.mkdir(destination, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }

      fs.readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
          return console.error(err);
        }

        files.forEach((file) => {
          const sourcePath = path.join(source, file.name);
          const destPath = path.join(destination, file.name);

          if (file.isDirectory()) {
            copyFolder(sourcePath, destPath);
          } else {
            fs.copyFile(sourcePath, destPath, (err) => {
              if (err) {
                return console.error(err);
              }
            });
          }
        });
      });
    });
  }

  copyFolder(assetsSourcePath, assetsDestPath);
});
