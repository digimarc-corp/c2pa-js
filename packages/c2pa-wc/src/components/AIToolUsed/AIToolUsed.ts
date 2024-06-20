/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../assets/svg/monochrome/generic-info.svg';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { hasChanged } from '../../utils';
import { Localizable } from '../../mixins/localizable';

import '../Icon';
import '../PanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-ai-tool-dm-plugin': AIToolUsed;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-ai-tool-dm-plugin': any;
    }
  }
}

@customElement('cai-ai-tool-dm-plugin')
export class AIToolUsed extends Localizable(LitElement) {
  static get styles() {
    return [defaultStyles, baseSectionStyles];
  }

  @property({
    type: Object,
    hasChanged,
  })
  data: string[] | undefined;

  render() {
    return html` <cai-panel-section-dm-plugin
      helpText=${this.strings['produced-by.helpText']}
    >
      <div slot="header">${this.strings['ai-tool-used.header']}</div>
      <div slot="content">${this.data}</div>
    </cai-panel-section-dm-plugin>`;
  }
}
