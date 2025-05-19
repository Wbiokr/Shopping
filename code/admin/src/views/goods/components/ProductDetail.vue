<template>
  <div class="createPost-container">
    <el-form class="form-container" status-icon :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <!-- <el-dropdown trigger="click">
            <el-button>{{!postForm.comment_disabled?'評論已打開':'評論已關閉'}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding" slot="dropdown">
              <el-dropdown-item>
                <el-radio-group style="padding: 10px;" v-model="postForm.comment_disabled">
                  <el-radio :label="true">關閉評論</el-radio>
                  <el-radio :label="false">打開評論</el-radio>
                </el-radio-group>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">發佈
          </el-button>
          <el-button style="margin-left: 10px;" @click="resetForm('postForm')">重置
          </el-button>
        </template>
        <template v-else>
          <el-tag>發送異常錯誤,刷新頁面,或者聯繫老大</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-row>
            <el-col :span="6">
              <el-form-item label="商品封面(436x360):" prop="imgurl">
                <Croppa ref="imgurl" v-model="postForm.imgurl" :width="218" :height="180" :quality="2"></Croppa>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item style="" prop="title">
                <MDinput name="name" v-model="postForm.title" required :maxlength="64">
                  標題
                </MDinput>
                <span v-show="postForm.title.length>=26" class='title-prompt'>APP可能會顯示不全</span>
              </el-form-item>
              <el-form-item style="" prop="subTitle">
                <MDinput name="name" v-model="postForm.subTitle" required :maxlength="200">
                  副標題
                </MDinput>
              </el-form-item>
              <el-form-item label="商品名稱:" prop="name">

                  <el-input  placeholder="請輸入商品名稱" v-model="postForm.name">
                  </el-input>

                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
              </el-form-item>
            </el-col>
            </el-row>
            <div class="postInfo-container">
                <el-row>
                <el-col :span="6">
                  <el-form-item label="類型:" class="postInfo-container-item"  prop="goodsType">
                    <el-select clearable class="filter-item" style="min-width:200px;" v-model="postForm.goodsType" placeholder="類型">
                      <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                  <el-col :span="6">
                    <el-form-item label="市場價:" class="postInfo-container-item" prop="priceMarket">
                      <el-input-number placeholder="市場價" style='min-width:200px;' v-model.number="postForm.priceMarket">
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                <el-col :span="6">
                    <el-form-item label="銷售價:" class="postInfo-container-item" prop="price">
                      <el-input-number placeholder="銷售價" style='min-width:200px;' v-model.number="postForm.price">
                      </el-input-number>
                    </el-form-item>
                </el-col>
                  <el-col :span="6">
                    <el-form-item  label="狀態:" class="postInfo-container-item" prop="goodsStatus">
                      <el-select clearable class="filter-item" style="min-width:200px;" v-model="postForm.goodsStatus" placeholder="狀態">
                        <el-option v-for="item in  calendargoodsStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                <!-- <el-col :span="6">
                  <el-form-item  label="分類:" class="postInfo-container-item" prop="goodsClassID">
                    <el-select v-model="postForm.goodsClassID"  placeholder="分類" clearable>
                      <el-option
                        v-for="item in gooddsClass_options"
                        :key="item.goodsClassID"
                        :label="item.name"
                        :value="item.goodsClassID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="6">
                  <el-form-item  label="庫存:" class="postInfo-container-item" prop="stock">
                    <el-input-number placeholder="庫存" style='min-width:200px;' v-model.number="postForm.stock">
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="顯示順序:" class="postInfo-container-item" prop="sortNo">
                      <el-input-number placeholder="顯示順序" style='min-width:200px;' v-model.number="postForm.sortNo">
                      </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  label="推薦:" class="postInfo-container-item">
                      <br />
                      <div class="f-s-c">
                        <el-checkbox v-model="postForm.recommendFlag" style='min-width:90px;' label="推薦區" border></el-checkbox>
                        <el-checkbox v-model="postForm.bannerFlag" style='min-width:90px;' label="banner區" border></el-checkbox>
                        <el-checkbox v-model="postForm.hotFlag" style='min-width:90px;' label="熱銷區" border></el-checkbox>
                        <el-checkbox v-model="postForm.newFlag" style='min-width:90px;' label="新品區" border></el-checkbox>
                      </div>
                    </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <div class="editor-container">
          <Ueditor :height=400 ref="editor" v-model="postForm.note"></Ueditor>
        </div>
        <el-form-item label="輪播圖(872x720):">
          <CroppaList ref="uploadImages" v-model="postForm.goodsImages" :autoUpload="false" :width="218" :height="180" :quality="4"></CroppaList>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </el-form>

  </div>
</template>

<script>
import Ueditor from '@/components/Ueditor'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header組件
import { fetchGoods,postGoods,goodsClass } from '@/api/goods'
import { fetchList} from '@/api/model'
import Croppa from '@/components/Croppa'
import CroppaList from '@/components/CroppaList'
import { getServerToken } from '@/utils/auth'

const defaultForm = {
  goodsID:'',
  title: '', // 標題
  subTitle: '', // 標題
  note: '', // 詳情
  name: '', // 名稱
  goodsType:'',
  imgurl:'',
  price:0,
  priceMarket:0,
  stock:500,
  goodsStatus:'0',
  sortNo:0,
  goodsImages:[],
  goodsClassID:'1',
  recommendFlag:'0',
  newFlag: '0',
  hotFlag:'0',
  bannerFlag:'0',
  comment_disabled: false
}

const calendarTypeOptions = [
  { key: 'E', display_name: '實物' },
  { key: 'V', display_name: '虛擬商品' }
]
const calendargoodsStatusOptions = [
  { key: '0', display_name: '新建' },
  { key: 'D', display_name: '下架' },
  { key: 'U', display_name: '上架' },
  { key: 'C', display_name: '刪除' }
]


export default {
  name: 'productDetail',
  components: {
    Ueditor, MDinput, Croppa, Sticky,CroppaList },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    goods_id:''
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      calendarTypeOptions,
      calendargoodsStatusOptions,
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      gooddsClass_options:[],
      rules: {
        title: [{ required: true, message:'請輸入標題', trigger: 'blur' }],
        name: [{ required: true,  message:'請輸入商品名',trigger: 'blur' }],
        goodsType:[{ required: true,  message:'請選擇類型',trigger: 'blur' }],
        price:[{type: 'number', required: true,  message:'請輸入價格',trigger: 'blur' }],
        priceMarket:[{type: 'number', required: true,  message:'請輸入市場價',trigger: 'blur' }],
        goodsStatus:[{ required: true,  message:'請選擇狀態',trigger: 'blur' }],
        // goodsClassID:[{ required: true,  message:'請選擇分類',trigger: 'blur' }],
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.name.length
    }
  },
  created() {
    this.initData()
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({opBy:this.$store.state.user.name}, defaultForm);
      this.postForm.goodsImages=[];
    }
  },
  methods: {
    initData(){
      goodsClass({page:1,limit:100}).then(data => {
        this.gooddsClass_options = data.result;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.imgurl.clear();
      this.$refs['editor'].setContent('');
      this.postForm.goodsImages=[];
    },
    fetchData() {
      fetchGoods(this.goods_id).then(res => {
        this.postForm = res.result;
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },
    async saveData(){
      let res=await this.$refs['imgurl'].upload();
      if(res) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            // console.log(this.postForm)
            // return
            this.loading = true;
            postGoods(this.postForm).then(res => {
              this.fetchSuccess = true;
              this.$notify({
                title: '成功',
                message: '商品發佈成功',
                type: 'success',
                duration: 2000
              });
              if (!this.isEdit) this.resetForm('postForm');
              this.loading = false;
              this.$router.push({ path: '/goods/index' });
            }).catch(err => {
              console.log(err)
            }).finally(()=>{
              this.loading = false;
            })
          } else {
            console.log('error submit!!');
          }
        });
      }
    },
    submitForm() {
      if (this.postForm.goodsStatus == 'U') {
        this.$confirm("當前商品為上架狀態，您確定要發佈嗎？", "提示").then(() => {
          this.saveData();
        });
      } else {
        this.saveData();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

