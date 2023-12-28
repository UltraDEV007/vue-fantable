:::anchor Expand Table

:::demo It's easy to expand the table,Just return the contents of the component containing the table as a `render` rendering function

```html
<template>
    <ve-table
        style="width:100%"
        :columns="columns"
        :table-data="tableData"
        :expand-option="expandOption"
        row-key-field-name="rowKey"
    />
</template>

<script>
    // This example defines a subcomponent inside the component. Of course, you can also import a component through the 'import' keyword
    const ChildTableComp = {
        name: "ChildTableComp",
        template: `
        <div class="child-table-comp">
            <span style="font-weight:bold;">Table Name:{{row.name}}</span>
            <ve-table
              style="width:100%"
              :columns="columns"
              :table-data="tableData"
            />
        </div>
    `,
        props: {
            row: Object,
        },
        data() {
            return {
                columns: [
                    { field: "col1", key: "a", title: "Col1" },
                    { field: "col2", key: "b", title: "Col2" },
                    { field: "col3", key: "c", title: "Col3" },
                    { field: "col4", key: "d", title: "Col4" },
                    { field: "col5", key: "e", title: "Col5" },
                ],
                tableData: [
                    {
                        col1: "1",
                        col2: "2",
                        col3: "3",
                        col4: "4",
                        col5: "5",
                    },
                    {
                        col1: "1",
                        col2: "2",
                        col3: "3",
                        col4: "4",
                        col5: "5",
                    },
                    {
                        col1: "1",
                        col2: "2",
                        col3: "3",
                        col4: "4",
                        col5: "5",
                    },
                ],
            };
        },
    };

    export default {
        data() {
            return {
                expandOption: {
                    defaultExpandedRowKeys: [1001],
                    render: ({ row, column, rowIndex }, h) => {
                        return <ChildTableComp row={row} />;
                    },
                },
                columns: [
                    {
                        field: "",
                        key: "a",
                        // 设置需要显示展开图标的列
                        type: "expand",
                        title: "",
                        width: 50,
                        align: "center",
                    },
                    {
                        field: "name",
                        key: "b",
                        title: "Name",
                        width: 200,
                        align: "center",
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
