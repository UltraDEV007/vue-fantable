import{_ as a,r as d,o as i,a as l,b as r}from"./index-CvE8Fbe-.js";const h={data(){return{eventCustomOption:{bodyRowEvents:({row:e,rowIndex:o})=>({click:t=>{const c=e.rowKey;this.changeSelectedRowKeysByRowClick(c)}})},checkboxOption:{selectedRowKeys:[1003],selectedRowChange:({row:e,isSelected:o,selectedRowKeys:t})=>{},selectedAllChange:({isSelected:e,selectedRowKeys:o})=>{this.changeSelectedRowKeys(o)}},columns:[{field:"",key:"a",type:"checkbox",title:"",width:50,align:"center"},{field:"name",key:"b",title:"Name",width:200,align:"left"},{field:"hobby",key:"c",title:"Hobby",width:300,align:"left"},{field:"address",key:"d",title:"Address",width:"",align:"left"}],tableData:[{rowKey:1001,name:"John",date:"1900-05-20",hobby:"coding",address:"No.1 Century Avenue, Shanghai"},{rowKey:1002,name:"Dickerson",date:"1910-06-20",hobby:"coding",address:"No.1 Century Avenue, Beijing"},{rowKey:1003,name:"Larsen",date:"2000-07-20",hobby:"coding and coding repeat",address:"No.1 Century Avenue, Chongqing"},{rowKey:1004,name:"Geneva",date:"2010-08-20",hobby:"coding and coding repeat",address:"No.1 Century Avenue, Xiamen"},{rowKey:1005,name:"Jami",date:"2020-09-20",hobby:"coding and coding repeat",address:"No.1 Century Avenue, Shenzhen"}]}},methods:{changeSelectedRowKeys(e){this.checkboxOption.selectedRowKeys=e},changeSelectedRowKeysByRowClick(e){const{selectedRowKeys:o}=this.checkboxOption;if(o.includes(e)){const t=o.indexOf(e);o.splice(t,1)}else o.push(e)}}};function y(e,o,t,c,n,b){const s=d("fan-table");return i(),l("div",null,[r(s,{style:{width:"100%"},columns:n.columns,"table-data":n.tableData,"row-key-field-name":"rowKey","checkbox-option":n.checkboxOption,"event-custom-option":n.eventCustomOption},null,8,["columns","table-data","checkbox-option","event-custom-option"])])}const u=a(h,[["render",y]]);export{u as default};
