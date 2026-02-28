const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extractStudentData() {
    const pdfPath = path.join(__dirname, '..', 'data', 'roll_call.pdf');
    const dataBuffer = fs.readFileSync(pdfPath);

    try {
        const data = await pdf(dataBuffer);
        console.log('--- PDF TEXT CONTENT ---');
        console.log(data.text);
        console.log('--- END OF CONTENT ---');

        // Save to a text file for further analysis if needed
        fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'extracted_pdf_text.txt'), data.text);
    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
}

extractStudentData();
