const fs = require('fs');
const path = require('path');
const complete = process.argv[2] && process.argv[2] === 'true';

const makeFileListt = () => {
  return new Promise((res, rej) => {
    fs.readdir(__dirname, (err, files) => {
      if (err) return err;

      const com = {};

      files.forEach(file => {
        if (file !== 'files.js' && file !== 'filex.txt') {
          const sub = path.join(__dirname, file);
          const subFiles = fs.readdirSync(sub);

          com[file] = subFiles
            .map(subFile => {
              if (complete) {
                return subFile;
              }

              const regex = /P.* [0-9]{3}-[0-9]{2}[a-zA-Z]/;
              if (subFile.match(regex) !== null) {
                return subFile.match(regex)[0];
              }
            })
            .sort();
        }
      });

      if ([com].length >= 1) {
        res([com].filter(file => file !== undefined));
      } else {
        rej('The operation failed');
      }
    });
  });
};

makeFileListt()
  .then(values => {
    const name = path.join(__dirname, 'filex.txt');

    let text = '';

    for (let i = 0; i <= values.length - 1; i++) {
      for (let a in values[i]) {
        const obj = values[i][a];
        text += `\n\n${a}: \n`;
        for (let b = 0; b <= obj.length - 1; b++) {
          text += `\n${obj[b]}`;
        }
      }
    }

    fs.writeFile(name, text.trim(), err => {
      if (err) return err;
    });
  })
  .catch(err => console.log(err));
