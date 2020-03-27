<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>类目</el-breadcrumb-item>
            <el-breadcrumb-item>类目列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card  style="float:left;width:100%">
            <div style="float:left;width:20%">
                <div>
                    <el-link type="primary" disabled>类目分类</el-link>
                </div>
                <div style="margin-top:20px">
                    <div>
                        <a href="#" @click="getAllList" style="font-size:12px;text-decoration: none;color:green">全部<i class="el-icon-goods"></i></a>
                    </div>
                    <div style="margin-top:10px">
                        <el-tree :data="categoryList" :props="categoryProps" @node-click="handleNodeClick" highlight-current  ></el-tree>
                    </div>    
                </div>    
            </div>
             <div class="app-container" style="float:left;width:80%">
                 <!-- 查询和其他操作 -->
                <div class="filter-container" >
                   
                    <el-input v-model="query" clearable class="filter-item" style="width: 350px;" placeholder="请输入类目名称" @clear="_getCategoryListTable"/>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
                    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
                    <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
                </div>
                <el-table v-loading="listLoading" :data="categoryListTable" element-loading-text="正在查询中。。。" border fit highlight-current-row >
                    <el-table-column align="center" label="类目ID" prop="id" />

                    <el-table-column align="center" label="父类ID" prop="parentId" />

                    <el-table-column align="center" min-width="100" label="名称" prop="name" />

                    <!-- <el-table-column align="center" label="状态" prop="status" /> -->

                    <el-table-column align="center" label="状态" prop="status">
                        <template slot-scope="scope">
                        <el-tag :type="scope.row.status==1 ? 'success' : 'error' ">{{ scope.row.status==1 ? '正常' : '已遗弃' }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="同类展示顺序按数值大小排序,数值相等则自然排序" prop="sortOrder" />

                    <el-table-column align="center"  label="创建时间" prop="createTime" />

                    <el-table-column align="center"  label="更新时间" prop="updateTime" />

                    <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>

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

                    <el-tooltip placement="top" content="返回顶部">
                    <back-to-top :visibility-height="100" />
                    </el-tooltip>

             </div>
           
             
        </el-card>
    </div>
</template>
<script>
import { getCategoryList, getCategoryListTable } from '@/api/index.js'
import BackToTop from '@/components/BackToTop'
export default {
    data(){
        return{
            categoryListTable:[],
            categoryList: [],
            list: [],
            query: '',
            categoryId:'',
            downloadLoading: false,
            listLoading: true,
            currentPage: 1,
            pageSize: 10,
            total: 0,  
            categoryProps:{
                children: 'children',
                label: 'label',
                value: 'value'
            }
        }
    },
    created(){
        this._getCategoryList()
        this._getCategoryListTable()
    },
    methods:{
        async _getCategoryList(){
            const res= await getCategoryList()
            if(res.status !== 0){
                this.$message.error(res.msg)
            }
            this.categoryList=res.data
        },
         getAllList(){
            this.categoryId = ''
            this._getCategoryListTable()
        },
        async _getCategoryListTable(){
            this.listLoading = true
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                categoryId: this.categoryId,
                query: this.query
            }
            const res = await getCategoryListTable({params})
            console.log(res.data)
            if(res.status !==0){
                this.$message.error(res.msg)
                this.listLoading = false
            }
            this.categoryListTable = res.data.list
            this.total = res.data.total
            
            this.listLoading = false
        },
        //监听 pageSize 改变事件
        handleSizeChange(newSize){
            //console.log(newSize)
            this.pageSize = newSize;
            this._getCategoryListTable()
        },
        //监听 pageNum 当前页
        handleCurrentChange(newPage){
            //console.log(newPage)
            this.currentPage = newPage
            this._getCategoryListTable()
        },
        handleNodeClick(data) {
            this.categoryId = data.value
            console.log(this.categoryId)
            this._getCategoryListTable() 
        },
        handleFilter() {
            this._getCategoryListTable()
        },
        handleCreate() {
            this.$router.push({ path: '/category/add' })
        },
        handleUpdate(row) {
            this.$router.push({ path: '/category/edit', query: { id: row.id }})
        },
        handleDownload() {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['类目ID', '父类ID', '名称',  '当前价格', '是否新品(1-新品；2-非新品)', '是否热品(1-热品；2-非热品)', '是否在售(1-在售；2-下架)', '首页主图', '宣传图片列表', '商品介绍', '详细介绍']
            const filterVal = ['id', 'parentId', 'name',  'price', 'isNew', 'isHot', 'status', 'mainImage', 'subImages', 'subtitle', 'detail']
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
            this.downloadLoading = false
            })
        },
    },
    components:{
        BackToTop
    }
}
</script>
<style lang="less" scope>
    
</style>