import fs = require('fs');

export default function generateRouteJSONs() {
  const files: string[] = fs.readdirSync(`${__dirname}/api/`);
  const obj: Record<string, Record<string, any>> = {}
  for (const file of files) {
    obj[`/api/${file.slice(0, file.length - 5)}`] = JSON.parse(fs.readFileSync(`${__dirname}/api/${file}`, { encoding: 'utf8', flag: 'r' }));
  }
  return obj
}
