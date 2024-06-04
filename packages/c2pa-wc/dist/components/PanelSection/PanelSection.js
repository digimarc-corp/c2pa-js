import{__decorate as o,e as t}from"../../b803f408.js";import{s as i,r as s,$ as r}from"../../e4c0417e.js";import{n as e}from"../../06170432.js";import{defaultStyles as l,baseSectionStyles as n}from"../../styles.js";import"../Tooltip/Tooltip.js";import"../../12d8f3c3.js";import"../../5aacf6e0.js";import"../../icons/monochrome/help.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";let c=class extends i{constructor(){super(...arguments),this.header="",this.helpText=null}static get styles(){return[l,n,s`
        div.layout {
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: auto;
          gap: var(--cai-panel-section-internal-spacing, 0.5rem);
        }
        div.container-dm-plugin {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        div.heading-text {
          color: var(
            --cai-panel-section-heading-color,
            var(--cai-primary-color)
          );

          font-weight: var(--cai-panel-section-heading-font-weight, bold);
        }
        div.content {
          flex-grow: 1;
        }
        .heading-text ::slotted(*) {
          margin-right: 6px;
        }
      `]}render(){return r`
      <div class="layout">
        <div class="container-dm-plugin">
          <div class="heading-text"><slot name="header"></slot></div>
          <div class="content"><slot name="content"></slot></div>
        </div>
      </div>
    `}};o([t({type:String})],c.prototype,"header",void 0),o([t({type:String})],c.prototype,"helpText",void 0),c=o([e("cai-panel-section-dm-plugin")],c);export{c as PanelSection};
