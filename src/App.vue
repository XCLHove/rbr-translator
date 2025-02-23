<script setup lang="ts">
// 禁止选中文字
onMounted(() => {
  document.addEventListener('selectstart', preventDefaultListener)
  onUnmounted(() => document.removeEventListener('selectstart', preventDefaultListener))
})

// 禁止右键
onMounted(() => {
  document.addEventListener('contextmenu', preventDefaultListener)
  onUnmounted(() => document.removeEventListener('contextmenu', preventDefaultListener))
})

// 透明度
const opacity = ref(0.4)
watchEffect(() => {
  document.body.style.background = `rgba(0, 0, 0, ${opacity.value})`
})

onTauriWebview(() => {
  const currentWindow = getCurrentWindow()

  // 拖动元素以移动当前窗口
  onUnmounted(dragElementToMoveCurrentWindow())

  // 窗口大小根据元素自适应
  onUnmounted(currentWindowAutoSizeFromElement())

  // 消除白边
  onMounted(async () => {
    const size = await currentWindow.outerSize()
    const newSize = new PhysicalSize(size.width + 1, size.height)
    await currentWindow.setSize(newSize)
    await currentWindow.setSize(size)
  })

  // 页面加载完成后显示窗口
  getCurrentWindow().show()

  notification({
    title: '提示',
    body: 'Ctrl+Shift+R 隐藏/显示主窗口'
  })
})
</script>

<template>
  <router-view />
</template>

<style lang="less">
body {
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

  #app {
    border: 1px solid var(--el-color-danger);
    border-radius: 3px;
  }
}
</style>
