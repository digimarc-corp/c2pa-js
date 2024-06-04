import{__decorate as o,e as i}from"../../b803f408.js";import{r as s,$ as l,s as t}from"../../e4c0417e.js";import{n as e}from"../../06170432.js";import{defaultStyles as c,baseSectionStyles as r}from"../../styles.js";import{Localizable as n}from"../../mixins/localizable.js";import{hasChanged as a}from"../../3e371bb9.js";import"../Icon/Icon.js";import"../PanelSection/PanelSection.js";import"../../12d8f3c3.js";import"../../i18n/index.js";import"../../icons/color/logos/adobe-stock.js";import"../../icons/color/logos/adobe.js";import"../../icons/color/logos/behance.js";import"../../icons/color/logos/cai.js";import"../../icons/color/logos/ethereum.js";import"../../icons/color/logos/facebook.js";import"../../icons/color/logos/instagram.js";import"../../icons/color/logos/lightroom.js";import"../../icons/color/logos/linkedin.js";import"../../icons/color/logos/photoshop.js";import"../../icons/color/logos/solana.js";import"../../icons/color/logos/truepic.js";import"../../icons/color/logos/twitter.js";import"../Tooltip/Tooltip.js";import"../../5aacf6e0.js";import"../../icons/monochrome/help.js";let m=class extends(n(t)){static get styles(){return[c,r,s`
        .section-social-media-list-dm-plugin {
          --cai-icon-size: 16px;
          display: flex;
          flex-direction: row;
          list-style: none;
          padding: 0px 0px 0px 2px;
          margin: 0;
          overflow: hidden;
        }

        .section-social-media-list-item-dm-plugin {
          display: flex;
          align-items: center;
        }

        .section-social-media-list-item-link-dm-plugin {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `]}render(){var o;return l`<cai-panel-section-dm-plugin
      helpText=${this.strings["social-media.helpText"]}
    >
      <div slot="header">${this.strings["social-media.header"]}</div>
      <ul class="section-social-media-list" slot="content">
        ${null===(o=this.data)||void 0===o?void 0:o.map((o=>l`
            <li class="section-social-media-list-item-dm-plugin">
              <a
                class="section-social-media-list-item-link-dm-plugin"
                href=${o["@id"]}
                target="_blank"
              >
                <cai-icon source="${o["@id"]}"></cai-icon>
              </a>
            </li>
          `))}
      </ul>
    </cai-panel-section-dm-plugin>`}};o([i({type:Object,hasChanged:a})],m.prototype,"data",void 0),m=o([e("cai-social-media-dm-plugin")],m);export{m as SocialMedia};
