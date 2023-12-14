:::anchor footer 列合并

:::demo 设置 footer 汇总第 1 行`date`列和`hoby`列合并。 同时需要指定第 2 行`hoby`列不渲染

```html
<template>
    <ve-table
        border-y
        fixed-header
        :max-height="300"
        :columns="columns"
        :table-data="tableData"
        :footer-data="footerData"
        rowKeyFieldName="rowKey"
        :cell-span-option="cellSpanOption"
    />
</template>

<script>
    export default {
        data() {
            return {
                cellSpanOption: {
                    footerCellSpan: this.footerCellSpan,
                },
                columns: [
                    {
                        field: "name",
                        key: "a",
                        title: "Name",
                        width: 200,
                        align: "center",
                    },
                    {
                        field: "date",
                        key: "b",
                        title: "Date",
                        width: 200,
                        align: "left",
                    },
                    {
                        field: "hobby",
                        key: "c",
                        title: "Hobby",
                        width: 200,
                        align: "right",
                    },
                    { field: "address", key: "d", title: "Address", width: "" },
                ],
                tableData: [
                    {
                        name: "John",
                        date: "1900-05-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Shanghai",
                    },
                    {
                        name: "Dickerson",
                        date: "1910-06-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Beijing",
                    },
                    {
                        name: "Larsen",
                        date: "2000-07-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Chongqing",
                    },
                    {
                        name: "Geneva",
                        date: "2010-08-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Xiamen",
                    },
                    {
                        name: "Jami",
                        date: "2020-09-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Shenzhen",
                    },
                ],
            };
        },
        methods: {
            // footer cell span
            footerCellSpan({ row, column, rowIndex }) {
                if (rowIndex === 0) {
                    if (column.field === "date") {
                        return {
                            rowspan: 1,
                            colspan: 2,
                        };
                    }
                    // does not need to be rendered
                    else if (column.field === "hobby") {
                        return {
                            rowspan: 0,
                            colspan: 0,
                        };
                    }
                }
            },
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
