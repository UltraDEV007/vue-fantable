:::anchor 表格动态宽度（calc css 函数）

:::demo 1、你可以使用 [calc css 函数](<https://developer.mozilla.org/en-US/docs/Web/CSS/calc()>) 实现表格动态宽度<br>2、试试改变浏览器宽度查看效果

```html
<template>
    <fan-table style="width:calc(55vw - 10px);" :columns="columns" :table-data="tableData" />
</template>

<script>
    export default {
        data() {
            return {
                columns: [
                    { field: "name", key: "a", title: "Name", width: 100 },
                    { field: "date", key: "b", title: "Tel", width: 200 },
                    { field: "hobby", key: "c", title: "Hobby", width: 300 },
                    { field: "address", key: "d", title: "Address", width: 300 },
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
    };
</script>
```

:::