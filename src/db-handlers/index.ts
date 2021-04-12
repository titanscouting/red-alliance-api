import fs = require('fs')

const handlers = fs.readdirSync(__dirname).filter((file) => file.includes('.ts') && file !== 'index.ts')
