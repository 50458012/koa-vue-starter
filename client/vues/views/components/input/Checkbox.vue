<template>
    <div :class="uiClass" @click="toggle">
        <span class="ui-wrapper">
            <span class="input-checkbox-ui"></span>
        </span>
        <span class="input-checkbox-label"><slot></slot></span>
    </div>
</template>

<script>
export default {
    name: 'Checkbox',
    props: {
        value: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false }
    },
    computed: {
        uiClass() {
            return {
               'input-checkbox': true,
               'input-checkbox--checked': this.value,
               'input-checkbox--disabled': this.disabled
            };
        }
    },
    methods: {
        toggle() {
            if (this.disabled) {
                return ;
            }
            this.$emit('input', !this.value);
        }
    }
}
</script>


<style lang="scss">
$grayColor: rgba(0, 0, 0, .54);
$primaryTextColor: rgba(0, 0, 0, .87);
$borderColor: rgba(0, 0, 0, .12);
$primaryColor: #ff5722;

.input-checkbox {
    display: inline-flex;
    align-items: center;
    
    .ui-wrapper {
        padding: 3px;
        margin-right: 16px;
        font-size: 0;
    }

    &-ui {
        width: 18px;
        height: 18px;
        border-radius: 3px;
        border: 1px solid $grayColor;
        background: #fff;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
    }

    &-label {
        color: $primaryTextColor;
        font-size: 16px;
    }

    &--checked {

        .input-checkbox-ui {
            border: none;
            background: $primaryColor;

            &::after {
                width: 12px;
                height: 6px;
                border-color: #fff;
                border-style: solid;
                border-width: 0 0 2px 2px;
                transform: rotate(-45deg);
                content: '';
                position: absolute;
                top: 4px;
                left: 2px;
                border-radius: 1px;
            }
        }
    }

    &--partial {

        .input-checkbox-ui {
            border: none;
            background: $primaryColor;

            &::after {
                width: 12px;
                height: 2px;
                background: #fff;
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 1px;
            }
        }
    }

    &--disabled {
        .input-checkbox-ui {
            border-color: $borderColor;
        }

        .input-checkbox-label {
            color: rgba(0, 0, 0, .24);
        }
    }
}
</style>


