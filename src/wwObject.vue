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

        <button
            v-if="content.triggerType !== 'button' && displayOpenTrigger"
            class="navigation-menu__trigger"
            :style="iconStyle"
            @click="triggerToggle"
        >
            <wwObject v-bind="content.button" ww-responsive="menu-button"></wwObject>
        </button>
        <div
            v-else-if="content.triggerType === 'button' && displayOpenTrigger"
            class="navigation-menu__trigger"
            :style="iconStyle"
            @click="triggerToggle"
        >
            <wwObject v-bind="content.button" ww-responsive="menu-button"></wwObject>
        </div>

        <button
            v-if="content.triggerType !== 'button' && displayCloseTrigger"
            class="navigation-menu__trigger"
            :style="iconStyle"
            @click="triggerToggle"
        >
            <wwObject
                class="closeElement"
                :class="{ editing: isEditing }"
                v-bind="content.closeElement"
                ww-responsive="menu-button"
            ></wwObject>
        </button>
        <div
            v-else-if="content.triggerType === 'button' && displayCloseTrigger"
            class="navigation-menu__trigger"
            :style="iconStyle"
            @click="triggerToggle"
        >
            <wwObject
                class="closeElement"
                :class="{ editing: isEditing }"
                v-bind="content.closeElement"
                ww-responsive="menu-button"
            ></wwObject>
        </div>

        <div
            v-show="isMenuDisplayed"
            class="navigation-menu__backdrop"
            :class="{ open: isOpen }"
            :style="{ backgroundColor: content.backdropColor }"
            @click.prevent.stop="triggerToggle"
        ></div>
        <div v-show="isMenuDisplayed" class="navigation-menu__container" :class="{ open: isOpen }">
            <div
                class="navigation-menu__panel"
                :class="[content.menuType, { full: content.fullHeight }]"
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
/* wwEditor:start */
import { getSettingsConfigurations } from './configuration';
/* wwEditor:end */

