const path = require('path')
const fs = require("fs");

const projectRootPath = path.resolve(__dirname, '..')
const tauriConfigSchemaPath = path.resolve(projectRootPath, 'src-tauri/tauri.config.schema.json')

if (!fs.existsSync(tauriConfigSchemaPath)) {
    fs.writeFileSync(tauriConfigSchemaPath, JSON.stringify({}, null, 4))
}

fetch('https://schema.tauri.app/config/2')
  .then((response) => response.text())
  .then((text) => JSON.parse(text))
  .then((object) => JSON.stringify(object, null, 4))
  .then((jsonStr) => {
    fs.writeFileSync(tauriConfigSchemaPath, jsonStr)
    console.log('success')
  })
  .catch((error) => console.error(error))
