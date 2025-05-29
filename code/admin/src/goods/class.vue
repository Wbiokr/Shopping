<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 400px;" class="filter-item" placeholder="標題" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="classTarget = { name: '' }" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="給我一點時間" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="分類ID">
        <template slot-scope="scope">
          <span>{{scope.row.goodsClassID}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="名稱">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="狀態">
        <template slot-scope="scope">
          <span :class="scope.row.status == 'C' ? 'c-red' : 'c-sus'">{{scope.row.status == 'C' ? '失效' : '正常'}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="classTarget = scope.row">編輯</el-button>
          <el-button v-if="scope.row.status!='0'" size="small" type="success" @click="handleModifyStatus(scope.row,'0')">啟用
          </el-button>
          <el-button v-else size="small" @click="handleModifyStatus(scope.row,'C')">禁用
          </el-button>
          <el-button size="small" type="danger" @click="onDelete(scope.row)">刪除
          </el-button>
          
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog v-if="classTarget" title="商品類編輯" :visible="true">
      <el-form>
        <el-form-item label="名稱" prop="name">
          <el-input v-model="classTarget.name" :maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="classTarget = null">取 消</el-button>
        <el-button :loading='saving' type="primary" @click="onSave">確 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { goodsClassPageList, createGoodsClass, delGoodsClass, updateGoodsClass} from '@/api/goods'
import waves from '@/directive/waves/index.js' // 水波紋指令

// arr to obj
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'productList',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      saving: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        // type: ''
      },
      dialogStatus: '',
      classTarget: null,
      pvData: [],
      tableKey: 0
    }
  },
  filters: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      goodsClassPageList(this.listQuery).then(data => {
        this.list = data.result;
        this.total = data.total;
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      updateGoodsClass({...row, status}).then(data => {
        this.$message({
          message: data.msg,
          type: 'success'
        })
        row.status = status;
      })
    },

    onDelete(row) {
      this.$confirm('此操作將永久刪除該分類, 是否繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsClass({ ...row }).then(data => {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.getList()
        })
      })
    },
    async onSave() {
      if (!this.classTarget.name) {
        this.$message({
          message: '請填寫分類名稱',
          type: 'warning'
        })
        return
      }
      this.saving = true
      const action = this.classTarget.goodsClassID ? updateGoodsClass : createGoodsClass
      try {
        await action({
          parentId: 0,
          status: '0',
          ...this.classTarget,
        })
        this.saving = false
        this.classTarget = null
        this.getList()
      } catch (error) {
        
      } finally {
        this.saving = false
      }
    },

    handleCreate() {
      // this.$router.push({path: '/goods/class/create'})
    },
    handleUpdate(row) {
      // this.$router.push({path: '/goods/class/edit/'+row.goodsClassID});
    },
  }
}
</script>