export default {
    wwDefaultContent: {
        elements: [
            { isWwObject: true, type: 'ww-text', content: { text: { en: 'Lien 1' } } },
            { isWwObject: true, type: 'ww-text', content: { text: { en: 'Lien 2' } } },
            { isWwObject: true, type: 'ww-text', content: { text: { en: 'Lien 3' } } },
        ],
        // It's called button to ensure backward compatibility
        button: wwLib.element('ww-button'),
        closeTrigger: false,
        closeElement: null,
        horizontalAlignement: 'flex-start',
        verticalAlignement: 'center',
        pushLast: false,
        fullHeight: wwLib.responsive(true),
        menuType: wwLib.responsive('right'),
        menuBreakpoint: 'mobile',
        backgroundColor: wwLib.responsive('#FFFFFF'),
        backdropColor: wwLib.responsive('#00000031'),
        triggerType: wwLib.responsive('button'),
        topOrigin: wwLib.responsive('under-navbar'),
        menuSize: wwLib.responsive('60%'),
    },
    props: {
        content: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    /* wwEditor:start */
    wwEditorConfiguration({ content }) {
        return getSettingsConfigurations(content);
    },
    /* wwEditor:end */
    emits: ['update:content'],
    data() {
        return {
            isOpen: false,
            menuTop: 0,
            menuMaxHeight: '',
        };
    },
    computed: {
        isMenuDisplayed() {
            if (this.content.menuBreakpoint === 'laptop') return true;
            if (this.content.menuBreakpoint === 'tablet')
                return this.wwFrontState.screenSize === 'mobile' || this.wwFrontState.screenSize === 'tablet';
            return this.wwFrontState.screenSize === 'mobile';
        },
        navigationStyle() {
            if (this.isMenuDisplayed) return { 'justify-content': 'flex-end' };
            else return { 'justify-content': 'unset' };
        },
        layoutStyle() {
            return {
                justifyContent: this.content.horizontalAlignement,
                alignItems: this.content.verticalAlignement,
                display: this.isMenuDisplayed ? 'none' : 'flex',
            };
        },
        iconStyle() {
            return {
                display: this.isMenuDisplayed ? 'block' : 'none',
            };
        },
        navigationPanelStyle() {
            return {
                '--menu-size': this.content.menuType === 'dropdown' ? '100%' : this.content.menuSize,
                top: `${this.menuTop}px`,
                'max-height': this.menuMaxHeight,
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
        displayOpenTrigger() {
            if (!this.content.closeTrigger) {
                return true;
            } else if (this.content.closeTrigger && !this.isOpen) {
                return true;
            } else {
                return false;
            }
        },
        displayCloseTrigger() {
            return this.content.closeTrigger && this.isOpen;
        },
    },
    watch: {
        'content.topOrigin'() {
            if (this.isOpen) this.computeMenuValues();
        },
        'content.triggerType'(newVal) {
            this.updateTriggerType(newVal);
        },
        'content.closeTrigger'(newVal) {
            if (newVal) {
                this.handleCloseElement();
                wwLib.$on('wwLink:closePopup', this.closeMenu);
            } else {
                this.$emit('update:content', { closeElement: null });
                wwLib.$off('wwLink:closePopup', this.closeMenu);
            }
        },
    },
    mounted() {
        wwLib.$on('wwLink:clicked', this.closeMenu);

        if (this.content.closeTrigger) {
            wwLib.$on('wwLink:closePopup', this.closeMenu);
        }
    },
    unmounted() {
        wwLib.$off('wwLink:clicked', this.closeMenu);
        wwLib.$off('wwLink:closePopup', this.closeMenu);
    },
    methods: {
        triggerToggle() {
            /* wwEditor:start */
            if (this.isEditing) return;
            /* wwEditor:end */
            this.toggleMenu();
        },
        toggleMenu() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) this.computeMenuValues();
        },
        computeMenuValues() {
            this.menuTop =
                this.content.topOrigin === 'top'
                    ? this.$el.getBoundingClientRect().top
                    : this.$el.getBoundingClientRect().bottom;
            this.menuMaxHeight = `calc(100vh - ${this.menuTop}px)`;
        },
        closeMenu() {
            this.isOpen = false;
        },
        async updateTriggerType(type) {
            let triggerElement, closeElement;

            switch (type) {
                case 'button':
                    triggerElement = await wwLib.createElement('ww-button', { text: 'Open menu' });
                    this.$emit('update:content', { triggerElement });

                    if (this.content.closeTrigger) {
                        closeElement = await wwLib.createElement('ww-button', { text: 'Close menu' });
                        this.$emit('update:content', { closeElement });
                    }
                    break;
                case 'icon':
                    triggerElement = await wwLib.createElement('ww-icon', { icon: 'fas fa-bars' });
                    this.$emit('update:content', { triggerElement });

                    if (this.content.closeTrigger) {
                        closeElement = await wwLib.createElement('ww-icon', { icon: 'fas fa-times' });
                        this.$emit('update:content', { closeElement });
                    }
                    break;
                case 'image':
                    triggerElement = await wwLib.createElement(
                        'ww-image',
                        { url: 'https://cdn.weweb.io/public/images/no_preview.jpg' },
                        { style: { default: { width: '30px', height: '30px' } } }
                    );
                    this.$emit('update:content', { triggerElement });

                    if (this.content.closeTrigger) {
                        closeElement = await wwLib.createElement(
                            'ww-image',
                            { url: 'https://cdn.weweb.io/public/images/no_preview.jpg' },
                            { style: { default: { width: '30px', height: '30px' } } }
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
                    closeElement = await wwLib.createElement('ww-button');
                    this.$emit('update:content', { closeElement });
                    break;
                case 'icon':
                    closeElement = await wwLib.createElement('ww-icon');
                    this.$emit('update:content', { closeElement });
                    break;
                case 'image':
                    closeElement = await wwLib.createElement('ww-image');
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
    --menu-size: '60%';
}

.navigation-menu {
    position: relative;
    display: flex;

    &__trigger {
        min-width: 10px;
        min-height: 10px;

        .closeElement {
            &.editing {
                z-index: 11;
            }
        }
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
            top: 0;
            transition: transform 0.3s ease;
            &.full {
                height: 100vh;
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
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
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
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
        height: 100vh;

        &.open {
            opacity: 1;
            pointer-events: all;
        }
    }

    &__container {
        z-index: 11;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
        height: 100vh;

        &.open {
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
