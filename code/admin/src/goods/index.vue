<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 400px;" class="filter-item" placeholder="標題" v-model="listQuery.title">
      </el-input>

      <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="類型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select> -->

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-export" @click="handleExport">導出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="給我一點時間" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="商品編號" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.goodsID}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="發佈時間">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="標題">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="110px" align="center" label="類型">
        <template slot-scope="scope">
          <span>{{scope.row.goodsType | typeFilter}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="100px" align="center" label="單價">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="銷售量" width="95">
        <template slot-scope="scope">
          <span class="link-type" @click='handleFetchPv(scope.row.numSale)'>{{scope.row.numSale}}</span>
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="是否推薦" width="y0">
        <template slot-scope="scope">
          <el-tag :type="scope.row.recommendFlag | recommendFilter">{{ scope.row.recommendFlag | goodsRecommendFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否banner" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.bannerFlag | recommendFilter">{{ scope.row.bannerFlag | goodsRecommendFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否新品" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.newFlag | recommendFilter">{{ scope.row.newFlag | goodsRecommendFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否熱銷" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.hotFlag | recommendFilter">{{ scope.row.hotFlag | goodsRecommendFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="狀態" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.goodsStatus | statusFilter">{{ scope.row.goodsStatus | goodsStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.goodsStatus!='U'" size="mini" type="success" @click="handleModifyStatus(scope.row,'U')">上架
          </el-button>
          <el-button v-if="scope.row.goodsStatus=='U'" size="mini" @click="handleModifyStatus(scope.row,'D')">下架
          </el-button>
          <el-dropdown @command="e=>handleCommand(e,scope.row)">
            <!-- <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span> -->
            <el-button size="mini" class="m-l-10">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.recommendFlag=='1'" command="recommend-false">不推薦</el-dropdown-item>
              <el-dropdown-item v-else command="recommend-true">推薦</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.bannerFlag=='1'" command="banner-false">下banner</el-dropdown-item>
              <el-dropdown-item v-else command="banner-true">上banner</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.newFlag=='1'" command="new-false">非新品</el-dropdown-item>
              <el-dropdown-item v-else command="new-true">是新品</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.hotFlag=='1'" command="hot-false">非熱銷</el-dropdown-item>
              <el-dropdown-item v-else command="hot-true">是熱銷</el-dropdown-item>
              <el-dropdown-item command="copy">複製</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.goodsStatus!='C'" command="del">刪除</el-dropdown-item>
              <el-dropdown-item v-else command="recover">恢復</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button v-if="scope.row.recommendFlag=='1'" size="mini" type="info" @click="handleRecommendFlag(scope.row, 'recommendFlag', '0')">不推薦
          </el-button>
          <el-button v-else size="mini" type="primary" @click="handleRecommendFlag(scope.row, 'recommendFlag', '1')">推薦
          </el-button>
          <el-button v-if="scope.row.bannerFlag=='1'" size="mini" type="info" @click="handleRecommendFlag(scope.row, 'bannerFlag', '0')">下banner
          </el-button>
          <el-button v-else size="mini" type="primary" @click="handleRecommendFlag(scope.row, 'bannerFlag', '1')">上banner
          </el-button>
           <el-button v-if="scope.row.newFlag=='1'" size="mini" type="info" @click="handleRecommendFlag(scope.row, 'newFlag', '0')">非新品
          </el-button>
          <el-button v-else size="mini" type="primary" @click="handleRecommendFlag(scope.row, 'newFlag', '1')">是新品
          </el-button>
           <el-button v-if="scope.row.hotFlag=='1'" size="mini" type="info" @click="handleRecommendFlag(scope.row, 'hotFlag', '0')">非熱銷
          </el-button>
          <el-button v-else size="mini" type="primary" @click="handleRecommendFlag(scope.row, 'hotFlag', '1')">是熱銷
          </el-button>

          <el-button size="mini" type="danger" @click="copyGoods(scope.row)">複製
          </el-button>
          
          <el-button v-if="scope.row.goodsStatus!='C'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'C')">刪除
          </el-button>
          <el-button v-if="scope.row.goodsStatus=='C'" size="mini" type="primary" @click="handleModifyStatus(scope.row,'0')">恢復
          </el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="閱讀數統計" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="渠道"> </el-table-column>
        <el-table-column prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">確 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { exportGoods, fetchList, fetchPv ,updateGoodsStatus,updateRecommendFlag} from '@/api/goods'
import waves from '@/directive/waves/index.js' // 水波紋指令
import { parseTime } from '@/utils'
import { postGoods } from '@/api/goods'


const calendarTypeOptions = [
  { key: 'E', display_name: '實物' },
  { key: 'V', display_name: '虛擬商品' }
]

// arr to obj
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        type: ''
      },
      calendarTypeOptions,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      tableKey: 0
    }
  },
  filters: {
    timeFilter(time){
      return parseTime(time,'YYYY-MM-DD HH:mm:ss');
    },
    statusFilter(status) {
      const statusMap = {
        D: 'info',
        0: 'info',
        U: 'success',
        C: 'error',
      }
      return statusMap[status]
    },
    goodsStatusFilter(status) {
      const statusMap = {
        D: '下架',
        U: '上架',
        C: '刪除',
        0: '新建',
      }
      return statusMap[status]
    },
    recommendFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
      }
      return statusMap[status]
    },
    goodsRecommendFilter(status) {
      // const statusMap = {
      //   0: '不推薦',
      //   1: '推薦',
      // }
      // return statusMap[status] ｜｜ 
      return status == 1 ? '是' : '否'
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCommand(command,row) {
      switch(command) {
        case 'recommend-false':
          this.handleRecommendFlag(row, 'recommendFlag', '0');
          break;
        case 'recommend-true':
          this.handleRecommendFlag(row, 'recommendFlag', '1');
          break;
        case 'banner-false':
          this.handleRecommendFlag(row, 'bannerFlag', '0');
          break;
        case 'banner-true':
          this.handleRecommendFlag(row, 'bannerFlag', '1');
          break;
        case 'new-false':
          this.handleRecommendFlag(row, 'newFlag', '0');
          break;
        case 'new-true':
          this.handleRecommendFlag(row, 'newFlag', '1');
          break;
        case 'hot-false':
          this.handleRecommendFlag(row, 'hotFlag', '0');
          break;
        case 'hot-true':
          this.handleRecommendFlag(row, 'hotFlag', '0');
          break;
        case 'copy':
          this.copyGoods(row);
          break;
        case 'del':
          this.handleModifyStatus(row, 'C');
          break;
        case 'recover':
          this.handleModifyStatus(row, '0');
          break;
      }
    },
    async handleExport() {
      this.exporting = true
      try {
        const response = await exportGoods({ })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '商品列表.csv');
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        
      }
    },
    copyGoods(row) {
      const newGoods = {...row, goodsStatus: 'D'}
      delete newGoods.goodsID
      postGoods(newGoods).then(res => {
        this.$notify({
          title: '成功',
          message: '商品複製成功',
          type: 'success',
          duration: 2000
        });
        this.getList()
      }).catch(err => {
        console.log(err)
      }).finally(()=>{
      })
    },
    getList() {
      this.listLoading = true
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
    handleModifyStatus(row, goodsStatus) {
      updateGoodsStatus({goodsID:row.goodsID,goodsStatus}).then(data => {
        this.$message({
          message: data.msg,
          type: 'success'
        })
        row.goodsStatus = goodsStatus;
      })
    },
    handleRecommendFlag(row, k, recommendFlag) {
      updateRecommendFlag({goodsID:row.goodsID, k, flag: recommendFlag}).then(data => {
        this.$message({
          message: data.msg,
          type: 'success'
        })
        row[k] = recommendFlag;
      })
    },
    handleCreate() {
      this.$router.push({path: '/goods/create'})
    },
    handleUpdate(row) {
      this.$router.push({path: '/goods/edit/'+row.goodsID});
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    }
  }
}
</script>
