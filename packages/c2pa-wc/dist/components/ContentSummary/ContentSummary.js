import{__decorate as o,e as s}from"../../b803f408.js";import{r as i,$ as t,s as n}from"../../e4c0417e.js";import{n as e}from"../../06170432.js";import"../../icons/monochrome/generic-info.js";import{defaultStyles as c,baseSectionStyles as r}from"../../styles.js";import{hasChanged as l}from"../../3e371bb9.js";import{Localizable as m}from"../../mixins/localizable.js";import"../Icon/Icon.js";import"../PanelSection/PanelSection.js";import"../../12d8f3c3.js";import"../../i18n/index.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";import"../Tooltip/Tooltip.js";import"../../5aacf6e0.js";import"../../icons/monochrome/help.js";let p=class extends(m(n)){static get styles(){return[c,r,i`
        .section-process-content-dm-plugin {
          display: flex;
          align-items: center;
        }
        .section-icon-content-dm-plugin {
          display: flex;
          align-items: flex-start;
          gap: var(--cai-icon-spacing, 8px);
        }
      `]}render(){return t`<cai-panel-section-dm-plugin
      helpText=${this.strings["content-summary.helpText"]}
    >
      <div class="section-icon-content-dm-plugin" slot="content">
        ${"compositeWithTrainedAlgorithmicMedia"===this.data?t`
              <span>
                ${this.strings["content-summary.content.composite"]}
              </span>
            `:t`
              <span>
                ${this.strings["content-summary.content.aiGenerated"]}
              </span>
            `}
      </div>
    </cai-panel-section-dm-plugin>`}};o([s({type:Object,hasChanged:l})],p.prototype,"data",void 0),p=o([e("cai-content-summary-dm-plugin")],p);export{p as ContentSummary};
