<template>
    <div
        class="navigation-menu"
        :style="navigationStyle"
        ww-responsive="navigation-menu"
        :class="{ editing: isEditing }"
    >
        <wwLayout
            class="navigation-menu__items"
            path="elements"
            ww-responsive="menu-layout"
            :placeholderIndex="content.pushLast ? -1 : null"
            :style="layoutStyle"
            direction="row"
        ></wwLayout>
        <wwObject
            v-bind="content.button"
            class="navigation-menu__button"
            @click.native="triggerToggle"
            ww-responsive="menu-button"
            :style="iconStyle"
            >Toggle</wwObject
        >
        <div
            class="navigation-menu__backdrop"
            v-if="isMenuDisplayed"
            :class="{ open: isOpen }"
            @click.prevent.stop="triggerToggle"
            :style="{ backgroundColor: content.backdropColor }"
        >
            <div
                class="navigation-menu__panel"
                :class="[content.menuType, { full: content.fullHeight }]"
                :style="{
                    top: `${menuTop}px`,
                    'max-height': menuMaxHeight,
                    'background-color': content.backgroundColor,
                }"
            >
                <wwLayout class="navigation-menu__panel-items" path="elements"></wwLayout>
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
    wwDefaultContent: {
        elements: [
            { isWwObject: true, type: 'ww-text', content: { text: { en: 'Lien 1' } } },
            { isWwObject: true, type: 'ww-text', content: { text: { en: 'Lien 2' } } },
            { isWwObject: true, type: 'ww-text', content: { text: { en: 'Lien 3' } } },
        ],
        button: { isWwObject: true, type: 'ww-button' },
        horizontalAlignement: 'flex-start',
        verticalAlignement: 'center',
        pushLast: false,
        fullHeight: wwLib.responsive(true),
        menuType: wwLib.responsive('right'),
        menuBreakpoint: 'mobile',
        backgroundColor: wwLib.responsive('#FFFFFF'),
        backdropColor: wwLib.responsive('#00000031'),
    },
    data() {
        return {
            isOpen: false,
            menuTop: 0,
            menuMaxHeight: '',
        };
    },
    props: {
        content: Object,
        wwFrontState: Object,
        /* wwManager: start */
        wwEditorState: Object,
        /* wwManager: end */
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
        /* wwEditor: start */
        isEditing() {
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
        },
        /* wwEditor: end */
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

            if (this.isOpen) {
                this.menuTop = this.$el.getBoundingClientRect().bottom;
                this.menuMaxHeight = `calc(100vh - ${this.menuTop}px)`;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.navigation-menu {
    position: relative;
    display: flex;

    &__items {
        display: flex;
        flex: 1;
        /deep/ > .ww-layout__placeholder {
            flex: 1;
        }
    }

    &__panel-items {
        display: flex;
        flex-direction: column;
        min-width: 300px;
    }

    &__panel {
        z-index: 10;
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
