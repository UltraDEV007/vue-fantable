import"./base-VkGUHbvq.js";import{E as u}from"./el-button-DK-ZOO5l.js";import{_ as b,r as m,o as p,a as f,b as o,w as r,d as s,e as a,B as _}from"./index-CvE8Fbe-.js";import"./index-RG-JzF8H.js";import"./index-khJ6YqWt.js";const h={data(){return{virtualScrollOption:{enable:!1},columns:[{field:"index",key:"a",title:"#",width:100,align:"left"},{field:"name",key:"b",title:"Name",width:200,align:"left"},{field:"hobby",key:"c",title:"Hobby",width:300,align:"left"},{field:"address",key:"d",title:"Address",width:"",align:"left"}],tableData:[]}},mounted(){this.createTableData()},methods:{switchVirtual(e){this.virtualScrollOption.enable=!!e},createTableData(){const e=[];for(let t=0;t<100;t++)e.push({rowKey:t,index:t,name:`name${t}`,hobby:`hobby${t}`,address:`address${t}`});this.tableData=e}}},y=a("br",null,null,-1),w=a("br",null,null,-1),v=a("br",null,null,-1);function k(e,t,x,g,l,n){const i=u,d=m("fan-table");return p(),f("div",null,[o(i,{type:"primary",onClick:t[0]||(t[0]=c=>n.switchVirtual(1))},{default:r(()=>[s("开启虚拟滚动")]),_:1}),o(i,{type:"primary",onClick:t[1]||(t[1]=c=>n.switchVirtual(0))},{default:r(()=>[s("禁用虚拟滚动")]),_:1}),y,w,a("div",null,"虚拟滚动状态："+_(l.virtualScrollOption.enable?"已开启":"已禁用"),1),v,o(d,{"max-height":500,"virtual-scroll-option":l.virtualScrollOption,columns:l.columns,"table-data":l.tableData,"row-key-field-name":"rowKey"},null,8,["virtual-scroll-option","columns","table-data"])])}const E=b(h,[["render",k]]);export{E as default};
