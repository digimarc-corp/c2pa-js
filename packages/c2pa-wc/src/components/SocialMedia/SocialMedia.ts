/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { L2SocialAccount } from 'c2pa';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { Localizable } from '../../mixins/localizable';

import { hasChanged } from '../../utils';
import '../Icon';
import '../PanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-social-media-dm-plugin': SocialMedia;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-social-media-dm-plugin': any;
    }
  }
}

@customElement('cai-social-media-dm-plugin')
export class SocialMedia extends Localizable(LitElement) {
  static get styles() {
    return [
      defaultStyles,
      baseSectionStyles,
      css`
        .section-social-media-list-dm-plugin {
          --cai-icon-size: 16px;
          display: flex;
          flex-direction: column;
          list-style: none;
          padding: 0px 0px 0px 2px;
          margin: 0;
          overflow: hidden;
        }

        .section-social-media-list-item-dm-plugin {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
        }

        .section-social-media-list-item-link-dm-plugin {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `,
    ];
  }

  @property({
    type: Object,
    hasChanged,
  })
  data: L2SocialAccount[] | undefined;

  render() {
    return html`<cai-panel-section-dm-plugin
      helpText=${this.strings['social-media.helpText']}
    >
      <div slot="header">${this.strings['social-media.header']}</div>
      <ul class="section-social-media-list-dm-plugin" slot="content">
      ${this.data?.map(
        (socialAccount) => html`
          <li class="section-social-media-list-item-dm-plugin">
            <a
              class="section-social-media-list-item-link-dm-plugin"
              href=${socialAccount['@id']}
              target="_blank"
              style="text-decoration: none; display: flex; align-items: center;"
            >
              <cai-icon source="${socialAccount['@id']}" style="margin-right: 0px;"></cai-icon>
              <span style="text-decoration: none; color: black;">${socialAccount['name']}</span>
            </a>
          </li>
        `,
      )}      
      </ul>
    </cai-panel-section-dm-plugin>`;
  }
}
