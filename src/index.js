const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const headerLength = 43;
const standardHeader = 'reMarkable lines with selections and layers';
const width = 1404;
const height = 1872;

/**
 * 
 * @param {string} inputFile 
 * @param {string} outdir 
 */
function parse(inputFile, outdir) {
    return new Promise((resolve, reject) => {
        fs.readFile(inputFile, (err, data) => {
            if (!checkHeader(data)) {
                return reject('invalid lines file');
            }
            processFile(data.slice(headerLength), outdir)
                .then(paths => resolve(paths));
        });
    });
}

/**
 * @param {Buffer} buffer 
 */
function checkHeader(buffer) {
    let s = '';

    buffer.slice(0, headerLength).forEach((v) => {
        s += String.fromCharCode(v);
    })

    return s == standardHeader;
}

/**
 * @param {Buffer} buffer 
 */
function processFile(buffer, outdir) {

    let pages = buffer.readInt32LE(0x0);
    let pOffset = 4;

    console.log('the file has ' + pages + ' pages');

    const pagesPromises = [];

    for (let p = 0; p < pages; p++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(0, 0, width, height);

        pOffset = processPage(buffer, pOffset, ctx);

        pagesPromises.push(new Promise(resolve => {

            const imgPath = path.join(outdir, p + '.png');

            outImg = fs.createWriteStream(imgPath);

            canvas.pngStream().pipe(outImg);

            outImg.on('finish', function () {
                resolve({ path: imgPath });
            });

        }))

    };

    return Promise.all(pagesPromises);
}

/** 
 * @param {Buffer} buffer 
 * @param {number} offset 
 */
function processPage(buffer, offset, ctx) {
    console.log('\t--- processing page at ' + offset.toString(16));

    const layers = buffer.readInt32LE(offset);
    offset += 4;

    console.log('\tpage has ' + layers + ' layers');

    for (let l = 0; l < layers; l++) {

        console.log('\t\tprocessing layer ' + l);

        const lines = buffer.readInt32LE(offset);
        offset += 4;

        console.log('\t\tlevel has ' + lines + ' lines');

        for (let li = 0; li < lines; li++) {
            const lineDef = {
                brush: buffer.readInt32LE(offset),
                color: buffer.readInt32LE(offset + 4),
                magic: buffer.readInt32LE(offset + 8),
                brushSize: buffer.readFloatLE(offset + 12),
                dots: buffer.readInt32LE(offset + 16),
            }
            offset += 20;

            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let d = 0; d < lineDef.dots; d++) {
                const dotDef = {
                    x: buffer.readFloatLE(offset),
                    y: buffer.readFloatLE(offset + 4),
                    pressure: buffer.readFloatLE(offset + 8),
                    xrot: buffer.readFloatLE(offset + 12),
                    yrot: buffer.readFloatLE(offset + 16),
                }
                offset += 20;

                ctx.lineTo(dotDef.x, dotDef.y);
            }
            ctx.stroke();
        }
    }

    return offset;
}

module.exports = { parse };