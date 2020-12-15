<template>
    <div class="navigation-menu"></div>
</template>

<script>
export default {
    name: '__COMPONENT_NAME__',
    wwDefaultContent: {},
    props: {
        content: Object,
        wwFrontState,
        /* wwManager: start */
        wwEditorState: Object,
        /* wwManager: end */
    },
};
</script>

<style lang="scss" scoped>
.navigation-menu {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
</style>
