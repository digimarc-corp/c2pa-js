import{__decorate as o,e as i}from"../../b803f408.js";import{r as t,$ as s,s as e}from"../../e4c0417e.js";import{n as r}from"../../06170432.js";import{defaultStyles as c,baseSectionStyles as n}from"../../styles.js";import{Localizable as l}from"../../mixins/localizable.js";import{hasChanged as p}from"../../3e371bb9.js";import"../Icon/Icon.js";import"../PanelSection/PanelSection.js";import"../../12d8f3c3.js";import"../../i18n/index.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";import"../Tooltip/Tooltip.js";import"../../5aacf6e0.js";import"../../icons/monochrome/help.js";let d=class extends(l(e)){static get styles(){return[c,n,t`
        .section-produced-with-content-dm-plugin {
          display: flex;
          align-items: center;
        }

        .section-produced-with-beta-dm-plugin {
          color: var(--cai-secondary-color);
        }
      `]}render(){var o,i,t;return s` <cai-panel-section-dm-plugin
      helpText=${this.strings["produced-with.helpText"]}
    >
      <div slot="header">${this.strings["produced-with.header"]}</div>
      <div slot="content">
        <div class="section-produced-with-content">
          <span> ${null!==(i=null===(o=this.data)||void 0===o?void 0:o.product)&&void 0!==i?i:""}    
          ${(null===(t=this.manifestStore)||void 0===t?void 0:t.isBeta)?s`<span class="section-produced-with-beta-dm-plugin">
                  ${this.strings["produced-with.beta"]}
                </span>`:null} </span>
        </div>
      <div>
    </cai-panel-section-dm-plugin>`}};o([i({type:Object,hasChanged:p})],d.prototype,"data",void 0),o([i({type:Object,hasChanged:p})],d.prototype,"manifestStore",void 0),d=o([r("cai-produced-with-dm-plugin")],d);export{d as ProducedWith};
