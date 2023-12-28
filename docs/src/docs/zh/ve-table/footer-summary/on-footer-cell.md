:::anchor footer 列事件自定义

:::demo

```html
<template>
    <div>
        打开F12 查看 console 信息
        <ve-table
            border-y
            fixed-header
            :max-height="300"
            :columns="columns"
            :table-data="tableData"
            :footer-data="footerData"
            rowKeyFieldName="rowKey"
            :event-custom-option="eventCustomOption"
        />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                eventCustomOption: {
                    footerCellEvents: ({ row, column, rowIndex }) => {
                        return {
                            click: (event) => {
                                console.log("click::", row, column, rowIndex, event);
                            },
                            dblclick: (event) => {
                                console.log("dblclick::", row, column, rowIndex, event);
                            },
                            contextmenu: (event) => {
                                console.log("contextmenu::", row, column, rowIndex, event);
                            },
                            mouseenter: (event) => {
                                console.log("mouseenter::", row, column, rowIndex, event);
                            },
                            mouseleave: (event) => {
                                console.log("mouseleave::", row, column, rowIndex, event);
                            },
                        };
                    },
                },
                columns: [
                    {
                        field: "",
                        key: "a",
                        title: "",
                        width: 50,
                        align: "center",
                        renderBodyCell: ({ row, column, rowIndex }, h) => {
                            return ++rowIndex;
                        },
                    },
                    {
                        field: "name",
                        key: "b",
                        title: "Name",
                        width: 200,
                        align: "left",
                    },
                    {
                        field: "hobby",
                        key: "c",
                        title: "Hobby",
                        width: 300,
                        align: "left",
                    },
                    {
                        field: "address",
                        key: "d",
                        title: "Address",
                        width: "",
                        align: "left",
                    },
                ],
                tableData: [],
            };
        },
        methods: {
            initTableData() {
                let data = [];
                for (let i = 0; i < 15; i++) {
                    data.push({
                        rowKey: i,
                        name: i,
                        date: i,
                        hobby: i,
                        address: i,
                    });
                }
                this.tableData = data;
            },

            initFooterData() {
                this.footerData = [
                    {
                        rowKey: 0,
                        name: "平均值",
                        date: 213,
                        hobby: 355,
                        address: 189,
                    },
                    {
                        rowKey: 1,
                        name: "汇总值",
                        date: 1780,
                        hobby: 890,
                        address: 2988,
                    },
                ];
            },
        },
        created() {
            this.initTableData();
            this.initFooterData();
        },
    };
</script>
```

:::
