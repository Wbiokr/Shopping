<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 400px;" class="filter-item" placeholder="標題" v-model="listQuery.title">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="類型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="編號" width="80" prop="subjectID">
      </el-table-column>

      <el-table-column width="180px" align="center" label="發佈時間">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="標題">
        <template slot-scope="scope">
          <router-link :to="'/subject/edit/'+scope.row.subjectID" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="狀態" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteObj(scope.$index,scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList ,delModel} from '@/api/model'
import waves from '@/directive/waves/index.js' // 水波紋指令
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SubjectList',
  directives: {
    waves
  },
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '正常',
        'C': '失效',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      calendarTypeOptions:[],
      listQuery: {
        page: 1,
        limit: 20,
        where:"status !='D'"
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCreate() {
      this.$router.push({path: '/subject/create'})
    },
    getList() {
      this.listLoading = true
      fetchList('subject',this.listQuery).then(data => {
        this.list =  data.result;
        this.total =  data.total;
        this.listLoading = false
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    deleteObj(index,row){
      this.$confirm("您確定要刪除嗎？", "提示").then(() => {
        delModel('subject',row.subjectID).then(data => {
          this.list.splice(index, 1);
        });
      });

    },
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
