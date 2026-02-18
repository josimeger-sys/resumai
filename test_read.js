const fs = require('fs');
try {
  const data = fs.readFileSync('package.json', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}