/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defaultStyles } from '../../styles';
import { defaultDateFormatter, hasChanged } from '../../utils';
import { L2ManifestStore } from 'c2pa';
import type { EditsAndActivityConfig } from '../EditsAndActivity';
import type { MinimumViableProvenanceConfig } from '../MinimumViableProvenance';
import { Configurable } from '../../mixins/configurable';
import defaultStringMap from './ManifestSummary.str.json';

import '../ContentSummary';
import '../AssetsUsed';
import '../ProducedBy';
import '../ProducedWith';
import '../SocialMedia';
import '../EditsAndActivity';
import '../MinimumViableProvenance';

declare global {
  interface HTMLElementTagNameMap {
    'cai-manifest-summary-dm-plugin': ManifestSummary;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-manifest-summary-dm-plugin': any;
    }
  }
}

export interface ManifestSummaryConfig
  extends Pick<MinimumViableProvenanceConfig, 'dateFormatter'>,
    Pick<EditsAndActivityConfig, 'showDescriptions'> {
  stringMap: Record<string, string>;
  sections?: {
    assetsUsed?: boolean;
    alert?: boolean;
    editsAndActivity?: boolean;
    producedBy?: boolean;
    producedWith?: boolean;
    socialMedia?: boolean;
    contentSummary?: boolean;
  };
}

const defaultConfig: ManifestSummaryConfig = {
  stringMap: defaultStringMap,
  dateFormatter: defaultDateFormatter,
  showDescriptions: true,
  sections: {
    assetsUsed: true,
    alert: true,
    editsAndActivity: true,
    producedBy: true,
    producedWith: true,
    socialMedia: true,
    contentSummary: true,
  },
};

@customElement('cai-manifest-summary-dm-plugin')
export class ManifestSummary extends Configurable(LitElement, defaultConfig) {
  static readonly cssParts = {
    viewMore: 'manifest-summary-view-more',
  };

  static get styles() {
    return [
      defaultStyles,
      css`
        #container-dm-plugin {
          width: var(--cai-manifest-summary-width, 320px);
        }

        #content-container-dm-plugin {
          padding: var(--cai-manifest-summary-content-padding, 20px);
          max-height: var(--cai-manifest-summary-content-max-height, 550px);
          border-bottom-width: var(
            --cai-manifest-summary-content-border-bottom-width,
            1px
          );
          border-bottom-style: var(
            --cai-manifest-summary-content-border-bottom-style,
            solid
          );
          border-bottom-color: var(
            --cai-manifest-summary-content-border-bottom-color,
            #e1e1e1
          );

          overflow-y: auto;
          overflow-x: hidden;
        }

        #content-container-dm-plugin > *:not(:first-child):not([empty]),
        ::slotted(*) {
          padding-top: var(--cai-manifest-summary-section-spacing, 20px);
          margin-top: var(--cai-manifest-summary-section-spacing, 20px);
          border-top-width: var(
            --cai-manifest-summary-section-border-width,
            1px
          ) !important;
          border-top-style: var(
            --cai-manifest-summary-section-border-style,
            solid
          ) !important;
          border-top-color: var(
            --cai-manifest-summary-section-border-color,
            #e1e1e1
          ) !important;
        }

        #view-more-container-dm-plugin {
          padding: var(--cai-manifest-summary-view-more-padding, 20px);
        }

        #view-more-dm-plugin {
          display: block;
          transition: all 150ms ease-in-out;
          background-color: transparent;
          border-radius: 9999px;
          border: 2px solid #b3b3b3;
          padding: 8px 0;
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          width: 100%;
          color: var(--cai-primary-color);
        }

        #view-more-dm-plugin:hover {
          background-color: #eeeeee;
        }
      `,
    ];
  }

  @property({
    type: Object,
    hasChanged,
  })
  manifestStore: L2ManifestStore | undefined;

  @property({
    type: String,
    attribute: 'view-more-url',
  })
  viewMoreUrl = '';

  render() {
    if (!this.manifestStore) {
      return null;
    }

    let alertColor;

    if (this.manifestStore.alert) {
      switch (this.manifestStore.alert.type) {
        case 'warning':
          alertColor = '#f0ad4e';
          break;
        case 'error':
          alertColor = '#d9534f';
          break;
        default:
          alertColor = '#5bc0de';
      }
    }

    return html`<div id="container-dm-plugin">
      <div id="content-container-dm-plugin">
        <cai-minimum-viable-provenance-dm-plugin
          .manifestStore=${this.manifestStore}
          .config=${this._config}
        ></cai-minimum-viable-provenance-dm-plugin>
        <slot name="pre"></slot>
        ${this.manifestStore.error === 'error'
          ? html`
              <div>${this._config.stringMap['manifest-summary.error']}</div>
            `
          : html`
              ${this._config?.sections?.contentSummary
                ? html`
                    <cai-content-summary-dm-plugin
                      .manifestStore=${this.manifestStore}
                      .config=${this._config}
                    ></cai-content-summary-dm-plugin>
                  `
                : nothing}
              ${this.manifestStore?.alert
                ? html`
                    <div
                      style="background-color: ${alertColor}; border-radius: 10px; display: flex; justify-content: center; align-items: center; height: 100%;"
                    >
                      ${this.manifestStore.alert.message}
                    </div>
                  `
                : nothing}
              ${this._config?.sections?.producedBy
                ? html`
                    <cai-produced-by-dm-plugin
                      .manifestStore=${this.manifestStore}
                      .config=${this._config}
                    ></cai-produced-by-dm-plugin>
                  `
                : nothing}
              ${this._config?.sections?.producedWith
                ? html`
                    <cai-produced-with-dm-plugin
                      .manifestStore=${this.manifestStore}
                      .config=${this._config}
                    ></cai-produced-with-dm-plugin>
                  `
                : nothing}
              ${this.manifestStore?.watermarkProvider
                ? html`
                    <cai-panel-section-dm-plugin
                      header=${this._config.stringMap['produced-by.header']}
                      helpText=${this._config.stringMap['produced-by.helpText']}
                    >
                      <div>${this.manifestStore.watermarkProvider}</div>
                    </cai-panel-section-dm-plugin>
                  `
                : nothing}
              ${this._config?.sections?.editsAndActivity
                ? html`
                    <cai-edits-and-activity-dm-plugin
                      .manifestStore=${this.manifestStore}
                      .config=${this._config}
                    ></cai-edits-and-activity-dm-plugin>
                  `
                : nothing}
              ${this._config?.sections?.assetsUsed
                ? html`
                    <cai-assets-used-dm-plugin
                      .manifestStore=${this.manifestStore}
                      .config=${this._config}
                    ></cai-assets-used-dm-plugin>
                  `
                : nothing}
              ${this._config?.sections?.socialMedia
                ? html`
                    <cai-social-media-dm-plugin
                      .manifestStore=${this.manifestStore}
                      .config=${this._config}
                    ></cai-social-media-dm-plugin>
                  `
                : nothing}
            `}
        <slot></slot>
        <slot name="post"></slot>
      </div>
      <div id="view-more-container-dm-plugin">
        ${this.viewMoreUrl
          ? html`
              <a
                id="view-more-dm-plugin"
                part=${ManifestSummary.cssParts.viewMore}
                href=${this.viewMoreUrl}
                target="_blank"
              >
                ${this._config.stringMap['manifest-summary.viewMore']}
              </a>
            `
          : nothing}
      </div>
    </div>`;
  }
}
