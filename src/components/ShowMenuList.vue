<script setup lang="ts">
type ShowMenuListProps = {
  data: RbrMenu[];
};
const props = withDefaults(defineProps<ShowMenuListProps>(), {
  data: () => [],
});
</script>

<template>
  <div class="show-menu-list">
    <div
      v-for="(menu, index) in data"
      :key="index"
      :class="{
        'menu-item': true,
        'button-hover-font': true,
        'button-hover-bg': !menu.isFinalPage,
        'border-button': !menu.isFinalPage,
      }"
      @click="menu.onClick"
    >
      <el-tooltip v-if="menu.description" :content="menu.description">
        <el-text class="whitespace-nowrap" type="danger">
          <span v-text="menu.en"></span>
          <span class="split">-</span>
          [<el-text type="success"><span v-text="menu.zh"></span></el-text>]
        </el-text>
      </el-tooltip>

      <el-text v-else class="whitespace-nowrap" type="danger">
        <span v-text="menu.en"></span>
        <span class="split">-</span>
        [<el-text type="success"><span v-text="menu.zh"></span></el-text>]
      </el-text>
    </div>
  </div>
</template>

<style scoped lang="less">
.show-menu-list {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 5px;

  * {
    font-weight: bold;
    font-size: 16px;
  }

  .menu-item {
    display: flex;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    margin: 1px 0;

    .nowrap * {
      white-space: nowrap;
      overflow: hidden;
    }

    .split {
      margin: 0 5px;
    }
  }

  .button-hover-bg {
    &:hover {
      background-color: #b22a2b;
    }
  }

  .button-hover-font {
    &:hover {
      * {
        color: #fff;
      }
    }
  }

  .border-button {
    border: var(--el-border);
  }
}
</style>
