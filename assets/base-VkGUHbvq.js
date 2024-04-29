import{P as B,h as q,Q as h,R as z,S as F,U as R,M as b,k as d,l as $,m,q as N,E as J,n as T,K as U,V as A}from"./index-CvE8Fbe-.js";function D(e){for(var s=-1,t=e==null?0:e.length,o={};++s<t;){var a=e[s];o[a[0]]=a[1]}return o}function Y(e){return e==null}const ee=e=>e===void 0,se=e=>typeof e=="boolean",te=e=>typeof e=="number",ne=e=>!e&&e!==0||q(e)&&e.length===0||h(e)&&!Object.keys(e).length,oe=e=>typeof Element>"u"?!1:e instanceof Element,ae=e=>Y(e),re=e=>B(e)?!Number.isNaN(Number(e)):!1,w="__epPropKey",ue=e=>e,C=e=>h(e)&&!!e[w],E=(e,s)=>{if(!h(e)||C(e))return e;const{values:t,required:o,default:a,type:u,validator:c}=e,y={type:u,required:!!o,validator:t||c?i=>{let f=!1,I=[];if(t&&(I=Array.from(t),z(e,"default")&&I.push(a),f||(f=I.includes(i))),c&&(f||(f=c(i))),!f&&I.length>0){const S=[...new Set(I)].map(g=>JSON.stringify(g)).join(", ");F(`Invalid prop: validation failed${s?` for prop "${s}"`:""}. Expected one of [${S}], got value ${JSON.stringify(i)}.`)}return f}:void 0,[w]:!0};return z(e,"default")&&(y.default=a),y},le=e=>D(Object.entries(e).map(([s,t])=>[s,E(t,s)])),ce=(e,s)=>{if(e.install=t=>{for(const o of[e,...Object.values(s??{})])t.component(o.name,o)},s)for(const[t,o]of Object.entries(s))e[t]=o;return e},ie=e=>(e.install=R,e),L=["","default","small","large"],_="el",M="is-",p=(e,s,t,o,a)=>{let u=`${e}-${s}`;return t&&(u+=`-${t}`),o&&(u+=`__${o}`),a&&(u+=`--${a}`),u},Q=Symbol("namespaceContextKey"),V=e=>{const s=e||(b()?d(Q,$(_)):$(_));return m(()=>N(s)||_)},de=(e,s)=>{const t=V(s);return{namespace:t,b:(n="")=>p(t.value,e,n,"",""),e:n=>n?p(t.value,e,"",n,""):"",m:n=>n?p(t.value,e,"","",n):"",be:(n,r)=>n&&r?p(t.value,e,n,r,""):"",em:(n,r)=>n&&r?p(t.value,e,"",n,r):"",bm:(n,r)=>n&&r?p(t.value,e,n,"",r):"",bem:(n,r,l)=>n&&r&&l?p(t.value,e,n,r,l):"",is:(n,...r)=>{const l=r.length>=1?r[0]:!0;return n&&l?`${M}${n}`:""},cssVar:n=>{const r={};for(const l in n)n[l]&&(r[`--${t.value}-${l}`]=n[l]);return r},cssVarName:n=>`--${t.value}-${n}`,cssVarBlock:n=>{const r={};for(const l in n)n[l]&&(r[`--${t.value}-${e}-${l}`]=n[l]);return r},cssVarBlockName:n=>`--${t.value}-${e}-${n}`}},K=e=>{const s=b();return m(()=>{var t,o;return(o=(t=s==null?void 0:s.proxy)==null?void 0:t.$props)==null?void 0:o[e]})},O={prefix:Math.floor(Math.random()*1e4),current:0},Z=Symbol("elIdInjection"),x=()=>b()?d(Z,O):O,H=e=>{const s=x(),t=V();return m(()=>N(e)||`${t.value}-id-${s.prefix}-${s.current++}`)},ve=E({type:String,values:L,required:!1}),W=Symbol("size"),X=()=>{const e=d(W,{});return m(()=>N(e.size)||"")};var fe=(e,s)=>{const t=e.__vccOpts||e;for(const[o,a]of s)t[o]=a;return t};const P=Symbol("formContextKey"),j=Symbol("formItemContextKey"),pe=(e,s={})=>{const t=$(void 0),o=s.prop?t:K("size"),a=s.global?t:X(),u=s.form?{size:void 0}:d(P,void 0),c=s.formItem?{size:void 0}:d(j,void 0);return m(()=>o.value||N(e)||(c==null?void 0:c.size)||(u==null?void 0:u.size)||a.value||"")},me=e=>{const s=K("disabled"),t=d(P,void 0);return m(()=>s.value||N(e)||(t==null?void 0:t.disabled)||!1)},ye=()=>{const e=d(P,void 0),s=d(j,void 0);return{form:e,formItem:s}},Ie=(e,{formItemContext:s,disableIdGeneration:t,disableIdManagement:o})=>{t||(t=$(!1)),o||(o=$(!1));const a=$();let u;const c=m(()=>{var v;return!!(!e.label&&s&&s.inputIds&&((v=s.inputIds)==null?void 0:v.length)<=1)});return J(()=>{u=T([U(e,"id"),t],([v,y])=>{const i=v??(y?void 0:H().value);i!==a.value&&(s!=null&&s.removeInputId&&(a.value&&s.removeInputId(a.value),!(o!=null&&o.value)&&!y&&i&&s.addInputId(i)),a.value=i)},{immediate:!0})}),A(()=>{u&&u(),s!=null&&s.removeInputId&&a.value&&s.removeInputId(a.value)}),{isLabeledByFormItem:c,inputId:a}};export{fe as _,de as a,le as b,ye as c,ue as d,pe as e,ee as f,te as g,Y as h,ne as i,me as j,se as k,ae as l,H as m,Ie as n,ie as o,re as p,E as q,D as r,V as s,x as t,ve as u,oe as v,ce as w,j as x,L as y};
