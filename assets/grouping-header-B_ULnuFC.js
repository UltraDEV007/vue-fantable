import{_ as c,r as i,o as a,c as d}from"./index-CvE8Fbe-.js";const n={data(){return{columns:[{field:"col1",key:"a",title:"col1",width:"10%"},{title:"col2-col3",children:[{field:"col2",key:"b",title:"col2",width:100},{field:"col3",key:"c",title:"col3",width:110}]},{title:"col4-col5-col6",children:[{title:"col4-col5",children:[{field:"col4",key:"d",title:"col4",width:130},{field:"col5",key:"e",title:"col5",width:140}]},{title:"col6",field:"col6",key:"f",width:140}]},{field:"col7",key:"g",title:"col7",width:150},{field:"col8",key:"h",title:"col8",width:160}],tableData:[]}},created(){this.initTableData()},methods:{initTableData(){const t=[];for(let l=0;l<6;l++)t.push({rowKey:l,col1:l,col2:l,col3:l,col4:l,col5:l,col6:l,col7:l,col8:l});this.tableData=t}}};function r(t,l,s,f,e,h){const o=i("fan-table");return a(),d(o,{"border-y":"",columns:e.columns,"table-data":e.tableData},null,8,["columns","table-data"])}const u=c(n,[["render",r]]);export{u as default};
