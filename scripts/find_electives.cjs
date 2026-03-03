const fs = require('fs');
const path = require('path');

const dataPath = 'd:/Projects/Personal/aura-integrity-engine/backend/extracted_students.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const electives = new Set();
data.forEach(student => {
    if (student[7]) electives.add(student[7]);
    if (student[8]) electives.add(student[8]);
});

console.log('Unique Electives:');
console.log(Array.from(electives).sort());
