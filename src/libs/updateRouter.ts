import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const pages = import.meta.glob('../update-pages/**/*.vue', {
  eager: true,
  import: 'default',
})
const routes = Object.entries(pages).map(([path, component]) => {
  path = path.replace(/^.*\/update-pages/, '')
  path = path.replace(/\.vue$/, '')
  path = path.replace('index', '')
  path = path.replace(/\/+/, '/')
  path = `/update${path}`

  return {
    path: `${path}`,
    component: component,
  } as RouteRecordRaw
})

const updateRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default updateRouter
