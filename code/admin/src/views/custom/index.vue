<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 180px;" class="filter-item" placeholder="用戶名" v-model="listQuery.username">
      </el-input>
      <!-- <el-date-picker
        style="width: 350px"
        class="filter-item"
        v-model="dates"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        :picker-options="pickerOptions">
      </el-date-picker> -->

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="狀態">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-export" @click="handleExport">導出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="給我一點時間" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="用戶暱稱" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="帳號" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" width="150" label="註冊時間">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="登錄次數">
        <template slot-scope="scope">
          <span>{{scope.row.loginNum}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="最後登錄時間">
        <template slot-scope="scope">
          <span>{{scope.row.lastLoginTime | timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="手機號碼">
        <template slot-scope="scope">
          <span>{{scope.row.cell}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="狀態" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | userStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status=='0'" size="small" type="danger" @click="handleModifyStatus(scope.row,'C')">禁用
          </el-button>
          <el-button v-if="scope.row.status=='C'" size="small" type="primary" @click="handleModifyStatus(scope.row,'0')">啟用
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { fetchList, updateCustomStatus, exportCustoms} from '@/api/custom'
import waves from '@/directive/waves/index.js' // 水波紋指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: '', display_name: '全部' },
  { key: '0', display_name: '正常' },
  { key: 'C', display_name: '禁用' },
]
const aweek=function () {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  return [start, end];
}


export default {
  name: 'customList',
  directives: {
    waves
  },
  data() {
    return {
      opBy:this.$store.state.user.name,
      list: null,
      total: null,
      listLoading: true,
      dates: aweek(),
      listQuery: {
        page: 1,
        limit: 20,
        username:'',
        // startDate: '',
        // endDate:'',
        status: ''
      },
      calendarTypeOptions,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      tableKey: 0,
      pickerOptions: {
        shortcuts: [{
          text: '最近一週',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一個月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三個月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  filters: {
    timeFilter(time){
      return parseTime(time,'YYYY-MM-DD HH:mm:ss');
    },
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        C: 'error',
      }
      return statusMap[status]
    },
    userStatusFilter(status) {
      const statusMap = {
        0: '正常',
        C: '禁用',
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async handleExport() {
      this.exporting = true
      try {
        const response = await exportCustoms({ })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '客戶列表.csv');
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        
      }
    },
    getList() {
      this.listLoading = true
      // this.listQuery.startDate=this.dates ? this.dates[0] : '';
      // this.listQuery.endDate=this.dates ? this.dates[1] : '';
      fetchList(this.listQuery).then(data => {
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
      this.$confirm("您確定要操作嗎？","提示",{type:'warning'}).then(()=> {
        updateCustomStatus({uid: row.uid, status,opBy:this.opBy}).then(data => {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          row.status = status;
        })
      }).catch((error)=>{});
    }
  }
}
</script>
