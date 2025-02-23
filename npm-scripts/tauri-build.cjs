const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const toml = require('@iarna/toml')

const projectRootPath = path.resolve(__dirname, '..')
const packageJsonFilePath = path.resolve(projectRootPath, 'package.json')
const tauriConfigJsonFilePath = path.resolve(projectRootPath, 'src-tauri/tauri.conf.json')
const cargoTomlFilePath = path.resolve(projectRootPath, 'src-tauri/Cargo.toml')
const tauriSigningPrivateKeyFilePath = path.resolve(projectRootPath, '~/.tauri/rbr-translator.key')
const tauriSigningPublicKeyFilePath = path.resolve(projectRootPath, '~/.tauri/rbr-translator.key.pub')
const bundleDirPath = path.resolve(projectRootPath, `src-tauri/target/release/bundle/nsis`)
const changelogDirPath = path.resolve(projectRootPath, 'changelog')
const latestJsonDirPath = path.resolve(projectRootPath, 'latest')
const now = new Date()

const TAURI_SIGNING_PRIVATE_KEY = process.env.TAURI_SIGNING_PRIVATE_KEY || fs.readFileSync(tauriSigningPrivateKeyFilePath).toString()
const TAURI_SIGNING_PUBLIC_KEY = process.env.TAURI_SIGNING_PUBLIC_KEY || fs.readFileSync(tauriSigningPublicKeyFilePath).toString()

const getVersion = (date) => {
  const year = date.getFullYear().toString().substring(2, 4)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const version = `0.${year}${month}${day}.${hour}${minute}${second}`
  return version
}
const updateJsonFileVersion = (filePath, version) => {
  const obj = JSON.parse(fs.readFileSync(filePath).toString())
  obj.version = version
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
}
const updateTomlFileVersion = (filePath, version) => {
  const obj = toml.parse(fs.readFileSync(filePath).toString())
  obj.package.version = version
  fs.writeFileSync(filePath, toml.stringify(obj))
}
const updateTauriConfigPublicKey = (publicKey) => {
  const obj = JSON.parse(fs.readFileSync(tauriConfigJsonFilePath).toString())
  obj.plugins.updater.pubkey = publicKey
  fs.writeFileSync(tauriConfigJsonFilePath, JSON.stringify(obj, null, 2))
}
const npmRunTauriBuild = () => {
  childProcess.execSync('npm run tauri build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      TAURI_SIGNING_PRIVATE_KEY
    }
  })
}
const getExeFileName = (version) => {
  return `rbr-translator_${version}_x64-setup.exe`
}
const getSigFileName = (version) => {
  return `${getExeFileName(version)}.sig`
}
const getTauriDistDirPath = (version) => {
  return path.resolve(projectRootPath, 'dist-tauri', version)
}
const moveTauriBuildFiles = (version) => {
  const tauriDistDirPath = getTauriDistDirPath(version)
  if (!fs.existsSync(tauriDistDirPath)) fs.mkdirSync(tauriDistDirPath, { recursive: true })
  const exeFileName = getExeFileName(version)
  const sigFileName = getSigFileName(version)
  fs.renameSync(path.resolve(bundleDirPath, exeFileName), path.resolve(tauriDistDirPath, exeFileName))
  fs.renameSync(path.resolve(bundleDirPath, sigFileName), path.resolve(tauriDistDirPath, sigFileName))
}
const getRFC3339DateStr = (date) => {
  const year = date.getUTCFullYear().toString().padStart(4, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = date.getUTCDate().toString().padStart(2, '0')
  const hour = date.getUTCHours().toString().padStart(2, '0')
  const minute = date.getUTCMinutes().toString().padStart(2, '0')
  const second = date.getUTCSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
}
const generateLatestJsonFile = (version) => {
  const tauriDistDirPath = getTauriDistDirPath(version)
  const signatureFilePath = path.resolve(tauriDistDirPath, getSigFileName(version))
  const signature = fs.readFileSync(signatureFilePath).toString()

  const versionInfo = {
    local: {
      version: version,
      notes: `http://localhost:11420/changelog/${version}.md`,
      pub_date: getRFC3339DateStr(now),
      platforms: {
        'windows-x86_64': {
          signature: signature,
          url: `http://localhost:11420/dist-tauri/${version}/${getExeFileName(version)}`
        }
      }
    },
    github: {
      version: version,
      notes: `https://github.com/xclhove/rbr-translator/raw/master/changelog/${version}.md`,
      pub_date: getRFC3339DateStr(now),
      platforms: {
        'windows-x86_64': {
          signature: signature,
          url: `https://github.com/xclhove/rbr-translator/releases/latest/download/${getExeFileName(version)}`
        }
      }
    },
    gitee: {
      version: version,
      notes: `https://gitee.com/xclhove/rbr-translator/raw/master/changelog/${version}.md`,
      pub_date: getRFC3339DateStr(now),
      platforms: {
        'windows-x86_64': {
          signature: signature,
          url: `https://gitee.com/xclhove/rbr-translator/releases/download/latest/${getExeFileName(version)}`
        }
      }
    }
  }
  for (const site in versionInfo) {
    const latestJsonFileName = `latest-${site}.json`
    const latestJsonFilePath = path.resolve(tauriDistDirPath, latestJsonFileName)
    fs.writeFileSync(latestJsonFilePath, JSON.stringify(versionInfo[site], null, 2))
  }
}
const moveLatestJsonFiles = (version) => {
  const tauriDistDirPath = getTauriDistDirPath(version)
  fs.readdirSync(tauriDistDirPath)
    .filter((fileName) => {
      return fileName.match(/^latest-.*\.json$/)
    })
    .forEach((fileName) => {
      fs.cpSync(path.resolve(tauriDistDirPath, fileName), path.resolve(latestJsonDirPath, fileName), {
        force: true
      })
    })
}
const generateChangelogFile = (version) => {
  if (!fs.existsSync(changelogDirPath)) fs.mkdirSync(changelogDirPath)
  const changelogFilePath = path.resolve(projectRootPath, `changelog/${version}.md`)
  const changelogContent = `# ${version}`
  fs.writeFileSync(changelogFilePath, changelogContent)
}

const version = getVersion(now)
updateJsonFileVersion(packageJsonFilePath, version)
updateJsonFileVersion(tauriConfigJsonFilePath, version)
updateTauriConfigPublicKey(TAURI_SIGNING_PUBLIC_KEY)
updateTomlFileVersion(cargoTomlFilePath, version)
npmRunTauriBuild()
moveTauriBuildFiles(version)
generateLatestJsonFile(version)
moveLatestJsonFiles(version)
generateChangelogFile(version)
