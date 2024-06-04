import{__decorate as o,e as i}from"../../b803f408.js";import{s as t,r,$ as n}from"../../e4c0417e.js";import{n as s}from"../../06170432.js";import{t as e}from"../../12d8f3c3.js";import{o as c}from"../../5aacf6e0.js";import"../../icons/monochrome/help.js";import{defaultStyles as p}from"../../styles.js";import"../Icon/Icon.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";let l=class extends t{constructor(){super(...arguments),this._isShown=!1,this.animationDuration=200,this.autoPlacement={padding:10},this.arrow=!0}static get styles(){return[p,r`
        #trigger-dm-plugin {
          display: flex;
          --cai-icon-width: var(--cai-popover-icon-width, 16px);
          --cai-icon-height: var(--cai-popover-icon-height, 16px);
          --cai-icon-fill: var(--cai-popover-icon-fill, #a8a8a8);
          cursor: pointer;
        }
        .content-dm-plugin {
          min-width: 165px;
          max-width: 235px;
          font-size: 13px;
          padding: 10px;
          box-shadow: none;
          border-radius: var(--cai-border-radius);
          background-color: #fff;
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.4));
          z-index: 10;
          pointer-events: none;
        }
        .content-dm-plugin.shown {
          opacity: 1;
        }
        .content-dm-plugin.hidden {
          display: none;
        }
      `]}render(){const o={content:!0,shown:this._isShown};return n`
      <cai-popover-dm-plugin
        id="popover-dm-plugin"
        arrow=${this.arrow}
        .autoPlacement=${this.autoPlacement}
        ?interactive=${!1}
      >
        <div id="trigger-dm-plugin" slot="trigger">
          <slot name="trigger">
            <cai-icon-help-dm-plugin></cai-icon-help-dm-plugin>
          </slot>
        </div>
        <div class=${c(o)} slot="content">
          <slot name="content"></slot>
        </div>
      </cai-popover-dm-plugin>
    `}};o([e()],l.prototype,"_isShown",void 0),o([i({type:Number})],l.prototype,"animationDuration",void 0),o([i({type:Object})],l.prototype,"autoPlacement",void 0),o([i({type:Boolean})],l.prototype,"arrow",void 0),l=o([s("cai-tooltip-dm-plugin")],l);export{l as Tooltip};
