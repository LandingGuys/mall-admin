<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/order/list' }">订单</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card  style="float:left;width:100%">
             <div class="app-container">
                 <!-- 查询和其他操作 -->
                <div class="filter-container" >
                   
                    <el-input v-model="query" clearable class="filter-item" style="width: 350px;" placeholder="请输入订单编号" @clear="_getOrderList"/>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
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
                <el-table v-loading="listLoading" :data="orderList" element-loading-text="正在查询中。。。" border fit highlight-current-row >
                    <el-table-column align="center" type="index" width="50" label="#"/>

                    <el-table-column align="center" label="订单号" width="120" prop="orderNo" />

                    <el-table-column align="center"  label="创建时间" width="150" prop="createTime" >
                         <template slot-scope="scope">
                          {{scope.row.createTime | formatDate }}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="账号" prop="userName" >
                        <template slot-scope="scope">
                           {{scope.row.userName !== null ? scope.row.userName : '已注销'}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" min-width="100" label="收货人" prop="receiverName" />

                    <el-table-column align="center" label="订单金额" prop="payment" />

                    <el-table-column align="center" label="订单状态" prop="status">
                        <template slot-scope="scope">
                           {{scope.row.status == 0 ? '已取消' :(scope.row.status == 10 ? '未付款':(scope.row.status == 20 ? '已付款':(scope.row.status == 40 ? '已发货':(scope.row.status == 50 ? '交易成功':'交易关闭'))))}}
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="支付方式" prop="paymentType">
                        <template slot-scope="scope">
                           <el-tag :type="scope.row.paymentType == null ? 'error' : 'success'">{{scope.row.paymentType == null ? '未支付' : (scope.row.paymentType == 1 ? '支付宝':'微信')}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="支付时间" width="150" prop="paymentTime" >
                        <template slot-scope="scope">
                            {{scope.row.paymentTime == null ? '' : scope.row.paymentTime | formatDate }}
                        </template>
                    </el-table-column>

                    

                    <el-table-column align="center"  label="关闭时间" width="150" prop="closeTime">
                         <template slot-scope="scope">
                            {{scope.row.closeTime == null ? '' : scope.row.closeTime | formatDate }}
                        </template>
                       
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleDetail(scope.row)">查看订单</el-button>
                        <el-button type="success" size="mini" v-if="scope.row.status == 20" @click="handleSend(scope.row)">订单发货</el-button>
                        <el-button type="warning" size="mini" v-if="scope.row.status == 40" @click="handleTrace(scope.row)">订单追踪</el-button>
                        <el-button type="warning" size="mini" v-if="scope.row.status == 10" @click="handleSoldOut(scope.row)">订单取消</el-button>
                        <el-button type="danger" size="mini" v-if="scope.row.status == 0 || scope.row.status == 50 || scope.row.status == 60" @click="handleDelete(scope.row)">订单删除</el-button>
                        </template>
                        
                    </el-table-column>
                </el-table>
                    <el-tooltip placement="top" content="返回顶部">
                    <back-to-top :visibility-height="100" />
                    </el-tooltip>

             </div>
           
             
        </el-card>
        <el-dialog title="发货" :visible.sync="dialogSendVisible">
            <el-form :model="form">
               
                <el-form-item label="物流公司" :label-width="formLabelWidth">
                    <el-select v-model="form.transportation" placeholder="请选择物流公司">
                        <el-option label="顺丰快递" value="顺丰快递"></el-option>
                        <el-option label="中通快递" value="中通快递"></el-option>
                        <el-option label="圆通快递" value="圆通快递"></el-option>
                        <el-option label="申通快递" value="申通快递"></el-option>
                        <el-option label="韵达快递" value="韵达快递"></el-option>
                        <el-option label="中国邮政" value="中国邮政"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流单号" :label-width="formLabelWidth">
                    <el-input v-model="form.transportationNo" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSendVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleTran">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { orderList, orderOut, orderDelete,transpAdd} from '@/api/index.js'
import BackToTop from '@/components/BackToTop'
import moment from 'moment'
export default {
    data(){
        return{
            orderList: [],
            query: '',
            downloadLoading: false,
            listLoading: true,
            currentPage: 1,
            pageSize: 20,
            total: 0,  
            dialogSendVisible: false,
            form:{
                orderNo: '',
                transportation:'',
                transportationNo:''
            },
            formLabelWidth: '120px'
        }
    },
    created(){
        this._getOrderList()
    },
    methods:{
        async _getOrderList(){
            this.listLoading = true
            let params={
                pageNum:this.currentPage,
                pageSize:this.pageSize
            }
            const res= await orderList({params})
            if(res.status !== 0){
                this.$message.error(res.msg)
                this.listLoading = false
            }
            this.orderList=res.data.list
            this.total=res.data.total
            this.listLoading = false
        },
        //监听 pageSize 改变事件
        handleSizeChange(newSize){
            //console.log(newSize)
            this.pageSize = newSize;
            this._getOrderList()
        },
        //监听 pageNum 当前页
        handleCurrentChange(newPage){
            //console.log(newPage)
            this.currentPage = newPage
            this._getOrderList()
        },
        handleFilter(){

        },
        handleSoldOut(row){
            let params={
                params:{
                    orderNo: row.orderNo,
                }
            }
            //console.log(params.params)
            orderOut(params.params).then(res =>{
                this.$notify.success({
                    title: '成功',
                    message: '取消成功'
                    })
                   this._getOrderList()
            }).catch(res =>{
                this.$notify.error({
                    title: '失败',
                    message: res.msg
                    })
            })
        },
        handleDetail(row) {
            this.$router.push({ path: '/order/detail', query: { orderId: row.orderNo }})
        },
        handleTrace(row){
            this.$notify.info({
                title: "订单追踪",
                message: "需要对接物流平台，暂未实现此功能！！！"
            })
        },
        handleSend(row){
            this.dialogSendVisible = true
            this.form.orderNo = row.orderNo
        },
        async handleTran(){
            let params={
                params:{
                    orderNo: this.form.orderNo,
                    logisticsCa: this.form.transportation,
                    logisticsNo: this.form.transportationNo
                }
            }
            const res = await transpAdd(params.params)
            if(res.status !== 0){
                this.$message.error(res.msg)
            }
            this.dialogSendVisible = false
            this.$message.success("发货成功！！！")
            this._getOrderList()
        },
        handleDelete(row){
            // 弹框 询问用户 是否删除 数据
            this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let params={
                params:{
                    orderNo: row.orderNo,
                }
            }
            orderDelete(params.params).then(res =>{
                this.$notify.success({
                    title: '成功',
                    message: '删除成功'
                    })
                   this._getOrderList()                 
            }).catch(res =>{
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
            const tHeader = ['类目ID', '父类ID', '名称',  '当前价格', '是否新品(1-新品；2-非新品)', '是否热品(1-热品；2-非热品)', '是否在售(1-在售；2-下架)', '首页主图', '宣传图片列表', '商品介绍', '详细介绍']
            const filterVal = ['id', 'parentId', 'name',  'price', 'isNew', 'isHot', 'status', 'mainImage', 'subImages', 'subtitle', 'detail']
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
            this.downloadLoading = false
            })
        },
    },
    components:{
        BackToTop
    },
    filters: {
      formatDate: function(val){
          if(val == null || val == ''){
              return ''
          }
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
}
</script>
<style lang="less" scope>
    
</style>