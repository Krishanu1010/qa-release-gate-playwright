const fs = require('node:fs');
const path = require('node:path');

for (const directory of ['allure-results', 'allure-report']) {
  fs.rmSync(path.join(__dirname, '..', directory), { recursive: true, force: true });
}
