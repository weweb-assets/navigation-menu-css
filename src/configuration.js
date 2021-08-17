const options = content => {
    return {
        ...(function () {
            return content.menuType === 'right' || content.menuType === 'left'
                ? {
                      menuSize: {
                          type: 'Length',
                          label: {
                              en: 'Menu size',
                              fr: 'Menu size',
                          },
                          options: {
                              unitChoices: [{ value: '%', label: '%', min: 20, max: 100 }],
                          },
                      },
                  }
                : {};
        })(),
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
