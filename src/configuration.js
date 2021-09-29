const options = content => {
    return {
        menuSize:
            content.menuType == 'right' || content.menuType == 'left'
                ? {
                      type: 'Length',
                      label: {
                          en: 'Menu size',
                          fr: 'Menu size',
                      },
                      options: {
                          unitChoices: [{ value: '%', label: '%', min: 20, max: 100 }],
                      },
                  }
                : {},
        topOrigin: {
            label: { en: 'Top origin', fr: 'Top origin' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'top', label: { en: 'Top' } },
                    { value: 'under-navbar', label: { en: 'Under the navbar' } },
                ],
            },
        },
        triggerType: {
            label: {
                en: 'Trigger type',
                fr: 'Trigger type',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'button', label: { en: 'Button', fr: 'Bouton' } },
                    { value: 'icon', label: { en: 'Icon', fr: 'Icône' } },
                    { value: 'image', label: { en: 'Image', fr: 'Image' } },
                ],
            },
        },
        closeTrigger: {
            label: {
                en: 'Different element for closing',
                fr: 'Element different pour fermer',
            },
            type: 'OnOff',
        },
        toggle: {
            type: 'Button',
            options: {
                text: { en: 'Toggle mobile menu' },
                action: 'toggleMenu',
            },
        },
    };
};

export const getSettingsConfigurations = content => {
    return { settingsOptions: { ...options(content) } };
};
