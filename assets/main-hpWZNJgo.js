import{r as a,o as l,a as u,b as s,d as t,aq as g,w as e,e as n,_ as y}from"./index-CvE8Fbe-.js";const q={class:"markdown-body"},z=g(`<p>引入 <code>VePagination</code></p><pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> VePagination <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vue-fantable&quot;</span><span class="token punctuation">;</span>

Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VePagination<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><p>使用</p><pre class="language-javascript"><code class="language-javascript"><span class="token operator">&lt;</span>template<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span>ve<span class="token operator">-</span>pagination <span class="token operator">:</span>total<span class="token operator">=</span><span class="token string">&quot;600&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>template<span class="token operator">&gt;</span>
</code></pre>`,4),P={__name:"usage",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor");return l(),u("div",q,[s(c,{"is-edit":"",label:"使用方法",fileName:""}),t(),z])}}},C={class:"markdown-body"},N=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")])])],-1),w=n("p",null,"ve-pagination/base-usage",-1),S={__name:"base-usage",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",C,[s(c,{"is-edit":"",label:"基础示例",fileName:""}),t(),s(p,{filePath:"ve-pagination/base-usage",sourceCode:""},{code:e(()=>[N]),default:e(()=>[w]),_:1})])}}},j={class:"markdown-body"},B=n("p",null,[n("code",null,"page-index"),t(" 属性设置当前页码")],-1),V=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":page-index"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("2"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`)])],-1),E=n("p",null,"ve-pagination/page-index",-1),A={__name:"page-index",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",j,[s(c,{"is-edit":"",label:"当前页码",fileName:""}),t(),s(p,{filePath:"ve-pagination/page-index",sourceCode:""},{description:e(()=>[B]),code:e(()=>[V]),default:e(()=>[E]),_:1})])}}},I={class:"markdown-body"},U=n("p",null,[n("code",null,"page-size"),t(" 属性设置每页大小")],-1),L=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":page-size"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("30"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`)])],-1),T=n("p",null,"ve-pagination/page-size",-1),O={__name:"page-size",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",I,[s(c,{"is-edit":"",label:"每页大小",fileName:""}),t(),s(p,{filePath:"ve-pagination/page-size",sourceCode:""},{description:e(()=>[U]),code:e(()=>[L]),default:e(()=>[T]),_:1})])}}},H={class:"markdown-body"},M=n("p",null,[n("code",null,"pagingCount"),t(" 属性设置向前 5 页和向后 5 页，其中间按钮的个数分页按钮个数")],-1),D=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":paging-count"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("6"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`)])],-1),F=n("p",null,"ve-pagination/paging-buttons",-1),G={__name:"paging-buttons",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",H,[s(c,{"is-edit":"",label:"分页按钮个数",fileName:""}),t(),s(p,{filePath:"ve-pagination/paging-buttons",sourceCode:""},{description:e(()=>[M]),code:e(()=>[D]),default:e(()=>[F]),_:1})])}}},J={class:"markdown-body"},K=n("p",null,[n("code",null,"pageSizeOption"),t(" 属性设置分页下拉配置")],-1),Q=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":page-size-option"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("[5,10,15]"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":page-size"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("5"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`)])],-1),R=n("p",null,"ve-pagination/paging-configuration",-1),W={__name:"paging-configuration",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",J,[s(c,{"is-edit":"",label:"分页下拉配置",fileName:""}),t(),s(p,{filePath:"ve-pagination/paging-configuration",sourceCode:""},{description:e(()=>[K]),code:e(()=>[Q]),default:e(()=>[R]),_:1})])}}},X={class:"markdown-body"},Y=n("p",null,[t("1、"),n("code",null,"on-page-number-change"),t("Page number change callback event<br>2、"),n("code",null,"on-page-size-change"),t("Change callback events under each page")],-1),Z=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(`
        `),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(`
        `),n("span",{class:"token attr-name"},"@on-page-number-change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("pageNumberChange"),n("span",{class:"token punctuation"},'"')]),t(`
        `),n("span",{class:"token attr-name"},"@on-page-size-change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("pageSizeChange"),n("span",{class:"token punctuation"},'"')]),t(`
    `),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[t(`
`),n("span",{class:"token keyword"},"export"),t(),n("span",{class:"token keyword"},"default"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token literal-property property"},"methods"),n("span",{class:"token operator"},":"),t(),n("span",{class:"token punctuation"},"{"),t(`
    `),n("span",{class:"token function"},"pageNumberChange"),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"pageIndex"),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),t("pageIndex"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`

    `),n("span",{class:"token function"},"pageSizeChange"),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"pageSize"),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),t("pageSize"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("script")]),n("span",{class:"token punctuation"},">")]),t(`
`)])],-1),nn=n("p",null,"ve-pagination/callback-events",-1),tn={__name:"callback-events",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",X,[s(c,{"is-edit":"",label:"Callback Events",fileName:""}),t(),s(p,{filePath:"ve-pagination/callback-events",sourceCode:""},{description:e(()=>[Y]),code:e(()=>[Z]),default:e(()=>[nn]),_:1})])}}},an={class:"markdown-body"},sn=n("p",null,[t("1、通过设置 "),n("code",null,"layout"),t(" 属性，改变布局。<br>2、"),n("code",null,"layout"),t(" 属性支持以下配置项：<br>"),n("code",null,"total"),t("：显示总条数、"),n("code",null,"prev"),t("：显示上一页按钮、"),n("code",null,"pager"),t("：显示页码按钮、"),n("code",null,"next"),t("：显示下一页按钮、"),n("code",null,"sizer"),t("：显示每页大小设置、"),n("code",null,"jumper"),t("：显示跳转文本框")],-1),en=n("pre",null,[n("code",{"v-pre":""},[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
            `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),t(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("mb20 bold"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t("不显示页码按钮"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
            `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":layout"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("['total', 'prev', 'next', 'sizer', 'jumper']"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
            `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),t(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("mt30 mb20 bold"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t("调整显示顺序"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
            `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(`
                `),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(`
                `),n("span",{class:"token attr-name"},":layout"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("['total', 'sizer', 'prev', 'pager', 'next', 'jumper']"),n("span",{class:"token punctuation"},'"')]),t(`
            `),n("span",{class:"token punctuation"},"/>")]),t(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`

        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
            `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),t(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("mt30 mb20 bold"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t("完整布局"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
            `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("ve-pagination")]),t(`
                `),n("span",{class:"token attr-name"},":total"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("600"),n("span",{class:"token punctuation"},'"')]),t(`
                `),n("span",{class:"token attr-name"},":layout"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"),n("span",{class:"token punctuation"},'"')]),t(`
            `),n("span",{class:"token punctuation"},"/>")]),t(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`)])],-1),on=n("p",null,"ve-pagination/layout-settings",-1),cn={__name:"layout-settings",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor"),p=a("demo-block");return l(),u("div",an,[s(c,{"is-edit":"",label:"布局设置",fileName:""}),t(),s(p,{filePath:"ve-pagination/layout-settings",sourceCode:""},{description:e(()=>[sn]),code:e(()=>[en]),default:e(()=>[on]),_:1})])}}},pn={class:"markdown-body"},ln=g('<h3 id="props" tabindex="-1">props</h3><table class="md-it-table"><thead><tr><th>参数</th><th>描述</th><th>类型</th><th>可选值</th><th>默认值</th></tr></thead><tbody><tr><td>layout</td><td>布局设置</td><td><code>Array</code></td><td>[‘total’, ‘prev’, ‘pager’, ‘next’, ‘sizer’, ‘jumper’]</td><td>[‘total’, ‘prev’, ‘pager’, ‘next’, ‘sizer’, ‘jumper’]</td></tr><tr><td>total</td><td>总数量</td><td><code>Number</code></td><td>-</td><td>-</td></tr><tr><td>pageIndex</td><td>当前页码</td><td><code>Number</code></td><td>-</td><td>1</td></tr><tr><td>pagingCount</td><td>前 5 页和后 5 页中间的按钮数</td><td><code>Number</code></td><td>-</td><td>5</td></tr><tr><td>pageSize</td><td>每页大小</td><td><code>Number</code></td><td>-</td><td>10</td></tr><tr><td>pageSizeOption</td><td>每页大小下拉配置</td><td><code>Array</code></td><td>-</td><td>[10, 20, 30]</td></tr><tr><td>popperAppendTo</td><td>下拉弹层需要渲染的父节点 。默认渲染到 <code>body</code> 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。<a href="https://codesandbox.io/s/vue-fantable-2-15-0-example-forked-q9k3m0?file=/Example.vue">示例</a></td><td>`String</td><td>HTMLElement`</td><td>-</td></tr></tbody></table><h3 id="event" tabindex="-1">Event</h3><table class="md-it-table"><thead><tr><th>事件名称</th><th>描述</th><th>回调参数</th></tr></thead><tbody><tr><td>on-page-number-change</td><td>页码改变回调事件</td><td>当前页码</td></tr><tr><td>on-page-size-change</td><td>每页大小回调</td><td>每页大小</td></tr></tbody></table>',4),un={__name:"api",setup(i,{expose:o}){return o({frontmatter:{}}),(r,d)=>{const c=a("vue-anchor");return l(),u("div",pn,[s(c,{"is-edit":"",label:"API",fileName:""}),t(),ln])}}},kn={components:{Usage:P,BaseUsage:S,PageIndex:A,PageSize:O,PagingButtons:G,PagingConfiguration:W,CallbackEvents:tn,LayoutSettings:cn,Api:un}},rn=n("h2",null,"Pagination 分页",-1);function dn(i,o,k,r,d,c){const p=a("Usage"),_=a("BaseUsage"),m=a("PageIndex"),v=a("PageSize"),h=a("PagingButtons"),b=a("PagingConfiguration"),f=a("CallbackEvents"),x=a("LayoutSettings"),$=a("Api");return l(),u("div",null,[rn,s(p),s(_),s(m),s(v),s(h),s(b),s(f),s(x),s($)])}const _n=y(kn,[["render",dn]]);export{_n as default};
