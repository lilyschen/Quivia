const pdfParse = require('pdf-parse');

const parsePdf = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        throw new Error('Error parsing PDF');
    }
};

module.exports = parsePdf;
