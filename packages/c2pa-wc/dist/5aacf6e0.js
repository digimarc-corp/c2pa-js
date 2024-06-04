import{__decorate as t,e}from"./b803f408.js";import{b as i,w as n,s as o,r as s,$ as r}from"./e4c0417e.js";import{n as l}from"./06170432.js";import{t as a}from"./12d8f3c3.js";import"./icons/monochrome/help.js";import{defaultStyles as c}from"./styles.js";function h(t,e){return(({finisher:t,descriptor:e})=>(i,n)=>{var o;if(void 0===n){const n=null!==(o=i.originalKey)&&void 0!==o?o:i.key,s=null!=e?{kind:"method",placement:"prototype",key:n,descriptor:e(i.key)}:{...i,key:n};return null!=t&&(s.finisher=function(e){t(e,n)}),s}{const o=i.constructor;void 0!==e&&Object.defineProperty(i,n,e(n)),null==t||t(o,n)}})({descriptor:i=>{const n={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;n.get=function(){var i,n;return void 0===this[e]&&(this[e]=null!==(n=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==n?n:null),this[e]}}return n}})}const d=1,u=2,f=t=>(...e)=>({_$litDirective$:t,values:e});class p{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const m=f(class extends p{constructor(t){var e;if(super(t),t.type!==d||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var n,o;if(void 0===this.et){this.et=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(n=this.st)||void 0===n?void 0:n.has(t))&&this.et.add(t);return this.render(e)}const s=t.element.classList;this.et.forEach((t=>{t in e||(s.remove(t),this.et.delete(t))}));for(const t in e){const i=!!e[t];i===this.et.has(t)||(null===(o=this.st)||void 0===o?void 0:o.has(t))||(i?(s.add(t),this.et.add(t)):(s.remove(t),this.et.delete(t)))}return i}}),v=(t,e)=>{var i,n;const o=t._$AN;if(void 0===o)return!1;for(const t of o)null===(n=(i=t)._$AO)||void 0===n||n.call(i,e,!1),v(t,e);return!0},g=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===(null==i?void 0:i.size))},y=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),x(e)}};function w(t){void 0!==this._$AN?(g(this),this._$AM=t,y(this)):this._$AM=t}function b(t,e=!1,i=0){const n=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(e)if(Array.isArray(n))for(let t=i;t<n.length;t++)v(n[t],!1),g(n[t]);else null!=n&&(v(n,!1),g(n));else v(this,t)}const x=t=>{var e,i,n,o;t.type==u&&(null!==(e=(n=t)._$AP)&&void 0!==e||(n._$AP=b),null!==(i=(o=t)._$AQ)&&void 0!==i||(o._$AQ=w))};class A extends p{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),y(this),this.isConnected=t._$AU}_$AO(t,e=!0){var i,n;t!==this.isConnected&&(this.isConnected=t,t?null===(i=this.reconnected)||void 0===i||i.call(this):null===(n=this.disconnected)||void 0===n||n.call(this)),e&&(v(this,t),g(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}function _(t){return t.split("-")[0]}function E(t){return t.split("-")[1]}function O(t){return["top","bottom"].includes(_(t))?"x":"y"}function $(t){return"y"===t?"height":"width"}function C(t,e,i){let{reference:n,floating:o}=t;const s=n.x+n.width/2-o.width/2,r=n.y+n.height/2-o.height/2,l=O(e),a=$(l),c=n[a]/2-o[a]/2,h="x"===l;let d;switch(_(e)){case"top":d={x:s,y:n.y-o.height};break;case"bottom":d={x:s,y:n.y+n.height};break;case"right":d={x:n.x+n.width,y:r};break;case"left":d={x:n.x-o.width,y:r};break;default:d={x:n.x,y:n.y}}switch(E(e)){case"start":d[l]-=c*(i&&h?-1:1);break;case"end":d[l]+=c*(i&&h?-1:1)}return d}function R(t){return"number"!=typeof t?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}function T(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function L(t,e){var i;void 0===e&&(e={});const{x:n,y:o,platform:s,rects:r,elements:l,strategy:a}=t,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:u=!1,padding:f=0}=e,p=R(f),m=l[u?"floating"===d?"reference":"floating":d],v=T(await s.getClippingRect({element:null==(i=await(null==s.isElement?void 0:s.isElement(m)))||i?m:m.contextElement||await(null==s.getDocumentElement?void 0:s.getDocumentElement(l.floating)),boundary:c,rootBoundary:h,strategy:a})),g=T(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({rect:"floating"===d?{...r.floating,x:n,y:o}:r.reference,offsetParent:await(null==s.getOffsetParent?void 0:s.getOffsetParent(l.floating)),strategy:a}):r[d]);return{top:v.top-g.top+p.top,bottom:g.bottom-v.bottom+p.bottom,left:v.left-g.left+p.left,right:g.right-v.right+p.right}}const P=Math.min,S=Math.max;function k(t,e,i){return S(t,P(e,i))}const j={left:"right",right:"left",bottom:"top",top:"bottom"};function N(t){return t.replace(/left|right|bottom|top/g,(t=>j[t]))}function D(t,e,i){void 0===i&&(i=!1);const n=E(t),o=O(t),s=$(o);let r="x"===o?n===(i?"end":"start")?"right":"left":"start"===n?"bottom":"top";return e.reference[s]>e.floating[s]&&(r=N(r)),{main:r,cross:N(r)}}const F={start:"end",end:"start"};function z(t){return t.replace(/start|end/g,(t=>F[t]))}const H=["top","right","bottom","left"].reduce(((t,e)=>t.concat(e,e+"-start",e+"-end")),[]);const M=function(t){return void 0===t&&(t={}),{name:"autoPlacement",options:t,async fn(e){var i,n,o,s,r;const{x:l,y:a,rects:c,middlewareData:h,placement:d,platform:u,elements:f}=e,{alignment:p=null,allowedPlacements:m=H,autoAlignment:v=!0,...g}=t,y=function(t,e,i){return(t?[...i.filter((e=>E(e)===t)),...i.filter((e=>E(e)!==t))]:i.filter((t=>_(t)===t))).filter((i=>!t||E(i)===t||!!e&&z(i)!==i))}(p,v,m),w=await L(e,g),b=null!=(i=null==(n=h.autoPlacement)?void 0:n.index)?i:0,x=y[b];if(null==x)return{};const{main:A,cross:O}=D(x,c,await(null==u.isRTL?void 0:u.isRTL(f.floating)));if(d!==x)return{x:l,y:a,reset:{placement:y[0]}};const $=[w[_(x)],w[A],w[O]],C=[...null!=(o=null==(s=h.autoPlacement)?void 0:s.overflows)?o:[],{placement:x,overflows:$}],R=y[b+1];if(R)return{data:{index:b+1,overflows:C},reset:{placement:R}};const T=C.slice().sort(((t,e)=>t.overflows[0]-e.overflows[0])),P=null==(r=T.find((t=>{let{overflows:e}=t;return e.every((t=>t<=0))})))?void 0:r.placement,S=null!=P?P:T[0].placement;return S!==d?{data:{index:b+1,overflows:C},reset:{placement:S}}:{}}}};const W=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var i;const{placement:n,middlewareData:o,rects:s,initialPlacement:r,platform:l,elements:a}=e,{mainAxis:c=!0,crossAxis:h=!0,fallbackPlacements:d,fallbackStrategy:u="bestFit",flipAlignment:f=!0,...p}=t,m=_(n),v=d||(m===r||!f?[N(r)]:function(t){const e=N(t);return[z(t),e,z(e)]}(r)),g=[r,...v],y=await L(e,p),w=[];let b=(null==(i=o.flip)?void 0:i.overflows)||[];if(c&&w.push(y[m]),h){const{main:t,cross:e}=D(n,s,await(null==l.isRTL?void 0:l.isRTL(a.floating)));w.push(y[t],y[e])}if(b=[...b,{placement:n,overflows:w}],!w.every((t=>t<=0))){var x,A;const t=(null!=(x=null==(A=o.flip)?void 0:A.index)?x:0)+1,e=g[t];if(e)return{data:{index:t,overflows:b},reset:{placement:e}};let i="bottom";switch(u){case"bestFit":{var E;const t=null==(E=b.map((t=>[t,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:E[0].placement;t&&(i=t);break}case"initialPlacement":i=r}if(n!==i)return{reset:{placement:i}}}return{}}}};const I=function(t){return void 0===t&&(t=0),{name:"offset",options:t,async fn(e){const{x:i,y:n}=e,o=await async function(t,e){const{placement:i,platform:n,elements:o}=t,s=await(null==n.isRTL?void 0:n.isRTL(o.floating)),r=_(i),l=E(i),a="x"===O(i),c=["left","top"].includes(r)?-1:1,h=s&&a?-1:1,d="function"==typeof e?e(t):e;let{mainAxis:u,crossAxis:f,alignmentAxis:p}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return l&&"number"==typeof p&&(f="end"===l?-1*p:p),a?{x:f*h,y:u*c}:{x:u*c,y:f*h}}(e,t);return{x:i+o.x,y:n+o.y,data:o}}}};function V(t){return t&&t.document&&t.location&&t.alert&&t.setInterval}function U(t){if(null==t)return window;if(!V(t)){const e=t.ownerDocument;return e&&e.defaultView||window}return t}function B(t){return U(t).getComputedStyle(t)}function q(t){return V(t)?"":t?(t.nodeName||"").toLowerCase():""}function K(){const t=navigator.userAgentData;return null!=t&&t.brands?t.brands.map((t=>t.brand+"/"+t.version)).join(" "):navigator.userAgent}function X(t){return t instanceof U(t).HTMLElement}function Y(t){return t instanceof U(t).Element}function Q(t){if("undefined"==typeof ShadowRoot)return!1;return t instanceof U(t).ShadowRoot||t instanceof ShadowRoot}function Z(t){const{overflow:e,overflowX:i,overflowY:n}=B(t);return/auto|scroll|overlay|hidden/.test(e+n+i)}function G(t){return["table","td","th"].includes(q(t))}function J(t){const e=/firefox/i.test(K()),i=B(t);return"none"!==i.transform||"none"!==i.perspective||"paint"===i.contain||["transform","perspective"].includes(i.willChange)||e&&"filter"===i.willChange||e&&!!i.filter&&"none"!==i.filter}function tt(){return!/^((?!chrome|android).)*safari/i.test(K())}const et=Math.min,it=Math.max,nt=Math.round;function ot(t,e,i){var n,o,s,r;void 0===e&&(e=!1),void 0===i&&(i=!1);const l=t.getBoundingClientRect();let a=1,c=1;e&&X(t)&&(a=t.offsetWidth>0&&nt(l.width)/t.offsetWidth||1,c=t.offsetHeight>0&&nt(l.height)/t.offsetHeight||1);const h=Y(t)?U(t):window,d=!tt()&&i,u=(l.left+(d&&null!=(n=null==(o=h.visualViewport)?void 0:o.offsetLeft)?n:0))/a,f=(l.top+(d&&null!=(s=null==(r=h.visualViewport)?void 0:r.offsetTop)?s:0))/c,p=l.width/a,m=l.height/c;return{width:p,height:m,top:f,right:u+p,bottom:f+m,left:u,x:u,y:f}}function st(t){return(e=t,(e instanceof U(e).Node?t.ownerDocument:t.document)||window.document).documentElement;var e}function rt(t){return Y(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function lt(t){return ot(st(t)).left+rt(t).scrollLeft}function at(t,e,i){const n=X(e),o=st(e),s=ot(t,n&&function(t){const e=ot(t);return nt(e.width)!==t.offsetWidth||nt(e.height)!==t.offsetHeight}(e),"fixed"===i);let r={scrollLeft:0,scrollTop:0};const l={x:0,y:0};if(n||!n&&"fixed"!==i)if(("body"!==q(e)||Z(o))&&(r=rt(e)),X(e)){const t=ot(e,!0);l.x=t.x+e.clientLeft,l.y=t.y+e.clientTop}else o&&(l.x=lt(o));return{x:s.left+r.scrollLeft-l.x,y:s.top+r.scrollTop-l.y,width:s.width,height:s.height}}function ct(t){return"html"===q(t)?t:t.assignedSlot||t.parentNode||(Q(t)?t.host:null)||st(t)}function ht(t){return X(t)&&"fixed"!==getComputedStyle(t).position?t.offsetParent:null}function dt(t){const e=U(t);let i=ht(t);for(;i&&G(i)&&"static"===getComputedStyle(i).position;)i=ht(i);return i&&("html"===q(i)||"body"===q(i)&&"static"===getComputedStyle(i).position&&!J(i))?e:i||function(t){let e=ct(t);for(Q(e)&&(e=e.host);X(e)&&!["html","body"].includes(q(e));){if(J(e))return e;e=e.parentNode}return null}(t)||e}function ut(t){if(X(t))return{width:t.offsetWidth,height:t.offsetHeight};const e=ot(t);return{width:e.width,height:e.height}}function ft(t){const e=ct(t);return["html","body","#document"].includes(q(e))?t.ownerDocument.body:X(e)&&Z(e)?e:ft(e)}function pt(t,e){var i;void 0===e&&(e=[]);const n=ft(t),o=n===(null==(i=t.ownerDocument)?void 0:i.body),s=U(n),r=o?[s].concat(s.visualViewport||[],Z(n)?n:[]):n,l=e.concat(r);return o?l:l.concat(pt(r))}function mt(t,e,i){return"viewport"===e?T(function(t,e){const i=U(t),n=st(t),o=i.visualViewport;let s=n.clientWidth,r=n.clientHeight,l=0,a=0;if(o){s=o.width,r=o.height;const t=tt();(t||!t&&"fixed"===e)&&(l=o.offsetLeft,a=o.offsetTop)}return{width:s,height:r,x:l,y:a}}(t,i)):Y(e)?function(t,e){const i=ot(t,!1,"fixed"===e),n=i.top+t.clientTop,o=i.left+t.clientLeft;return{top:n,left:o,x:o,y:n,right:o+t.clientWidth,bottom:n+t.clientHeight,width:t.clientWidth,height:t.clientHeight}}(e,i):T(function(t){var e;const i=st(t),n=rt(t),o=null==(e=t.ownerDocument)?void 0:e.body,s=it(i.scrollWidth,i.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),r=it(i.scrollHeight,i.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0);let l=-n.scrollLeft+lt(t);const a=-n.scrollTop;return"rtl"===B(o||i).direction&&(l+=it(i.clientWidth,o?o.clientWidth:0)-s),{width:s,height:r,x:l,y:a}}(st(t)))}function vt(t){const e=pt(t),i=["absolute","fixed"].includes(B(t).position)&&X(t)?dt(t):t;return Y(i)?e.filter((t=>Y(t)&&function(t,e){const i=null==e.getRootNode?void 0:e.getRootNode();if(t.contains(e))return!0;if(i&&Q(i)){let i=e;do{if(i&&t===i)return!0;i=i.parentNode||i.host}while(i)}return!1}(t,i)&&"body"!==q(t))):[]}const gt={getClippingRect:function(t){let{element:e,boundary:i,rootBoundary:n,strategy:o}=t;const s=[..."clippingAncestors"===i?vt(e):[].concat(i),n],r=s[0],l=s.reduce(((t,i)=>{const n=mt(e,i,o);return t.top=it(n.top,t.top),t.right=et(n.right,t.right),t.bottom=et(n.bottom,t.bottom),t.left=it(n.left,t.left),t}),mt(e,r,o));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}},convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{rect:e,offsetParent:i,strategy:n}=t;const o=X(i),s=st(i);if(i===s)return e;let r={scrollLeft:0,scrollTop:0};const l={x:0,y:0};if((o||!o&&"fixed"!==n)&&(("body"!==q(i)||Z(s))&&(r=rt(i)),X(i))){const t=ot(i,!0);l.x=t.x+i.clientLeft,l.y=t.y+i.clientTop}return{...e,x:e.x-r.scrollLeft+l.x,y:e.y-r.scrollTop+l.y}},isElement:Y,getDimensions:ut,getOffsetParent:dt,getDocumentElement:st,getElementRects:t=>{let{reference:e,floating:i,strategy:n}=t;return{reference:at(e,dt(i),n),floating:{...ut(i),x:0,y:0}}},getClientRects:t=>Array.from(t.getClientRects()),isRTL:t=>"rtl"===B(t).direction};const yt=(t,e,i)=>(async(t,e,i)=>{const{placement:n="bottom",strategy:o="absolute",middleware:s=[],platform:r}=i,l=await(null==r.isRTL?void 0:r.isRTL(e));if("production"!==process.env.NODE_ENV&&(null==r&&console.error(["Floating UI: `platform` property was not passed to config. If you","want to use Floating UI on the web, install @floating-ui/dom","instead of the /core package. Otherwise, you can create your own","`platform`: https://floating-ui.com/docs/platform"].join(" ")),s.filter((t=>{let{name:e}=t;return"autoPlacement"===e||"flip"===e})).length>1))throw new Error(["Floating UI: duplicate `flip` and/or `autoPlacement`","middleware detected. This will lead to an infinite loop. Ensure only","one of either has been passed to the `middleware` array."].join(" "));let a=await r.getElementRects({reference:t,floating:e,strategy:o}),{x:c,y:h}=C(a,n,l),d=n,u={},f=0;for(let i=0;i<s.length;i++){const{name:p,fn:m}=s[i],{x:v,y:g,data:y,reset:w}=await m({x:c,y:h,initialPlacement:n,placement:d,strategy:o,middlewareData:u,rects:a,platform:r,elements:{reference:t,floating:e}});c=null!=v?v:c,h=null!=g?g:h,u={...u,[p]:{...u[p],...y}},"production"!==process.env.NODE_ENV&&f>50&&console.warn(["Floating UI: The middleware lifecycle appears to be running in an","infinite loop. This is usually caused by a `reset` continually","being returned without a break condition."].join(" ")),w&&f<=50&&(f++,"object"==typeof w&&(w.placement&&(d=w.placement),w.rects&&(a=!0===w.rects?await r.getElementRects({reference:t,floating:e,strategy:o}):w.rects),({x:c,y:h}=C(a,d,l))),i=-1)}return{x:c,y:h,placement:d,strategy:o,middlewareData:u}})(t,e,{platform:gt,...i}),wt=new WeakMap;let bt=0;const xt=new Map,At=new WeakSet,_t=()=>new Promise((t=>requestAnimationFrame(t))),Et=(t,e)=>{const i=t-e;return 0===i?void 0:i},Ot=(t,e)=>{const i=t/e;return 1===i?void 0:i},$t={left:(t,e)=>{const i=Et(t,e);return{value:i,transform:i&&`translateX(${i}px)`}},top:(t,e)=>{const i=Et(t,e);return{value:i,transform:i&&`translateY(${i}px)`}},width:(t,e)=>{const i=Ot(t,e);return{value:i,transform:i&&`scaleX(${i})`}},height:(t,e)=>{const i=Ot(t,e);return{value:i,transform:i&&`scaleY(${i})`}}},Ct={duration:333,easing:"ease-in-out"},Rt=["left","top","width","height","opacity","color","background"],Tt=new WeakMap;const Lt=f(class extends A{constructor(t){if(super(t),this.t=null,this.i=null,this.o=!0,this.shouldLog=!1,t.type===u)throw Error("The `animate` directive must be used in attribute position.");this.createFinished()}createFinished(){var t;null===(t=this.resolveFinished)||void 0===t||t.call(this),this.finished=new Promise((t=>{this.h=t}))}async resolveFinished(){var t;null===(t=this.h)||void 0===t||t.call(this),this.h=void 0}render(t){return n}getController(){return wt.get(this.l)}isDisabled(){var t;return this.options.disabled||(null===(t=this.getController())||void 0===t?void 0:t.disabled)}update(t,[e]){var i;const n=void 0===this.l;return n&&(this.l=null===(i=t.options)||void 0===i?void 0:i.host,this.l.addController(this),this.element=t.element,Tt.set(this.element,this)),this.optionsOrCallback=e,(n||"function"!=typeof e)&&this.u(e),this.render(e)}u(t){var e,i;t=null!=t?t:{};const n=this.getController();void 0!==n&&((t={...n.defaultOptions,...t}).keyframeOptions={...n.defaultOptions.keyframeOptions,...t.keyframeOptions}),null!==(e=(i=t).properties)&&void 0!==e||(i.properties=Rt),this.options=t}v(){const t={},e=this.element.getBoundingClientRect(),i=getComputedStyle(this.element);return this.options.properties.forEach((n=>{var o;const s=null!==(o=e[n])&&void 0!==o?o:$t[n]?void 0:i[n],r=Number(s);t[n]=isNaN(r)?s+"":r})),t}p(){let t,e=!0;return this.options.guard&&(t=this.options.guard(),e=((t,e)=>{if(Array.isArray(t)){if(Array.isArray(e)&&e.length===t.length&&t.every(((t,i)=>t===e[i])))return!1}else if(e===t)return!1;return!0})(t,this.m)),this.o=this.l.hasUpdated&&!this.isDisabled()&&!this.isAnimating()&&e&&this.element.isConnected,this.o&&(this.m=Array.isArray(t)?Array.from(t):t),this.o}hostUpdate(){var t;"function"==typeof this.optionsOrCallback&&this.u(this.optionsOrCallback()),this.p()&&(this.g=this.v(),this.t=null!==(t=this.t)&&void 0!==t?t:this.element.parentNode,this.i=this.element.nextSibling)}async hostUpdated(){if(!this.o||!this.element.isConnected||this.options.skipInitial&&!this.isHostRendered)return;let t;this.prepare(),await _t;const e=this.A(),i=this._(this.options.keyframeOptions,e),n=this.v();if(void 0!==this.g){const{from:i,to:o}=this.j(this.g,n,e);this.log("measured",[this.g,n,i,o]),t=this.calculateKeyframes(i,o)}else{const i=xt.get(this.options.inId);if(i){xt.delete(this.options.inId);const{from:o,to:s}=this.j(i,n,e);t=this.calculateKeyframes(o,s),t=this.options.in?[{...this.options.in[0],...t[0]},...this.options.in.slice(1),t[1]]:t,bt++,t.forEach((t=>t.zIndex=bt))}else this.options.in&&(t=[...this.options.in,{}])}this.animate(t,i)}resetStyles(){var t;void 0!==this.S&&(this.element.setAttribute("style",null!==(t=this.S)&&void 0!==t?t:""),this.S=void 0)}commitStyles(){var t,e;this.S=this.element.getAttribute("style"),null===(t=this.webAnimation)||void 0===t||t.commitStyles(),null===(e=this.webAnimation)||void 0===e||e.cancel()}reconnected(){}async disconnected(){var t;if(!this.o)return;if(void 0!==this.options.id&&xt.set(this.options.id,this.g),void 0===this.options.out)return;if(this.prepare(),await _t(),null===(t=this.t)||void 0===t?void 0:t.isConnected){const t=this.i&&this.i.parentNode===this.t?this.i:null;if(this.t.insertBefore(this.element,t),this.options.stabilizeOut){const t=this.v();this.log("stabilizing out");const e=this.g.left-t.left,i=this.g.top-t.top;!("static"===getComputedStyle(this.element).position)||0===e&&0===i||(this.element.style.position="relative"),0!==e&&(this.element.style.left=e+"px"),0!==i&&(this.element.style.top=i+"px")}}const e=this._(this.options.keyframeOptions);await this.animate(this.options.out,e),this.element.remove()}prepare(){this.createFinished()}start(){var t,e;null===(e=(t=this.options).onStart)||void 0===e||e.call(t,this)}didFinish(t){var e,i;t&&(null===(i=(e=this.options).onComplete)||void 0===i||i.call(e,this)),this.g=void 0,this.animatingProperties=void 0,this.frames=void 0,this.resolveFinished()}A(){const t=[];for(let e=this.element.parentNode;e;e=null==e?void 0:e.parentNode){const i=Tt.get(e);i&&!i.isDisabled()&&i&&t.push(i)}return t}get isHostRendered(){const t=At.has(this.l);return t||this.l.updateComplete.then((()=>{At.add(this.l)})),t}_(t,e=this.A()){const i={...Ct};return e.forEach((t=>Object.assign(i,t.options.keyframeOptions))),Object.assign(i,t),i}j(t,e,i){t={...t},e={...e};const n=i.map((t=>t.animatingProperties)).filter((t=>void 0!==t));let o=1,s=1;return void 0!==n&&(n.forEach((t=>{t.width&&(o/=t.width),t.height&&(s/=t.height)})),void 0!==t.left&&void 0!==e.left&&(t.left=o*t.left,e.left=o*e.left),void 0!==t.top&&void 0!==e.top&&(t.top=s*t.top,e.top=s*e.top)),{from:t,to:e}}calculateKeyframes(t,e,i=!1){var n;const o={},s={};let r=!1;const l={};for(const i in e){const a=t[i],c=e[i];if(i in $t){const t=$t[i];if(void 0===a||void 0===c)continue;const e=t(a,c);void 0!==e.transform&&(l[i]=e.value,r=!0,o.transform=`${null!==(n=o.transform)&&void 0!==n?n:""} ${e.transform}`)}else a!==c&&void 0!==a&&void 0!==c&&(r=!0,o[i]=a,s[i]=c)}return o.transformOrigin=s.transformOrigin=i?"center center":"top left",this.animatingProperties=l,r?[o,s]:void 0}async animate(t,e=this.options.keyframeOptions){this.start(),this.frames=t;let i=!1;if(!this.isAnimating()&&!this.isDisabled()&&(this.options.onFrames&&(this.frames=t=this.options.onFrames(this),this.log("modified frames",t)),void 0!==t)){this.log("animate",[t,e]),i=!0,this.webAnimation=this.element.animate(t,e);const n=this.getController();null==n||n.add(this);try{await this.webAnimation.finished}catch(t){}null==n||n.remove(this)}return this.didFinish(i),i}isAnimating(){var t,e;return"running"===(null===(t=this.webAnimation)||void 0===t?void 0:t.playState)||(null===(e=this.webAnimation)||void 0===e?void 0:e.pending)}log(t,e){this.shouldLog&&!this.isDisabled()&&console.log(t,this.options.id,e)}}),Pt=f(class extends p{constructor(t){var e;if(super(t),t.type!==d||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const n=t[i];return null==n?e:e+`${i=i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`}),"")}update(t,[e]){const{style:n}=t.element;if(void 0===this.ct){this.ct=new Set;for(const t in e)this.ct.add(t);return this.render(e)}this.ct.forEach((t=>{null==e[t]&&(this.ct.delete(t),t.includes("-")?n.removeProperty(t):n[t]="")}));for(const t in e){const i=e[t];null!=i&&(this.ct.add(t),t.includes("-")?n.setProperty(t,i):n[t]=i)}return i}});let St=class extends o{constructor(){super(...arguments),this._updateCleanupFn=null,this._eventCleanupFns=[],this.positionConfig={},this._isShown=!1,this.animationDuration=200,this.placement="left",this.strategy="absolute",this.arrow=!1,this.flip=void 0,this.autoPlacement=void 0,this.offset={mainAxis:6},this.shift={},this.inline=!1,this.interactive=!1,this.trigger="mouseenter:mouseleave focus:blur",this.zIndex=10}updated(t){const e=[];var i;this.inline&&e.push((void 0===i&&(i={}),{name:"inline",options:i,async fn(t){var e;const{placement:n,elements:o,rects:s,platform:r,strategy:l}=t,{padding:a=2,x:c,y:h}=i,d=T(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({rect:s.reference,offsetParent:await(null==r.getOffsetParent?void 0:r.getOffsetParent(o.floating)),strategy:l}):s.reference),u=null!=(e=await(null==r.getClientRects?void 0:r.getClientRects(o.reference)))?e:[],f=R(a),p=await r.getElementRects({reference:{getBoundingClientRect:function(){var t;if(2===u.length&&u[0].left>u[1].right&&null!=c&&null!=h)return null!=(t=u.find((t=>c>t.left-f.left&&c<t.right+f.right&&h>t.top-f.top&&h<t.bottom+f.bottom)))?t:d;if(u.length>=2){if("x"===O(n)){const t=u[0],e=u[u.length-1],i="top"===_(n),o=t.top,s=e.bottom,r=i?t.left:e.left,l=i?t.right:e.right;return{top:o,bottom:s,left:r,right:l,width:l-r,height:s-o,x:r,y:o}}const t="left"===_(n),e=S(...u.map((t=>t.right))),i=P(...u.map((t=>t.left))),o=u.filter((n=>t?n.left===i:n.right===e)),s=o[0].top,r=o[o.length-1].bottom;return{top:s,bottom:r,left:i,right:e,width:e-i,height:r-s,x:i,y:s}}return d}},floating:o.floating,strategy:l});return s.reference.x!==p.reference.x||s.reference.y!==p.reference.y||s.reference.width!==p.reference.width||s.reference.height!==p.reference.height?{reset:{rects:p}}:{}}})),this.flip&&!this.autoPlacement&&e.push(W(this.flip)),this.offset&&e.push(I(this.offset)),this.shift&&e.push(function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:i,y:n,placement:o}=e,{mainAxis:s=!0,crossAxis:r=!1,limiter:l={fn:t=>{let{x:e,y:i}=t;return{x:e,y:i}}},...a}=t,c={x:i,y:n},h=await L(e,a),d=O(_(o)),u="x"===d?"y":"x";let f=c[d],p=c[u];if(s){const t="y"===d?"bottom":"right";f=k(f+h["y"===d?"top":"left"],f,f-h[t])}if(r){const t="y"===u?"bottom":"right";p=k(p+h["y"===u?"top":"left"],p,p-h[t])}const m=l.fn({...e,[d]:f,[u]:p});return{...m,data:{x:m.x-i,y:m.y-n}}}}}(this.shift)),this.autoPlacement&&e.push(M(this.autoPlacement)),this.arrow&&e.push((t=>({name:"arrow",options:t,async fn(e){const{element:i,padding:n=0}=null!=t?t:{},{x:o,y:s,placement:r,rects:l,platform:a}=e;if(null==i)return"production"!==process.env.NODE_ENV&&console.warn("Floating UI: No `element` was passed to the `arrow` middleware."),{};const c=R(n),h={x:o,y:s},d=O(r),u=E(r),f=$(d),p=await a.getDimensions(i),m="y"===d?"top":"left",v="y"===d?"bottom":"right",g=l.reference[f]+l.reference[d]-h[d]-l.floating[f],y=h[d]-l.reference[d],w=await(null==a.getOffsetParent?void 0:a.getOffsetParent(i));let b=w?"y"===d?w.clientHeight||0:w.clientWidth||0:0;0===b&&(b=l.floating[f]);const x=g/2-y/2,A=c[m],_=b-p[f]-c[v],C=b/2-p[f]/2+x,T=k(A,C,_),L=("start"===u?c[m]:c[v])>0&&C!==T&&l.reference[f]<=l.floating[f];return{[d]:h[d]-(L?C<A?A-C:_-C:0),data:{[d]:T,centerOffset:C-T}}}}))({element:this.arrowElement})),this.positionConfig={placement:this.placement,strategy:this.strategy,middleware:e}}static get styles(){return[c,s`
        :host {
          position: relative;
        }
        #content {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          background-color: var(--cai-popover-bg-color, #fff);
          color: var(--cai-popover-color, #222222);
          transition-property: transform, visibility, opacity;
          border-radius: var(--cai-popover-border-radius, 6px);
          border-width: var(--cai-popover-border-width, 1px);
          border-style: var(--cai-popover-border-style, solid);
          border-color: var(--cai-popover-border-color, #ddd);
          box-shadow: var(--cai-popover-box-shadow-offset-x, 0px)
            var(--cai-popover-box-shadow-offset-y, 0px)
            var(--cai-popover-box-shadow-blur-radius, 20px)
            var(--cai-popover-box-shadow-spread-radius, 0px)
            var(--cai-popover-box-shadow-color, rgba(0, 0, 0, 0.2));
          pointer-events: none;
        }
        #content.shown {
          opacity: 1;
        }
        #content.hidden {
          display: none;
        }
        #content.interactive {
          pointer-events: auto;
        }
        #arrow {
          position: absolute;
          background: var(--cai-popover-bg-color, #fff);
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
        }
        .hidden-layer-dm-plugin {
          position: absolute;
          left: calc(var(--cai-popover-icon-size, 24px) * -1);
          width: calc(var(--cai-popover-icon-size, 24px) * 3);
          height: calc(var(--cai-popover-icon-size, 24px) * 3);
          top: calc(var(--cai-popover-icon-size, 24px) * -1);
        }
      `]}_showTooltip(){this._isShown=!0,this._updatePosition()}_hideTooltip(){this._isShown=!1}_cleanupTriggers(){for(;this._eventCleanupFns.length;){const t=this._eventCleanupFns.shift();null==t||t()}}_setTriggers(){this._cleanupTriggers();const t=this.trigger.split(/\s+/);this._eventCleanupFns=t.map((t=>{const[e,i]=t.split(":");return this.triggerElement.addEventListener(e,this._showTooltip.bind(this)),this.interactive&&"mouseleave"===i?this.hostElement.addEventListener(i,this._hideTooltip.bind(this)):this.triggerElement.addEventListener(i,this._hideTooltip.bind(this)),()=>{this.triggerElement.removeEventListener(e,this._showTooltip),this.interactive&&"mouseleave"===i?this.contentElement.addEventListener(i,this._hideTooltip.bind(this)):this.triggerElement.removeEventListener(i,this._hideTooltip)}}))}async _updatePosition(){const{x:t,y:e,middlewareData:i,placement:n}=await yt(this.triggerElement,this.contentElement,this.positionConfig);if(Object.assign(this.contentElement.style,{left:`${t}px`,top:`${e}px`}),this.arrow&&this.arrowElement&&i.arrow){const{x:t,y:e}=i.arrow,o=this.computeArrowStyle(t,e,n);Object.assign(this.arrowElement.style,o)}}computeArrowStyle(t,e,i){const n={top:"",left:"",bottom:"",right:""};switch(i.split("-")[0]){case"bottom":return Object.assign(Object.assign({},n),{top:"-4px",left:null!==t?`${t}px`:""});case"top":return Object.assign(Object.assign({},n),{left:null!==t?`${t}px`:"",bottom:"-4px"});case"left":return Object.assign(Object.assign({},n),{top:null!==e?`${e}px`:"",right:"-4px"});case"right":return Object.assign(Object.assign({},n),{top:null!==e?`${e}px`:"",left:"-4px"});default:return Object.assign(Object.assign({},n),{display:"none"})}}firstUpdated(){var t;this._setTriggers(),this._updateCleanupFn=function(t,e,i,n){void 0===n&&(n={});const{ancestorScroll:o=!0,ancestorResize:s=!0,elementResize:r=!0,animationFrame:l=!1}=n,a=o&&!l,c=s&&!l,h=a||c?[...Y(t)?pt(t):[],...pt(e)]:[];h.forEach((t=>{a&&t.addEventListener("scroll",i,{passive:!0}),c&&t.addEventListener("resize",i)}));let d,u=null;if(r){let n=!0;u=new ResizeObserver((()=>{n||i(),n=!1})),Y(t)&&!l&&u.observe(t),u.observe(e)}let f=l?ot(t):null;return l&&function e(){const n=ot(t);!f||n.x===f.x&&n.y===f.y&&n.width===f.width&&n.height===f.height||i(),f=n,d=requestAnimationFrame(e)}(),i(),()=>{var t;h.forEach((t=>{a&&t.removeEventListener("scroll",i),c&&t.removeEventListener("resize",i)})),null==(t=u)||t.disconnect(),u=null,l&&cancelAnimationFrame(d)}}(this.triggerElement,this.contentElement,(()=>{this._updatePosition()})),null===(t=this.contentElement)||void 0===t||t.classList.add("hidden")}disconnectedCallback(){var t;null===(t=this._updateCleanupFn)||void 0===t||t.call(this),this._cleanupTriggers(),super.disconnectedCallback()}render(){const t={shown:this._isShown,interactive:this.interactive},e={"z-index":this.zIndex.toString()};return r`<div id="element">
      <div
        id="content"
        class=${m(t)}
        style=${Pt(e)}
        ${Lt({keyframeOptions:{duration:this.animationDuration},onStart:t=>{t.element.classList.contains("shown")&&t.element.classList.remove("hidden")},onComplete:t=>{t.element.classList.contains("shown")||t.element.classList.add("hidden")}})}
      >
        <slot name="content"></slot>
        ${this.arrow?r`<div id="arrow"></div>`:null}
      </div>
      <div id="trigger">
        <div class="hidden-layer-dm-plugin"></div>
        <slot name="trigger"></slot>
      </div>
    </div>`}};t([a()],St.prototype,"_isShown",void 0),t([e({type:Number})],St.prototype,"animationDuration",void 0),t([e({type:String})],St.prototype,"placement",void 0),t([e({type:String})],St.prototype,"strategy",void 0),t([e({type:Boolean})],St.prototype,"arrow",void 0),t([e({type:Object})],St.prototype,"flip",void 0),t([e({type:Object})],St.prototype,"autoPlacement",void 0),t([e({type:Object})],St.prototype,"offset",void 0),t([e({type:Object})],St.prototype,"shift",void 0),t([e({type:Boolean})],St.prototype,"inline",void 0),t([e({type:Boolean})],St.prototype,"interactive",void 0),t([e({type:String})],St.prototype,"trigger",void 0),t([e({type:Number})],St.prototype,"zIndex",void 0),t([h("#arrow")],St.prototype,"arrowElement",void 0),t([h("#content")],St.prototype,"contentElement",void 0),t([h("#element")],St.prototype,"hostElement",void 0),t([h("#trigger")],St.prototype,"triggerElement",void 0),St=t([l("cai-popover-dm-plugin")],St);export{St as Popover,A as d,f as e,m as o};
