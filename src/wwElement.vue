<template>
    <div
        class="navigation-menu"
        :style="navigationStyle"
        ww-responsive="navigation-menu"
        :class="{ editing: isEditing }"
    >
        <wwLayout
            class="navigation-menu__items"
            :class="{ '-pushLast': !!content.pushLast }"
            path="elements"
            ww-responsive="menu-layout"
            :style="layoutStyle"
            direction="row"
        ></wwLayout>
        <input
            v-show="useMobileMenu"
            id="hidden-trigger"
            type="checkbox"
            :checked="displayForEdition"
            :disabled="isEditing"
            :class="{ disabled: isEditing }"
            ww-responsive="menu-hidden-trigger"
        />
        <label v-show="useMobileMenu" id="trigger-wrapper" for="hidden-trigger" ww-responsive="menu-trigger-label">
            <div
                class="navigation-menu__trigger open-trigger"
                :class="{ 'keep-visible': !content.closeTrigger }"
                ww-responsive="menu-button"
            >
                <wwElement v-bind="content.button"></wwElement>
            </div>

            <div
                v-if="content.closeTrigger"
                class="navigation-menu__trigger close-trigger"
                ww-responsive="menu-button-close"
            >
                <wwElement
                    class="closeElement"
                    :class="{ editing: isEditing }"
                    v-bind="content.closeElement"
                ></wwElement>
            </div>
        </label>

        <div
            v-show="useMobileMenu"
            class="navigation-menu__backdrop"
            ww-responsive="backdrop"
            :style="{ '--menu-top': content.menuTopOrigin, backgroundColor: content.backdropColor }"
        ></div>
        <div v-show="useMobileMenu" class="navigation-menu__container">
            <div
                class="navigation-menu__panel"
                :class="[content.menuType, { full: content.fullHeight }]"
                ww-responsive="panel"
                :style="navigationPanelStyle"
            >
                <wwLayout
                    class="navigation-menu__panel-items"
                    :class="{ '-pushLast': !!content.pushLast }"
                    path="elements"
                >
                </wwLayout>
            </div>
        </div>
        <!-- wwEditor:start -->
        <div class="navigation-menu__bubble">
            <wwEditorIcon small name="menu"></wwEditorIcon>
        </div>
        <!-- wwEditor:end -->
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content'],
    computed: {
        displayForEdition() {
            /* wwEditor:start */
            return this.wwEditorState.sidepanelContent.displayForEdition && this.isEditing;
            /* wwEditor:end */
            return false;
        },
        useMobileMenu() {
            if (this.content.menuBreakpoint === 'laptop') return true;
            if (this.content.menuBreakpoint === 'tablet')
                return this.wwFrontState.screenSize === 'mobile' || this.wwFrontState.screenSize === 'tablet';
            return this.wwFrontState.screenSize === 'mobile';
        },
        navigationStyle() {
            if (this.useMobileMenu) return { 'justify-content': 'flex-end' };
            else return { 'justify-content': 'unset' };
        },
        layoutStyle() {
            return {
                justifyContent: this.content.horizontalAlignement,
                alignItems: this.content.verticalAlignement,
                display: this.useMobileMenu ? 'none' : 'flex',
            };
        },
        navigationPanelStyle() {
            return {
                '--menu-size': this.content.menuType === 'dropdown' ? '100%' : this.content.menuSize,
                '--menu-top': this.content.menuTopOrigin,
                'background-color': this.content.backgroundColor,
            };
        },
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
    },
    watch: {
        'content.triggerType'(newVal) {
            this.updateTriggerType(newVal);
        },
        'content.closeTrigger'(newVal) {
            if (newVal) {
                this.handleCloseElement();
            } else {
                this.$emit('update:content', { closeElement: null });
            }
        },
    },
    methods: {
        async updateTriggerType(type) {
            let triggerElement, closeElement;

            switch (type) {
                case 'button':
                    triggerElement = await wwLib.createElement(
                        'ww-button',
                        { text: 'Open menu' },
                        {},
                        this.wwFrontState.sectionId
                    );
                    this.$emit('update:content', { button: triggerElement });

                    if (this.content.closeTrigger) {
                        closeElement = await wwLib.createElement(
                            'ww-button',
                            { text: 'Close menu' },
                            {},
                            this.wwFrontState.sectionId
                        );
                        this.$emit('update:content', { closeElement });
                    }
                    break;
                case 'icon':
                    triggerElement = await wwLib.createElement(
                        'ww-icon',
                        { icon: 'fas fa-bars' },
                        {},
                        this.wwFrontState.sectionId
                    );
                    this.$emit('update:content', { button: triggerElement });

                    if (this.content.closeTrigger) {
                        closeElement = await wwLib.createElement(
                            'ww-icon',
                            { icon: 'fas fa-times' },
                            {},
                            this.wwFrontState.sectionId
                        );
                        this.$emit('update:content', { closeElement });
                    }
                    break;
                case 'image':
                    triggerElement = await wwLib.createElement(
                        'ww-image',
                        { url: 'https://cdn.weweb.io/public/images/no_preview.jpg' },
                        { style: { default: { width: '30px', height: '30px' } } },
                        this.wwFrontState.sectionId
                    );
                    this.$emit('update:content', { button: triggerElement });

                    if (this.content.closeTrigger) {
                        closeElement = await wwLib.createElement(
                            'ww-image',
                            { url: 'https://cdn.weweb.io/public/images/no_preview.jpg' },
                            { style: { default: { width: '30px', height: '30px' } } },
                            this.wwFrontState.sectionId
                        );
                        this.$emit('update:content', { closeElement });
                    }
                    break;

                default:
                    break;
            }
        },
        async handleCloseElement() {
            let closeElement;

            switch (this.content.triggerType) {
                case 'button':
                    closeElement = await wwLib.createElement('ww-button', {}, {}, this.wwFrontState.sectionId);
                    this.$emit('update:content', { closeElement });
                    break;
                case 'icon':
                    closeElement = await wwLib.createElement('ww-icon', {}, {}, this.wwFrontState.sectionId);
                    this.$emit('update:content', { closeElement });
                    break;
                case 'image':
                    closeElement = await wwLib.createElement('ww-image', {}, {}, this.wwFrontState.sectionId);
                    this.$emit('update:content', { closeElement });
                    break;

                default:
                    break;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
:root {
    --menu-size: 60%;
    --menu-top: 0px;
}

.navigation-menu {
    position: relative;
    display: flex;

    #trigger-wrapper {
        z-index: 12;
    }

    input:not(:checked) ~ label {
        .open-trigger {
            display: block;
        }
        .close-trigger {
            display: none;
        }
    }

    input:checked ~ label {
        .open-trigger {
            display: none;
            &.keep-visible {
                display: block;
            }
        }
        .close-trigger {
            display: block;
        }
    }

    input {
        width: 0px;
        height: 0px;
        margin: 0px;
        opacity: 0;
        &.disabled {
            pointer-events: none;
        }
    }

    input:checked {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 10;
    }

    &__trigger {
        min-width: 10px;
        min-height: 10px;
        z-index: 11;
    }

    &__items {
        display: flex;
        flex: 1;
    }

    &__panel-items {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    &__panel {
        overflow: visible;
        pointer-events: all;
        z-index: 10;
        width: var(--menu-size);
        &.right,
        &.left {
            position: fixed;
            top: var(--menu-top);
            transition: transform 0.3s ease;
            &.full {
                height: calc(100vh - var(--menu-top));
                overflow-y: auto;
            }
        }
        &.right {
            right: 0;
            transform: translate(100%, 0);
        }
        &.left {
            left: 0;
            transform: translate(-100%, 0);
        }
        &.dropdown {
            position: fixed;
            right: 0;
            left: 0;
            top: var(--menu-top);
            transition: opacity 0.3s ease;
            pointer-events: none;
            visibility: hidden;
        }
        min-width: 30px;
        background: white;

        overflow-y: auto;
        overflow: -moz-scrollbars-none;
        &::-webkit-scrollbar {
            width: 0 !important;
        }
    }

    &__backdrop {
        z-index: 10;
        position: fixed;
        top: var(--menu-top);
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
        height: calc(100% - var(--menu-top));

        input:checked ~ & {
            opacity: 1;
        }
    }

    &__container {
        z-index: 11;
        position: fixed;
        top: var(--menu-top);
        left: 0;
        right: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
        height: calc(100vh - var(--menu-top));

        input:checked ~ & {
            opacity: 1;

            & .dropdown {
                pointer-events: all;
                visibility: visible;
            }
            & .right {
                transform: translate(0, 0);
            }
            & .left {
                transform: translate(0, 0);
            }
        }
    }
    &__bubble {
        display: flex;
        position: absolute;
        top: 5px;
        left: 0;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        padding: var(--ww-spacing-01);
        transition: opacity 0.2s ease;
        z-index: 101;
        opacity: 0;
        cursor: pointer;
        background-color: var(--ww-color-green-500);
        color: var(--ww-color-white);
        justify-content: center;
        align-items: center;
        pointer-events: none;
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 30px;
            height: 30px;
        }
    }
    &.editing:hover {
        > .navigation-menu__bubble {
            opacity: 1;
            pointer-events: all;
        }
    }
}
</style>

<style lang="scss">
.navigation-menu {
    &__items {
        &.-pushLast > .ww-layout-item:last-child {
            margin-left: auto;
        }
    }

    &__panel-items {
        &.-pushLast > .ww-layout-item:last-child {
            margin-top: auto;
        }
    }
}
</style>
