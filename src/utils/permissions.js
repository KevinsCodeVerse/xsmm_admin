// 导入Vue
import Vue from 'vue';

// 定义全局指令对象
const globalDirectives = {
    // 自定义权限指令
    permission: {
        inserted: function (el, binding) {
            // 获取用户权限
            const userPermissions = getUserPermissions(); // 这里需要根据具体的权限管理方式获取用户权限
            // 获取绑定到指令的权限值
            const requiredPermission = binding.value;

            // 检查用户权限是否包含所需权限
            if (!userPermissions.includes(requiredPermission)) {
                // 如果用户没有权限，隐藏按钮
                el.style.display = 'none';
            }
        }
    },

    // 其他全局指令...
};

// 注册全局指令
Object.keys(globalDirectives).forEach((directive) => {
    Vue.directive(directive, globalDirectives[directive]);
});

// 导出全局指令对象
export default globalDirectives;
