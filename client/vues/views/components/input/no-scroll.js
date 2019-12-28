/*
增加 vue 自定义指令，解决 mobile web 浮层滚动穿透问题。
 */

function fix() {
    if (document.body.style.position !== 'fixed') {
        //window.pageYOffset（只读） 兼容性最佳，其他比如 window.scrollY document.body.scrollTop 读取会有兼容性问题，详情见 MDN docs
        this.fixScrollY = window.pageYOffset;
        // position fixed 防止滚动穿透
        document.body.style.position = 'fixed';
        //body fixed 后保持 body 滚动位置
        document.body.style.top = -this.fixScrollY + 'px';
    }
}

function noFix() {
    if (this.$parent && !this.$parent.$parent || !this.$parent || this.releaseBody) {
        //恢复 body position
        document.body.style.position = 'static';
        //改变 position 重新恢复 scrollTop
        document.body.scrollTop = this.fixScrollY; // For Safari
        document.documentElement.scrollTop = this.fixScrollY; // For Chrome, Firefox, IE and Opera
    }
}


const directive = {
    bind(el, {value}, vnode) {
        if (value) {
            fix.apply(vnode.context);
        }
    },
    update(el, {value, oldValue}, vnode) {
        if (value !== oldValue) {
            if (value) {
                fix.apply(vnode.context);
            } else {
                noFix.apply(vnode.context);
            }
        }
    },
    unbind(el) {
    }
};

export default directive;