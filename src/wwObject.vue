<template>
    <div class="navigation-menu" :class="{ withMenu: isMenuDisplayed }">
        <wwLayout
            class="navigation-menu__items"
            path="elements"
            ww-responsive="menuLayout"
            :placeholderIndex="content.pushLast ? -1 : null"
            :style="layoutStyle"
            v-show="!isMenuDisplayed"
        ></wwLayout>
        <wwObject
            v-bind="content.button"
            class="navigation-menu__button"
            @click.native="toggleMenu"
            v-show="isMenuDisplayed"
            >Toggle</wwObject
        >
        <div
            class="navigation-menu__backdrop"
            v-if="isOpen && isMenuDisplayed"
            @click.prevent.stop="toggleMenu"
            :style="{ backgroundColor: content.backdropColor }"
        >
            <div class="navigation-menu__panel" :class="[content.menuType, { full: content.fullHeight }]">
                <wwLayout class="navigation-menu__panel-items" path="elements"></wwLayout>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '__COMPONENT_NAME__',
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
            };
        },
    },
    methods: {
        toggleMenu() {
            this.isOpen = !this.isOpen;
        },
    },
};
</script>

<style lang="scss" scoped>
.navigation-menu {
    position: relative;
    display: flex;

    &.withMenu {
        justify-content: flex-end;
    }

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

    &__backdrop {
        z-index: 10;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    &__panel {
        z-index: 10;
        &.right,
        &.left {
            position: fixed;
            top: 0;
            &.full {
                height: 100vh;
            }
        }
        &.right {
            right: 0;
        }
        &.left {
            left: 0;
        }
        &.dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            left: 0;
        }
        min-width: 30px;
        background: white;
        overflow: auto;
    }
}
</style>
