:::anchor 可控属性

:::demo 1、`selectedRowKey`为单选的"可控属性"，选择后需要在`selectedRowChange`事件中做重新赋值处理。通过这个属性可以自定义更多功能<br>2、设置`selectedRowKey`属性后 `defaultSelectedRowKey`属性将会失效

```html
<template>
    <div>
        <button class="button-demo" @click="selectedSwitch(1002)">第二行选中切换</button>
        <button class="button-demo" @click="unselected()">取消选中</button>
        <br />
        <br />
        <ve-table
            style="width:100%"
            :columns="columns"
            :table-data="tableData"
            :radio-option="radioOption"
            row-key-field-name="rowKey"
        />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                radioOption: {
                    selectedRowKey: "",
                    // 行选择改变事件
                    selectedRowChange: ({ row }) => {
                        this.changeSelectedRowKey(row.rowKey);
                    },
                },
                columns: [
                    {
                        field: "",
                        key: "a",
                        // type=radio
                        type: "radio",
                        title: "",
                        width: 50,
                        align: "center",
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
                tableData: [
                    {
                        rowKey: 1001,
                        name: "John",
                        date: "1900-05-20",
                        hobby: "coding",
                        address: "No.1 Century Avenue, Shanghai",
                    },
                    {
                        rowKey: 1002,
                        name: "Dickerson",
                        date: "1910-06-20",
                        hobby: "coding",
                        address: "No.1 Century Avenue, Beijing",
                    },
                    {
                        rowKey: 1003,
                        name: "Larsen",
                        date: "2000-07-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Chongqing",
                    },
                    {
                        rowKey: 1004,
                        name: "Geneva",
                        date: "2010-08-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Xiamen",
                    },
                    {
                        rowKey: 1005,
                        name: "Jami",
                        date: "2020-09-20",
                        hobby: "coding and coding repeat",
                        address: "No.1 Century Avenue, Shenzhen",
                    },
                ],
            };
        },
        methods: {
            changeSelectedRowKey(key) {
                this.radioOption.selectedRowKey = key;
            },
            // 切换选中行
            selectedSwitch(key) {
                let selectedRowKey = this.radioOption.selectedRowKey;

                if (selectedRowKey === key) {
                    this.radioOption.selectedRowKey = "";
                } else {
                    this.radioOption.selectedRowKey = key;
                }
            },
            // 取消选中
            unselected() {
                this.radioOption.selectedRowKey = "";
            },
        },
    };
</script>
```

:::
