const path = require('path')
const fs = require('fs')

const projectRootPath = path.resolve(__dirname, '..')
const autoImportsFilePath = path.join(projectRootPath, 'src/types/auto-imports.d.ts')
const componentsFolderPath = path.join(projectRootPath, 'src/types/components.d.ts')

if (fs.existsSync(autoImportsFilePath)) fs.unlinkSync(autoImportsFilePath)
if (fs.existsSync(componentsFolderPath)) fs.unlinkSync(componentsFolderPath)
