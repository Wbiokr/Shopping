/* eslint-disable */

/**
 *
 * @param e
 * @param arg_opts
 * @returns {boolean}
 */
export function effectRipple(e, arg_opts) {
    let opts = Object.assign({
            ele: e.target, // 波紋作用元素
            type: 'hit', // hit點擊位置擴散　center中心點擴展
            bgc: 'rgba(0, 0, 0, 0.15)' // 波紋顏色
        }, arg_opts),
        target = opts.ele;
    if (target) {
        let rect = target.getBoundingClientRect(),
            ripple = target.querySelector('.e-ripple');
        if (!ripple) {
            ripple = document.createElement('span');
            ripple.className = 'e-ripple';
            ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
            target.appendChild(ripple);
        } else {
            ripple.className = 'e-ripple';
        }
        switch (opts.type) {
            case 'center':
                ripple.style.top = (rect.height / 2 - ripple.offsetHeight / 2) + 'px';
                ripple.style.left = (rect.width / 2 - ripple.offsetWidth / 2) + 'px';
                break;
            default:
                ripple.style.top = (e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop) + 'px';
                ripple.style.left = (e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft) + 'px';
        }
        ripple.style.backgroundColor = opts.bgc;
        ripple.className = 'e-ripple z-active';
        return false;
    }
}
// database64文件格式轉換為2進制
/**
 *
 * @param data
 * @param mime
 * @returns {*}
 */
export function data2blob(data, mime) {
    // dataURL 的格式為 “data:image/png;base64,****”,逗號之前都是一些說明性的文字，我們只需要逗號之後的就行了
    data = data.split(',')[1];
    data = window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    }
    // canvas.toDataURL 返回的默認格式就是 image/png
    return new Blob([ia], {type: mime});
};
