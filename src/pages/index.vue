<script setup lang="ts">
const menus = import.meta.glob('./*.menu.ts', {
  eager: true,
  import: 'default',
})

const _menuList = Object.entries(menus).map(([path, _menu]) => {
  const menu = _menu as ReturnType<typeof defineMenu>

  if (menu.onClick) {
    return menu
  }

  if (menu.isFinalPage) {
    menu.onClick = () => {
      ElMessage({
        type: 'warning',
        message: '无内容',
        duration: 1000,
      })
    }
    return menu
  }

  if (path.endsWith('back.menu.ts')) {
    menu.onClick = () => {
      router.back()
    }
    return menu
  }

  path = path.replace(/\.menu\.ts$/, '')
  path = path.replace(/.*\//, '')
  path = path.replace(/^[0-9]*\./, '')
  path = `${router.currentRoute.value.path}/${path}`
  path = path.replace(/\/+/, '/')
  menu.onClick = () => {
    router.push(path)
  }
  return menu
})
const menuList = ref(_menuList)
</script>

<template>
  <div>
    <show-menu-list :data="menuList" />
  </div>
</template>

<style scoped></style>
