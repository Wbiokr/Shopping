<template>
  <div class="app-container">

    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="apple">apple</el-checkbox>
        <el-checkbox label="banana">banana</el-checkbox>
        <el-checkbox label="orange">orange</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :data="tableData" :key="key" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180"/>
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template slot-scope="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
const defaultFormThead = ['apple', 'banana']

export default {
  data() {
    return {
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20'
        }
      ],
      key: 1, // table key
      formTheadOptions: ['apple', 'banana', 'orange'],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默認表頭 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 為了保證table 每次都會重渲 In order to ensure the table will be re-rendered each time
    }
  }
}
</script>

