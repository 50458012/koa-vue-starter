<template>
    <button class="input-btn" :class="btnClass" @click="onClick">
        <svg class="klook-symbol" v-if="icon"><use :xlink:href="icon"></use></svg>
        <slot></slot>
    </button>
</template>


<script>
/**
 * 三种类型：primary, border, text
 * 三种高度大小：48px 36px 28px
 */
export default {
    name: 'InputButton',
    props: {
        disabled: { type: Boolean, default: false },
        type: { type: String, default: '' },
        icon: { type: String, default: '' },
    },
    computed: {
        btnClass() {
            return {
                'input-btn-disabled': this.disabled,
                [`input-btn-${this.type}`]: this.type
            };
        }
    },
    methods: {
        onClick(event) {
            if (this.disabled) {
                event.preventDefault();
                event.stopPropagation();
                return ;
            }
            this.$emit('click');
        }
    }
}
</script>


<style lang="scss">
$primaryColor: #ff5722;

.input-btn {
    display: flex;
    border: none;
    outline: none;
    border-radius: 2px;
    -webkit-tap-highlight-color: transparent;
    padding: 0;
    margin: 0;
    align-items: center;
    height: 48px;
    justify-content: center;
    box-sizing: border-box;
    font-size: 16px;
    flex: 1 1 auto;

    &-primary {
        background: $primaryColor;
        color: #fff;
        font-weight: bold;
    }

    &-border {
        border: 1px solid rgba(0, 0, 0, .87);
        background: transparent;
        color: rgba(0, 0, 0, .87);
        padding: 0 16px;
    }

    &-text {
        font-size: 14px;
        height: 36px;
        line-height: 1.29;
        color: #00699e;
    }
}
.input-btn-primary.input-btn-disabled {
    background: #d1d1d1;
    color: rgba(255, 255, 255, .8);
}

.input-btn-border.input-btn-disabled {
    border-color: rgba(0, 0, 0, .24);
    color: rgba(0, 0, 0, .24);
}
.input-btn.text.input-btn-disabled {
    color: rgba(0, 0, 0, .24);
}
</style>


