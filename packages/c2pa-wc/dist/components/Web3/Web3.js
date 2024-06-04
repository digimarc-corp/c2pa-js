import{__decorate as o,e as i}from"../../b803f408.js";import{r as l,$ as s,w as e,s as t}from"../../e4c0417e.js";import{n as r}from"../../06170432.js";import{defaultStyles as n,baseSectionStyles as a}from"../../styles.js";import{Localizable as c}from"../../mixins/localizable.js";import{hasChanged as d}from"../../3e371bb9.js";import"../Icon/Icon.js";import"../PanelSection/PanelSection.js";import"./Web3Pill.js";import"../../12d8f3c3.js";import"../../i18n/index.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";import"../Tooltip/Tooltip.js";import"../../5aacf6e0.js";import"../../icons/monochrome/help.js";let p=class extends(c(t)){static get styles(){return[n,a,l`
        .web3-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          list-style: none;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .web3-list-item {
          padding-left: 10px;
          display: flex;
          align-items: center;
        }
      `]}render(){var o,i,l,t,r,n;return s`<cai-panel-section-dm-plugin>
      <div slot="header">${this.strings["web3.header"]}</div>
      <div slot="content">
        <ul class="web3-list">
          ${(null===(o=this.data)||void 0===o?void 0:o.solana)&&(null===(i=this.data)||void 0===i?void 0:i.solana.length)>0?s`
                <cai-web3-pill-dm-plugin
                  key="solana"
                  address=${null===(l=this.data)||void 0===l?void 0:l.solana}
                  hidden="false"
                  locale=${this.locale}
                >
                </cai-web3-pill-dm-plugin>
              `:e}
          ${(null===(t=this.data)||void 0===t?void 0:t.ethereum)&&(null===(r=this.data)||void 0===r?void 0:r.ethereum.length)>0?s`
                <cai-web3-pill-dm-plugin
                  key="ethereum"
                  address=${null===(n=this.data)||void 0===n?void 0:n.ethereum}
                  hidden="false"
                  locale=${this.locale}
                >
                </cai-web3-pill-dm-plugin>
              `:e}
        </ul>
      </div>
    </cai-panel-section-dm-plugin>`}};o([i({type:Object,hasChanged:d})],p.prototype,"data",void 0),p=o([r("cai-web3-dm-plugin")],p);export{p as Web3};
