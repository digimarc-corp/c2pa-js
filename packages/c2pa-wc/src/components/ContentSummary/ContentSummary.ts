/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../assets/svg/monochrome/generic-info.svg';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { hasChanged } from '../../utils';
import { Localizable } from '../../mixins/localizable';

import '../Icon';
import '../PanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-content-summary-dm-plugin': ContentSummary;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-content-summary-dm-plugin': any;
    }
  }
}

export interface ContentSummaryConfig {
  stringMap: Record<string, string>;
}

@customElement('cai-content-summary-dm-plugin')
export class ContentSummary extends Localizable(LitElement) {
  static get styles() {
    return [
      defaultStyles,
      baseSectionStyles,
      css`
        .section-process-content-dm-plugin {
          display: flex;
          align-items: center;
        }
        .section-icon-content-dm-plugin {
          display: flex;
          align-items: flex-start;
          gap: var(--cai-icon-spacing, 8px);
        }
      `,
    ];
  }

  @property({
    type: Object,
    hasChanged,
  })
  data: string | undefined;

  render() {
    return html`<cai-panel-section-dm-plugin
      helpText=${this.strings['content-summary.helpText']}
    >
      <div class="section-icon-content-dm-plugin" slot="content">
        ${this.data === 'compositeWithTrainedAlgorithmicMedia'
          ? html`
              <span>
                ${this.strings['content-summary.content.composite']}
              </span>
            `
          : html`
              <span>
                ${this.strings['content-summary.content.aiGenerated']}
              </span>
            `}
      </div>
    </cai-panel-section-dm-plugin>`;
  }
}
