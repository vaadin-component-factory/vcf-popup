/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// inspired by non-public @vaadin/vaadin-lumo-styles/test/autoload.js

import { color, typography } from '@vaadin/vaadin-lumo-styles/all-imports';

const style = document.createElement('style');
style.innerHTML = `${color.toString()} ${typography.toString()}`;
document.head.appendChild(style);

import '@vaadin/vaadin-lumo-styles/all-imports';
