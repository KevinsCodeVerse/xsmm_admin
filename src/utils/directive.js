export const amountValidation = {
    inserted(el) {
        el.addEventListener('keydown', (event) => {
            const input = event.target;
            const value = input.value;

            // 按键码为 190（小数点）时，检查小数点是否已存在
            if (event.keyCode === 190 && value.includes('.')) {
                event.preventDefault();
                return;
            }

            // 按键码为 110（小键盘小数点）时，检查小数点是否已存在
            if (event.keyCode === 110 && value.includes('.')) {
                event.preventDefault();
                return;
            }

            // 允许输入数字、小数点、删除按键和退格按键
            if (
                !(
                    event.key.match(/^\d$/) ||
                    event.key === '.' ||
                    event.key === 'Delete' ||
                    event.key === 'Backspace'
                )
            ) {
                event.preventDefault();
                return;
            }
        });

        el.addEventListener('input', (event) => {
            const input = event.target;
            const value = input.value;
            const strippedValue = value.replace(/,/g, '');

            // 验证金额格式
            const isValid = /^\d+(\.\d{1,2})?$/.test(strippedValue);
            if (!isValid) {
                // 如果金额格式不正确，清空输入框
                input.value = '';
            }
        });
    },
};
