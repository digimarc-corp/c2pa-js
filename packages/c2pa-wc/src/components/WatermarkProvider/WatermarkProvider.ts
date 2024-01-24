import { L2ManifestStore } from 'c2pa';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import defaultStringMap from './WatermarkProvider.str.json';
import { baseSectionStyles, defaultStyles } from '../../styles';
import { ConfigurablePanelSection } from '../../mixins/configurablePanelSection';

declare global {
  interface HTMLElementTagNameMap {
    'cai-watermark-provider-dm-plugin': WatermarkProvider;
  }

  namespace JSX {
    interface IntrinsicElements {
      'cai-watermark-provider-dm-plugin': any;
    }
  }
}

interface WatermarkProviderConfig {
  stringMap: Record<string, string>;
}

const defaultConfig: WatermarkProviderConfig = {
  stringMap: defaultStringMap,
};

@customElement('cai-watermark-provider-dm-plugin')
export class WatermarkProvider extends ConfigurablePanelSection(LitElement, {
  dataSelector: (manifestStore) => manifestStore.watermarkProvider,
  config: defaultConfig,
}) {
  static get styles() {
    return [defaultStyles, baseSectionStyles];
  }

  render() {
    return this.renderSection(html` <cai-panel-section-dm-plugin
      header=${this._config.stringMap['watermark-provider.header']}
      helpText=${this._config.stringMap['watermark-provider.helpText']}
    >
      <div>${this._data}</div>
    </cai-panel-section-dm-plugin>`);
  }
}
