:::anchor scrollToRowKey

:::demo 1、Scroll the table to the location of the row key

```html
<template>
    <div>
        <div style="margin-bottom:20px;line-height:3.0;">
            <button class="button-demo" @click="scrollToRowKey(9999)">
                Scroll to the row with rowkey 9999
            </button>
            <button class="button-demo" @click="scrollToRowKey(9989)">
                Scroll to the row with rowkey 9989
            </button>
            <button class="button-demo" @click="scrollToRowKey(5000)">
                Scroll to the row with rowkey 5000
            </button>
            <button class="button-demo" @click="scrollToRowKey(0)">
                Scroll to the row with rowkey 0
            </button>
        </div>
        <ve-table
            ref="tableRef"
            style="width:1000px"
            :scroll-width="1600"
            :max-height="400"
            border-y
            :columns="columns"
            :table-data="tableData"
            rowKeyFieldName="rowKey"
            :virtual-scroll-option="virtualScrollOption"
        />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                virtualScrollOption: {
                    // 是否开启
                    enable: true,
                    minRowHeight: 40,
                },
                tableData: [],
                columns: [
                    {
                        field: "col1",
                        key: "a",
                        title: "col1",
                        width: 50,
                        fixed: "left",
                    },
                    {
                        title: "col2-col3",
                        fixed: "left",
                        children: [
                            {
                                field: "col2",
                                key: "b",
                                title: "col2",
                                width: 50,
                            },
                            {
                                field: "col3",
                                key: "c",
                                title: "col3",
                                width: 50,
                            },
                        ],
                    },
                    {
                        title: "col4-col5-col6",
                        children: [
                            {
                                title: "col4-col5",
                                children: [
                                    {
                                        field: "col4",
                                        key: "d",
                                        title: "col4",
                                        width: 130,
                                    },
                                    {
                                        field: "col5",
                                        key: "e",
                                        title: "col5",
                                        width: 140,
                                    },
                                ],
                            },
                            {
                                title: "col6",
                                field: "col6",
                                key: "f",
                                width: 140,
                            },
                        ],
                    },
                    {
                        title: "col7",
                        fixed: "right",
                        children: [
                            {
                                title: "col7-1",
                                field: "col7",
                                key: "g",
                                width: 50,
                            },
                        ],
                    },
                    {
                        field: "col8",
                        key: "h",
                        title: "col8",
                        width: 50,
                        fixed: "right",
                    },
                ],
            };
        },
        methods: {
            getRandom(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            initTableData() {
                for (let i = 0; i < 10000; i++) {
                    this.tableData.push({
                        rowKey: i,
                        col1: i,
                        col2: i,
                        col3: i,
                        col4: i,
                        col5: i,
                        col6: i,
                        col7: i,
                        col8: i,
                    });
                }
            },
            // scroll y
            scrollToRowKey(rowKey) {
                this.$refs["tableRef"].scrollToRowKey({ rowKey: rowKey });
            },
        },
        created() {
            this.initTableData();
        },
    };
</script>
```

:::
