const formidable = require('formidable');
const fs = require('fs');
const heicConvert = require('heic-convert');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    const file = files.file;
    const buffer = fs.readFileSync(file.filepath);
    const outputBuffer = await heicConvert({
      buffer,
      format: 'JPEG',
      quality: 1,
    });
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(outputBuffer);
  });
}
