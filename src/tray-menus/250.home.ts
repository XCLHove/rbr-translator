export default defineTrayMenu({
  text: '主页',
  action() {
    getWindowByLabel('main').then((w) => w?.show())
  }
})
