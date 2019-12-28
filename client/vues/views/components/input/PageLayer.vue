<template>
    <transition name="bottom-in">
        <div class="page-layer" v-show="isShow" v-no-scroll="isShow">
            <div class="flex page-layer-header" :class="{'need-border-bottom': needHeaderBorder}">
                <slot name="header">
                    <svg class="flex-fixed klook-symbol" @click="$emit('close')"><use :xlink:href="iconName"></use></svg>
                    <span class="flex-auto" >{{ title }}</span>
                    <input-button
                        type="border"
                        :disabled="navBtnDisabled"
                        @click="$emit('btnClick')"
                        v-if="navBtnText"
                        class="flex-fixed">
                        {{ navBtnText }}
                    </input-button>
                    <svg class="flex-fixed klook-symbol placeholder" v-else></svg>
                </slot>
            </div>
            <div class="page-layer-content">
                <slot></slot>
            </div>
            <div class="page-layer-footer" v-if="$slots.footer"><slot name="footer"></slot></div>
        </div>
    </transition>
</template>


<script>
import InputButton from './Button.vue';
import NoScroll from './no-scroll.js';


export default {
    name: 'PageLayer',
    directives: {
        'no-scroll': NoScroll
    },
    props: {
        releaseBody: {type: Boolean, default: true}, // 是不是单弹框   如果同时触发多个弹窗  需计算得来  用来关闭no-scroll指令
        isShow: { type: Boolean, default: true },
        title: { type: String},
        navBtnText: { type: String, default: '' },
        navBtnDisabled: { type: Boolean, default: false },
        iconName: { type: String, default: '#icon-close' },
        needHeaderBorder: { type: Boolean, default: true },
    },
    components: {
        InputButton
    }
}
</script>

<style lang="scss">
// 向上淡入显示
.bottom-in-enter, .bottom-in-leave-to{
    transform: translateY(100%);
}

.bottom-in-leave-active , .bottom-in-enter-active {
    transition: all .3s ease-in;
}
.page-layer {
    color: rgba(0, 0, 0, .87);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 99;
    flex-direction: column;
    display: flex;

    .flex {
        display: flex;
        align-items: center;
    }

    .flex-fixed {
        flex: 0 0 auto;
    }

    .flex-auto {
        flex: 1 1 auto;
    }

    &-header {
        padding: 0 16px;
        height: 48px;
        overflow: hidden;
        flex: 0 0 auto;

        &.need-border-bottom {
            box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.12);
        }

        svg {
            font-size: 24px;
        }

        span {
            text-align: center;
            font-weight: bold;
            margin: 0 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 16px;
            line-height: 24px;
        }

        button {
            height: 28px;
        }

        svg.placeholder {
            opacity: 0;
        }
    }

    &-content {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translate3d(0, 0, 0);
    }

    &-footer {
        flex: 0 0 auto;
        padding: 8px;
        background: #fff;
        display: flex;

        button {
            height: 44px;
        }
    }
}
</style>
