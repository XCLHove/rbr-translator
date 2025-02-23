export interface RbrMenu {
  /**
   * 英文
   */
  en: string;
  /**
   * 中文
   */
  zh: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 点击事件
   */
  onClick?: () => void;
  /**
   * onClick 未配置时此项为才生效<br>
   * true：onClick 不执行页面跳转<br>
   * false：onClick 执行页面跳转
   */
  isFinalPage?: boolean;
}

const defineMenu = (menu: RbrMenu) => menu;

export default defineMenu;
