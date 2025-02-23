<script setup lang="ts">
import Vditor from 'vditor/dist/method'
import 'vditor/src/assets/less/index.less'

type VditorPreviewProps = {} & Partial<{
  content: string
  width: number
  height: number
}>
const props = withDefaults(defineProps<VditorPreviewProps>(), {
  content: '',
  width: 0,
  height: 0,
})

const markdownRef = ref<HTMLDivElement>()
const render = (text: string) => {
  Vditor.preview(markdownRef.value as HTMLDivElement, text, {
    cdn: `/vditor`,
    mode: 'light',
  })
}
watch(
  () => props.content,
  () => {
    render(props.content)
  },
)
onMounted(() => {
  render(props.content)
})

// 复制时提示
onMounted(() => {
  const listener = (_event: ClipboardEvent) => {
    ElMessage.success('复制成功')
  }
  markdownRef.value?.addEventListener('copy', listener)

  onMounted(() => {
    markdownRef.value?.removeEventListener('copy', listener)
  })
})

const boxRef = ref<HTMLDivElement>()
const updateSize = () => {
  if (!boxRef.value) return
  if (props.width > 0) {
    boxRef.value.style.width = `${props.width}px`
  }
  if (props.height > 0) {
    boxRef.value.style.height = `${props.height}px`
  }
}
onMounted(updateSize)
watch([() => props.width, () => props.height], updateSize)
</script>

<template>
  <div ref="boxRef" class="vditor-preview">
    <div ref="markdownRef" class="preview-content"></div>
  </div>
</template>

<style scoped>
.vditor-preview {
  height: 100%;
  width: 100%;
  position: relative;
}

.vditor-preview .preview-content {
  height: 100%;
  width: 100%;
}
</style>
