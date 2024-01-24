import{__decorate as r}from"../../b803f408.js";import{s as e,$ as t}from"../../e4c0417e.js";import{n as i}from"../../06170432.js";import{defaultStyles as o,baseSectionStyles as a}from"../../styles.js";import{ConfigurablePanelSection as n}from"../../mixins/configurablePanelSection.js";import"../../mixins/configurable.js";import"../../12d8f3c3.js";import"../../utils.js";import"../../mixins/panelSection.js";const s={stringMap:{"produced-by.header":"Watermarked by","watermark-provider.helpText":"Information about the watermark provider for this content"}};let m=class extends(n(e,{dataSelector:r=>r.watermarkProvider,config:s})){static get styles(){return[o,a]}render(){return this.renderSection(t` <cai-panel-section-dm-plugin
      header=${this._config.stringMap["watermark-provider.header"]}
      helpText=${this._config.stringMap["watermark-provider.helpText"]}
    >
      <div>${this._data}</div>
    </cai-panel-section-dm-plugin>`)}};m=r([i("cai-watermark-provider-dm-plugin")],m);
