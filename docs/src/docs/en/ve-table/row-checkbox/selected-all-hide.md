:::anchor Hide Select All Checkbox

:::demo Hide the select all checkbox by `hideSelectAll=true`

```html
<template>
    <div>
        <ve-table
            style="width:100%"
            :columns="columns"
            :table-data="tableData"
            row-key-field-name="rowKey"
            :checkbox-option="checkboxOption"
        />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                checkboxOption: {
                    hideSelectAll: true,
                    // 行选择改变事件
                    selectedRowChange: ({ row, isSelected, selectedRowKeys }) => {
                        console.log(row, isSelected, selectedRowKeys);
                    },
                    // 全选改变事件
                    selectedAllChange: ({ isSelected, selectedRowKeys }) => {
                        console.log(isSelected, selectedRowKeys);
                    },
                },

                columns: [
                    {
                        field: "",
                        key: "a",
                        // type=checkbox
                        type: "checkbox",
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
    };
</script>
```

:::
