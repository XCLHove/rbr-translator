import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const pages = import.meta.glob('../pages/**/*.vue', {
  eager: true,
  import: 'default',
})
const routes = Object.entries(pages).map(([path, component]) => {
  path = path.replace(/^.*\/pages/, '')
  path = path.replace(/\.vue$/, '')
  path = path.replace('index', '')
  path = path.replace(/\/+/, '/')

  return {
    path: `${path}`,
    component: component,
  } as RouteRecordRaw
})

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
