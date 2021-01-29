<template>
    <div class="navigation-menu" :style="navigationStyle" ww-responsive="navigation-menu">
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
            @click.native="toggleMenu"
            ww-responsive="menu-button"
            :style="iconStyle"
            >Toggle</wwObject
        >
        <div
            class="navigation-menu__backdrop"
            v-if="isMenuDisplayed"
            :class="{ open: isOpen }"
            @click.prevent.stop="toggleMenu"
            :style="{ backgroundColor: content.backdropColor }"
        >
            <div
                class="navigation-menu__panel"
                :class="[content.menuType, { full: content.fullHeight }]"
                :style="{ top: `${menuTop}px`, 'max-height': menuMaxHeight }"
            >
                <wwLayout class="navigation-menu__panel-items" path="elements"></wwLayout>
            </div>
        </div>
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
    },
    methods: {
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
        // overflow: auto;
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
}
</style>
