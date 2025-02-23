<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

const updateWindowOptions = (() => {
  const searchParams = new URLSearchParams(location.search)
  return {
    autoClose: searchParams.get('autoClose') === 'true'
  } as UpdateWindowOptions
})()

const closeCurrentWindow = () => {
  onTauriWebview(() => getCurrentWindow().close())
}
const requestCloseCurrentWindow = () => {
  if (updateWindowOptions.autoClose) {
    closeCurrentWindow()
    return true
  }
  return false
}

const currentVersion = localStorageRef('', 'currentVersion')
const latestVersion = localStorageRef('', 'latestVersion')
const updateAvailable = computed(() => {
  if (!currentVersion.value || !latestVersion.value) return false
  return currentVersion.value !== latestVersion.value
})
const updateRawJson = localStorageRef<UpdateRawJson>({} as UpdateRawJson, 'updateRawJson')
const newVersionInfoList = computed(() => {
  if (!updateRawJson.value) return []
  const list: (UpdatePlatformValue & { platform: string })[] = []
  for (const platform in updateRawJson.value.platforms) {
    const item = updateRawJson.value.platforms[platform]
    list.push({ platform, ...item })
  }
  return list
})
const checking = ref(false)
const checkUpdate = () => {
  checking.value = true
  check()
    .then((update) => {
      if (!update?.available) return requestCloseCurrentWindow()

      latestVersion.value = update.version
      updateChangelog(update.body || '')
      updateRawJson.value = update.rawJson as UpdateRawJson
      download = () => {
        downloading.value = true
        totalDownloadSize.value = 0
        currentDownloadSize.value = 0
        update
          .download(
            (event) => {
              if (event.event === 'Started') {
                showDownloadProgress.value = true
                totalDownloadSize.value = event.data.contentLength as number
              } else if (event.event === 'Progress') {
                currentDownloadSize.value += event.data.chunkLength as number
              } else if (event.event === 'Finished') {
                currentDownloadSize.value = totalDownloadSize.value
                showDownloadProgress.value = false
              }
            },
            {
              timeout: 15 * 1000
            }
          )
          .then(() => {
            ElMessage.success('下载成功')
            showInstall.value = true
            install = () => {
              update.install()
            }
            ElMessageBox.confirm(`是否立即安装？`, '下载完成', {
              cancelButtonText: '取消',
              confirmButtonText: '安装'
            })
              .then(install)
              .catch(() => {})
          })
          .catch((e) => {
            ElMessage.error('下载失败：' + e)
            throw e
          })
          .finally(() => {
            downloading.value = false
          })
      }

      if (isIgnoreCurrentVersion.value && requestCloseCurrentWindow()) return
      getCurrentWindow().show()
      getWindowByLabel('main').then((w) => w?.hide())
      ElMessageBox.confirm(`有新版本可用，是否立即下载？`, '是否立即下载？', {
        cancelButtonText: '取消',
        confirmButtonText: '开始'
      })
        .then(download)
        .catch(() => {})
    })
    .catch((e) => {
      ElMessage.error('检查更新失败')
      throw e
    })
    .finally(() => {
      checking.value = false
    })
}
const autoCheckUpdate = () => {
  if (!updateWindowOptions.autoClose) return
  if (enableAutoUpdate.value) return checkUpdate()
  getCurrentWindow().close()
}
const checkCurrentVersion = () => {
  getVersion().then((version) => {
    currentVersion.value = version
  })
}

// 更新日志
const changelog = localStorageRef('暂无更新日志', 'changelog')
const updateChangelog = (url: string) => {
  tauriFetch(url, {
    method: 'GET'
  })
    .then((res) => res.text())
    .then((text) => {
      changelog.value = text
    })
    .catch(() => {
      ElMessage.error('获取更新日志失败')
    })
}

// 开启自动更新
const enableAutoUpdate = localStorageRef(true, 'enableAutoUpdate')

// 忽略当前最新版本
const currentIgnoreVersion = localStorageRef('', 'ignoreVersion')
const isIgnoreCurrentVersion = computed(() => {
  if (!latestVersion.value) return true
  return currentIgnoreVersion.value === latestVersion.value
})
const ignoreCurrentLatestVersion = () => {
  ElMessageBox.confirm(`忽略当前版本：${latestVersion.value}`, '是否忽略当前版本？', {
    cancelButtonText: '取消',
    confirmButtonText: '确定'
  })
    .then(() => {
      currentIgnoreVersion.value = latestVersion.value
    })
    .catch(() => {})
}

