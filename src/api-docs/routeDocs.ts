import fs = require('fs');

export default function generateRouteJSONs() {
  const files: string[] = fs.readdirSync(`${__dirname}/paths/`);
  const obj: Record<string, Record<string, any>> = {}
  for (const file of files) {
    obj[`/paths/${file.slice(0, file.length - 5)}`] = JSON.parse(fs.readFileSync(`${__dirname}/paths/${file}`, { encoding: 'utf8', flag: 'r' }));
  }
  return obj
}
