const fs = require('fs');
const path = require('path');

function createStore(outdir) {
  let p = 0;

  return streams => {
    const promises = [];

    for (const stream of streams) {
      promises.push(new Promise(resolve => {
        const imgPath = path.join(outdir, p + '.png');
        p++;

        outImg = fs.createWriteStream(imgPath);

        stream.pipe(outImg);

        outImg.on('finish', function () {
          resolve({ path: imgPath });
        });
      }))

    }

    return Promise.all(promises);
  }
}

module.exports = createStore;