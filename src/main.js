import Vue from 'vue'
import App from './App.vue'
import "@babel/polyfill"; // 配置ie兼容
import router from '@/router'
import store from '@/store'
import axios from '@/config/http'
import pubsub from 'pubsub-js' // js 消息
import envConfig from '@/config/envConfig' // 环境参数配置
import appConfig from '@/config/appConfig' // 环境参数配置
import moment from 'moment' // moment 时间操作工具
import * as filters from '@/config/filtersConfig' // 过滤器
import request from '@/utils/request' // 请求工具类
import common from '@/utils/common' // 常用工具
import './assets/fonts/icon.css' // 自定义 svg转font字体样式
// element-ui
import '@/plugins/element/element.js'
// import ElementUI from 'element-ui' // element-ui 组件库
// import '@/assets/scss/element-variables.scss' // 自定义 element-ui 主题
// import { initThemeColor } from '@/utils/themeColorClient' // 动态切换主题色
import routerUtil from '@/router/routerUtil' // 动态路由
import message from './utils/message'
import MainHead from "./components/models/MainHead";
import MainContent from "./components/models/MainContent";
import ImgCutter from 'vue-img-cutter';
import 'default-passive-events'
import globalDirectives from './utils/permissions';
import {amountValidation} from './utils/directive'
// 注册全局指令
Object.keys(globalDirectives).forEach((directive) => {
	Vue.directive(directive, globalDirectives[directive]);
});
Vue.component('ImgCutter', ImgCutter);
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// 在 Vue 中注册导入的指令
Vue.directive('amount', amountValidation);
Vue.directive('loadmore', {
	bind(el, binding) {
		const selectWrap = el.querySelector('.el-table__body-wrapper')
		selectWrap.addEventListener('scroll', function () {
			let sign = 3
			const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
			if (Math.ceil(scrollDistance) <= sign) {
				binding.value()
			}
		})
	},
})
Vue.use(VXETable)

import qs from 'qs'
Vue.prototype.$qs = qs

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})
// 主题换肤
// initThemeColor();
Vue.component('main-head', MainHead)
Vue.component('main-content', MainContent)
// Vue.use(ElementUI)
Vue.prototype.$envConfig = envConfig
Vue.prototype.$appConfig = appConfig
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$request = request
Vue.prototype.$common = common
Vue.prototype.$pubsub = pubsub
Vue.prototype.$message = message
Vue.config.productionTip = false
// 给 vue 实例挂载内部对象，例如：
// Vue.prototype.$XModal = VXETable.modal
// Vue.prototype.$XPrint = VXETable.print
// Vue.prototype.$XReadFile = VXETable.readFile


window.addEventListener('popstate', function(e) {
	router.isBack = true
})

// 动态路由初始化
routerUtil.init()

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
