import{__decorate as i,e}from"../../b803f408.js";import{r as t,$ as s,w as r,s as o}from"../../e4c0417e.js";import{n as d}from"../../06170432.js";import{defaultStyles as l,baseSectionStyles as p}from"../../styles.js";import{Localizable as n}from"../../mixins/localizable.js";import"../../12d8f3c3.js";import"../../i18n/index.js";let c=class extends(n(o)){constructor(){super(),this.key="",this.address="",this.handleClick=i=>{navigator.clipboard.writeText(i),this.hidden=!1,setTimeout((()=>{this.hidden=!0}),800)},this.hidden=!1}static get styles(){return[l,p,t`
        .web3-list-item {
          padding-left: 10px;
          display: flex;
          align-items: center;
        }
        .web3-pill {
          background-color: var(--cai-background-pill, #e5e5e5);
          padding: 3px 5px 3px 5px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
        }
        .web3-copied {
          padding-left: 5px;
          color: #666666;
        }
      `]}render(){return s`
      <li class="web3-list-item">
        <cai-icon source="${this.key}"></cai-icon>
        <button
          class="web3-pill"
          @click=${this.handleClick.bind(this,this.address)}
        >
          ${i=this.address,`${i.slice(0,6)}...${i.slice(-4)}`}
        </button>
        ${this.hidden?r:s`
              <div class="web3-copied">${this.strings["web3.copied"]}</div>
            `}
      </li>
    `;var i}};i([e({type:String})],c.prototype,"key",void 0),i([e({type:String})],c.prototype,"address",void 0),i([e({type:Boolean})],c.prototype,"hidden",void 0),c=i([d("cai-web3-pill-dm-plugin")],c);export{c as Web3Pill};