// 下载
const showDownload = computed(() => {
  if (!currentVersion.value || !latestVersion.value) return false
  if (showInstall.value) return false
  return currentVersion.value !== latestVersion.value
})
const downloading = ref(false)
let download: MaybeNull<() => void> = null

// 安装
const showInstall = ref(false)
let install: MaybeNull<() => void> = null

// 下载进度
const totalDownloadSize = ref(0)
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
const currentDownloadSize = ref(0)
const showDownloadProgress = ref(false)
const downloadPercentage = computed(() => {
  if (currentDownloadSize.value === 0) return 0
  return Math.ceil((currentDownloadSize.value / totalDownloadSize.value) * 100)
})
const formatPercentageText = (percentage: number) => {
  return `${formatBytes(currentDownloadSize.value)}/${formatBytes(totalDownloadSize.value)} (${percentage}%)`
}

onTauriWebview(() => {
  const currentWindow = getCurrentWindow()
  currentWindow.once('tauri://close-requested', async () => {
    const mainWindow = await getWindowByLabel('main')
    await mainWindow?.show()
    await currentWindow.close()
  })

  const unListener = currentWindowAutoSizeFromElement(null, (newSize) => {
    const newHeight = Math.min(800, newSize.height)
    return {
      width: newSize.width,
      height: newHeight
    }
  })
  onUnmounted(unListener)

  onMounted(() => {
    checkCurrentVersion()
    autoCheckUpdate()
  })
})
</script>

<template>
  <div class="flex flex-col justify-start items-start w-full p-1.5">
    <!--版本信息-->
    <el-descriptions :column="1" border>
      <el-descriptions-item label-width="80">
        <template #label><el-text class="whitespace-nowrap">当前版本</el-text></template>
        <el-text v-if="currentVersion" :type="updateAvailable ? 'info' : 'success'">{{ currentVersion }}</el-text>
        <el-text v-else>未知</el-text>
      </el-descriptions-item>
      <el-descriptions-item label-width="80">
        <template #label><el-text class="whitespace-nowrap">最新版本</el-text></template>
        <el-text v-if="latestVersion" :type="updateAvailable ? 'success' : 'info'">{{ latestVersion }}</el-text>
        <el-text v-else>未知</el-text>
      </el-descriptions-item>
      <el-descriptions-item v-show="newVersionInfoList.length > 0">
        <template #label><el-text class="whitespace-nowrap">下载地址</el-text></template>
        <el-descriptions :column="1" border>
          <el-descriptions-item v-for="newVersionInfo in newVersionInfoList" :key="newVersionInfo.platform">
            <template #label>
              <el-text class="whitespace-nowrap">{{ newVersionInfo.platform }}</el-text>
            </template>
            <el-text style="width: 300px">
              {{ newVersionInfo.url }}
            </el-text>
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
    </el-descriptions>

    <!--检查更新-->
    <div class="mt-1 flex flex-row items-center">
      <el-text>检查更新：</el-text>
      <el-switch v-model="enableAutoUpdate" inline-prompt active-text="已开启" inactive-text="已关闭" size="large"></el-switch>
    </div>

    <!--changelog-->
    <div class="border rounded mb-1 max-h-96 overflow-hidden">
      <el-scrollbar :max-height="96 * 4">
        <VditorPreview :content="changelog"></VditorPreview>
      </el-scrollbar>
    </div>

    <!--下载进度-->
    <Transition>
      <el-progress
        class="w-full"
        v-show="showDownloadProgress"
        :text-inside="true"
        :stroke-width="26"
        :percentage="downloadPercentage"
        :format="formatPercentageText"
      />
    </Transition>

    <!--下载更新-->
    <Transition>
      <el-button
        type="success"
        v-show="showDownload"
        class="w-full self-end mt-1"
        :disabled="downloading"
        :loading="downloading"
        @click="download?.()"
      >
        下载更新
      </el-button>
    </Transition>

    <!--忽略当前版本-->
    <Transition>
      <el-button type="warning" v-show="!isIgnoreCurrentVersion" class="w-full self-end mt-1" @click="ignoreCurrentLatestVersion">
        忽略当前版本
      </el-button>
    </Transition>

    <!--立即安装-->
    <Transition>
      <el-button type="primary" v-show="showInstall" class="w-full self-end mt-1" @click="install?.()">立即安装</el-button>
    </Transition>

    <!--检查更新-->
    <el-button class="w-full self-end mt-1" :disabled="checking" :loading="checking" @click="checkUpdate">检查更新</el-button>
  </div>
</template>

<style scoped lang="less">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
