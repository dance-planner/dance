import * as path from 'path'
var Jimp = require('jimp');
 
const fileId = `${path.join(path.resolve(''))}../events/images/`
// open a file called "lenna.png"
// Jimp.read('lenna.png', (err, lenna) => {
//   if (err) throw err;
//   lenna
//     .resize(256, 256) // resize
//     .quality(60) // set JPEG quality
//     .greyscale() // set greyscale
//     .write('lena-small-bw.jpg'); // save
// });