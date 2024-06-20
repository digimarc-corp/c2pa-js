import{__decorate as o,e as i}from"../../b803f408.js";import{s,r as t,$ as r}from"../../e4c0417e.js";import{n as e}from"../../06170432.js";import{defaultStyles as l,baseSectionStyles as c}from"../../styles.js";import"../Tooltip/Tooltip.js";import"../../12d8f3c3.js";import"../../5aacf6e0.js";import"../../icons/monochrome/help.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";let n=class extends s{constructor(){super(...arguments),this.header="",this.helpText=null}static get styles(){return[l,c,t`
        div.layout {
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: auto;
          gap: var(--cai-panel-section-internal-spacing, 0.5rem);
        }
        div.heading {
          display: flex;
          align-items: center;
        }
        div.heading-text {
          color: var(
            --cai-panel-section-heading-color,
            var(--cai-primary-color)
          );

          font-weight: var(--cai-panel-section-heading-font-weight, bold);
        }
      `]}render(){return r`
      <div class="layout">
        <div class="heading">
          <div class="heading-text">${this.header}</div>
        </div>
        <slot></slot>
      </div>
    `}};o([i({type:String})],n.prototype,"header",void 0),o([i({type:String})],n.prototype,"helpText",void 0),n=o([e("cai-header-section-dm-plugin")],n);export{n as PanelSection};
