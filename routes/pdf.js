const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit')
var fs = require('fs');
var request = require('request');

router.post('/', (req, res) => {
  const doc = new PDFDocument();
  var writeStream = fs.createWriteStream('public/file.pdf');

  let filename = 'ecoscore-fax'
  var FaxNumber = req.body.faxnum
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf'
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')
  const content = req.body.content
  doc.y = 300
  doc.text(content, 50, 50)
  doc.pipe(writeStream);
  doc.pipe(res)
  doc.end()
  
  request.post('https://fax.twilio.com/v1/Faxes').form({
    To: "+",
    From: "+",
    statusCallback:'',
    MediaUrl:''}).auth(
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN'
  );

})


module.exports = router
