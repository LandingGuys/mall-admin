<template>
  <div>
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/product/list' }">商品</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- <el-cascader-panel :options="categoryList"></el-cascader-panel> -->
      <el-card style="float:left;width:100%">
          <div style="float:left;width:10%">
            <div>
               <el-link type="primary" disabled>类目分类</el-link>
            </div>
           <div style="margin-top:20px">
             <div>
               <!-- <a type="success" :underline="false" @click="getAllList">全部<i class="el-icon-goods el-icon--right"></i></a> -->
               <a href="#" @click="getAllList" style="font-size:12px;text-decoration: none;color:green">全部<i class="el-icon-goods"></i></a>
             </div>
             <div style="margin-top:10px">
                <el-tree :data="categoryList" :props="categoryProps" @node-click="handleNodeClick" highlight-current  ></el-tree>
             </div>
             
           </div>
            
          </div>
           
          <div class="app-container" style="float:left;width:90%">
             
            <!-- 查询和其他操作 -->
            <div class="filter-container" >
              <!-- <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 160px;" placeholder="请输入商品ID" />
              <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 160px;" placeholder="请输入商品编号" /> -->
              <el-input v-model="query" clearable class="filter-item" style="width: 350px;" placeholder="请输入商品名称/商品简介/商品描述" @clear="getList"/>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
              <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
              <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
            </div>
              <!-- 分页 -->
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 25, 30]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
            <!-- 查询结果 -->
            <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row >
               
              <el-table-column type="expand" >
                <template slot-scope="props">
                  <el-form label-position="left" class="table-expand" >
                    <el-form-item label="商品编号">
                      <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="类目ID">
                      <span>{{ props.row.categoryId }}</span>
                    </el-form-item>
                     <el-form-item label="商品介绍">
                      <span>{{ props.row.subtitle }}</span>
                    </el-form-item>
                    <el-form-item label="商品单位">
                      <span>盒</span>
                    </el-form-item>
                    <el-form-item label="宣传画廊" >
                      <img v-for="pic in props.row.subImages.split(';')" :key="pic" :src="pic" class="gallery">
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>

              <el-table-column align="center" label="商品ID" prop="id" />

              <el-table-column align="center" min-width="100" label="名称" prop="name" />

              <el-table-column align="center" property="iconUrl" label="图片">
                <template slot-scope="scope">
                  <img :src="scope.row.mainImage" width="40">
                </template>
              </el-table-column>
              <el-table-column align="center" label="详情" prop="detail">
                <template slot-scope="scope">

                  <el-dialog :visible.sync="detailDialogVisible" title="商品详情" >
                    <div class="goods-detail-box" v-html="goodsDetail" v-if="goodsDetail"/>
                    <div class="no-info" v-else>
                        <img src="/static/images/no-data.png">
                        <br>
                        该商品暂无内容数据
                    </div>
                  </el-dialog>
                  <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
                </template>
              </el-table-column>

              <el-table-column align="center" label="市场售价" prop="price" />

              <el-table-column align="center" label="当前库存" prop="stock" />

              <el-table-column align="center" label="是否新品" prop="isNew">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isNew===1 ? 'success' : 'error' ">{{ scope.row.isNew===1 ? '新品' : '非新品' }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column align="center" label="是否热品" prop="isHot">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isHot===1 ? 'success' : 'error' ">{{ scope.row.isHot===1 ? '热品' : '非热品' }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column align="center" label="是否在售" prop="status">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status===1 ? 'success' : 'error' ">{{ scope.row.status===1 ? '在售' : '下架' }}</el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="是否在售" prop="status">
               <template slot-scope="scope">
                 <el-switch
                        
                        style="display: block"
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="1"
                        inactive-text="2">
                      </el-switch>
                </template>
                      
                
              </el-table-column> -->
              

              <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                  <el-button type="warning" size="mini" @click="handleSoldOut(scope.row)">下架</el-button>
                  <el-button type="success" size="mini" @click="handleSoldOn(scope.row)">上架</el-button>
                  <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>


              
            </el-table>

          

            <el-tooltip placement="top" content="返回顶部">
              <back-to-top :visibility-height="100" />
            </el-tooltip>

          </div>
      </el-card>
    
  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
  .goods-detail-box img {
    width: 100%;
  }
  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }
</style>

<script>

import { listGoods, deleteGoods, getCategoryList, productUpdate} from '@/api/index.js'
import BackToTop from '@/components/BackToTop'


export default {
  name: 'GoodsList',
  components: { BackToTop },
  data() {
    return {
      query: '',
      categoryId: '',
      currentPage: 1,
      pageSize: 10,     
      list: [],
      subImages: [],
      total: 0,
      listLoading: true,
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false,
      categoryList: [],
      categoryProps:{
          children: 'children',
          label: 'label',
          value: 'value'
      },
      value: true
    }
  },
  created() {
    this.getList()
    this._getCategoryList()
   
  },
  methods: {
      handleNodeClick(data) {
            this.categoryId = data.value
            this.getList() 
      },
     //监听 pageSize 改变事件
        handleSizeChange(newSize){
            //console.log(newSize)
            this.pageSize = newSize;
            this.getList()
        },
        //监听 pageNum 当前页
        handleCurrentChange(newPage){
            //console.log(newPage)
            this.currentPage = newPage
            this.getList()
        },
        getAllList(){
            this.categoryId = ''
            this.getList()
        },
     getList() {
      this.listLoading = true
      let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          categoryId: this.categoryId,
          query: this.query
        }
       
      listGoods({params}).then(response => {
        this.list = response.data.list
       
        this.total = response.data.total
       
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
   
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/product/add' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/product/edit', query: { id: row.id }})
    },
    showDetail(detail) {
      console.log(detail)
      this.goodsDetail = detail
      this.detailDialogVisible = true
    },
    handleSoldOut(row){
      let params={
        params:{
          id: row.id,
          status: 2,
        }
      }
       productUpdate(params.params).then(res =>{
         this.$notify.success({
              title: '成功',
              message: '下架成功'
            })
            this.getList()
       }).catch(res =>{
         this.$notify.error({
              title: '失败',
              message: res.msg
            })
       })
    },
    handleSoldOn(row){
      let params={
        params:{
          id: row.id,
          status: 1,
        }
      }
       productUpdate(params.params).then(res =>{
         this.$notify.success({
              title: '成功',
              message: '上架成功'
            })
            this.getList()
       }).catch(res =>{
         this.$notify.error({
              title: '失败',
              message: res.msg
            })
       })
    },
    handleDelete(row) {
       // 弹框 询问用户 是否删除 数据
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          let params={
             params:{
                 id: row.id
             }     
         }
          deleteGoods(params.params).then(res => {
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }).catch(res => {
            this.$notify.error({
              title: '失败',
              message: res.msg
            })
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商品ID', '类目ID', '名称',  '当前价格', '是否新品(1-新品；2-非新品)', '是否热品(1-热品；2-非热品)', '是否在售(1-在售；2-下架)', '首页主图', '宣传图片列表', '商品介绍', '详细介绍']
        const filterVal = ['id', 'categoryId', 'name',  'price', 'isNew', 'isHot', 'status', 'mainImage', 'subImages', 'subtitle', 'detail']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    },
    async _getCategoryList(){
        const res= await getCategoryList()
        // console.log(res)
        if(res.status !== 0){
            this.$message.error(res.msg)
        }
        this.categoryList=res.data
        
    },
  }
}
</script>
