<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/order/list' }">订单</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      <div slot="content" style="width:80%;margin:auto">
        <div v-loading="loading" element-loading-text="加载中..." style="min-height: 10vw;" v-if="orderList.length">
          <div class="orderStatus" v-if="orderStatus !== -1 && orderStatus !== 6">
            <el-steps :space="250" :active="orderStatus">
              <el-step title="提交订单" v-bind:description="createTime | formatDate"></el-step>
              <el-step title="支付订单" v-bind:description="payTime | formatDate"></el-step>
              <el-step title="平台发货" v-bind:description="sendTime | formatDate"></el-step>
               <el-step title="确认收货" v-bind:description="receiverTime | formatDate"></el-step>
              <el-step title="交易成功" v-bind:description="endTime | formatDate"></el-step>
            </el-steps>
          </div>
          <div class="orderStatus-close" v-if="orderStatus === -1">
            <el-steps  :space="850" :active="2">
              <el-step title="提交订单" v-bind:description="createTime | formatDate"></el-step>
              <el-step title="交易关闭" v-bind:description="closeTime | formatDate"></el-step>
            </el-steps>
          </div>
          <div class="orderStatus-close" v-if="orderStatus === 6">
            <el-steps :space="850" :active="2">
              <el-step title="提交订单" v-bind:description="createTime | formatDate"></el-step>
              <el-step title="交易关闭" v-bind:description="closeTime | formatDate"></el-step>
            </el-steps>
          </div>
           <el-card shadow="never" style="margin-top: 15px">
            <div class="operate-container">
              <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
              <span class="color-danger">当前订单状态：{{orderStatus | formatStatus}}</span>
              <div class="operate-button-container" v-show="orderStatus===1">
                <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
                <el-button size="mini" @click="handleSoldOut">取消订单</el-button>
              </div>
              <div class="operate-button-container" v-show="orderStatus===2">
                <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
                <el-button size="mini" @click="handleSend">订单发货</el-button>
                <el-button size="mini" @click="handleSoldOut">取消订单</el-button>
              </div>
              <div class="operate-button-container" v-show="orderStatus===3||orderStatus===4">
                <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
              </div>
              <div class="operate-button-container" v-show="orderStatus===6 || orderStatus==-1 || orderStatus==5">
                <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
              </div>
            </div>
            <div style="margin-top: 20px">
              <i class="el-icon-collection-tag"></i>
              <span class="font-small">基本信息</span>
            </div>
            <div class="table-layout">
              <el-row>
                <el-col :span="4" class="table-cell-title">订单编号</el-col>
                <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
                <el-col :span="4" class="table-cell-title">用户账号</el-col>
                <el-col :span="4" class="table-cell-title">支付方式</el-col>
                <el-col :span="4" class="table-cell-title">物流公司</el-col>
                <el-col :span="4" class="table-cell-title">物流单号</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell">{{order.orderNo}}</el-col>
                <el-col :span="4" class="table-cell">暂无</el-col>
                <el-col :span="4" class="table-cell">
                  {{order.userName !=null ? order.userName:'已注销'}}
                  </el-col>
                <el-col :span="4" class="table-cell">{{order.paymentType | formatPayType}}</el-col>
                <el-col :span="4" class="table-cell">{{transp.logisticsCa}}</el-col>
                <el-col :span="4" class="table-cell">{{transp.logisticsNo}}</el-col>
              </el-row>
            </div>
            <div style="margin-top: 20px">
              <i class="el-icon-collection-tag"></i>
              <span class="font-small">收货人信息</span>
            </div>
            <div class="table-layout">
              <el-row>
                <el-col :span="8" class="table-cell-title">收货人</el-col>
                <el-col :span="8" class="table-cell-title">手机号码</el-col>
                <el-col :span="8" class="table-cell-title">收货地址</el-col>
              </el-row>
              <el-row>
                <el-col :span="8" class="table-cell">{{userName}}</el-col>
                <el-col :span="8" class="table-cell">{{tel}}</el-col>
                <el-col :span="8" class="table-cell">{{streetName}}</el-col>
              </el-row>
            </div>
            <div style="margin-top: 20px">
              <i class="el-icon-collection-tag"></i>
              <span class="font-small">商品信息</span>
            </div>
            <el-table
              ref="orderItemTable"
              :data="orderList"
              style="width: 100%;margin-top: 20px" border>
              <el-table-column label="商品图片" width="120" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.productImage" style="height: 80px">
                </template>
              </el-table-column>
              <el-table-column label="商品名称" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.productName}}</p>
                </template>
              </el-table-column>
              <el-table-column label="价格" width="120" align="center">
                <template slot-scope="scope">
                  <p>价格：￥{{scope.row.currentUnitPrice}}</p>
                </template>
              </el-table-column>
              <el-table-column label="数量" width="120" align="center">
                <template slot-scope="scope">
                  {{scope.row.quantity}}
                </template>
              </el-table-column>
              <el-table-column label="小计" width="120" align="center">
                <template slot-scope="scope">
                  ￥{{scope.row.totalPrice}}
                </template>
              </el-table-column>
            </el-table>
            <div style="float: right;margin: 20px">
              合计：<span class="color-danger">￥{{orderTotal}}</span>
            </div>
            <div style="margin-top: 60px">
              <i class="el-icon-collection-tag"></i>
              <span class="font-small">费用信息</span>
            </div>
            <div class="table-layout">
              <el-row>
                <el-col :span="6" class="table-cell-title">商品合计</el-col>
                <el-col :span="6" class="table-cell-title">运费</el-col>
                <el-col :span="6" class="table-cell-title">优惠券</el-col>
                <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
              </el-row>
              <el-row>
                <el-col :span="6" class="table-cell">￥{{orderTotal}}</el-col>
                <el-col :span="6" class="table-cell">￥0</el-col>
                <el-col :span="6" class="table-cell">-￥0</el-col>
                <el-col :span="6" class="table-cell">-￥0</el-col>
              </el-row>
              <el-row>
                <el-col :span="6" class="table-cell-title">活动优惠</el-col>
                <el-col :span="6" class="table-cell-title">折扣金额</el-col>
                <el-col :span="6" class="table-cell-title">订单总金额</el-col>
                <el-col :span="6" class="table-cell-title">应付款金额</el-col>
              </el-row>
              <el-row>
                <el-col :span="6" class="table-cell">-￥0</el-col>
                <el-col :span="6" class="table-cell">-￥0</el-col>
                <el-col :span="6" class="table-cell">
                  <span class="color-danger">￥{{orderTotal}}</span>
                </el-col>
                <el-col :span="6" class="table-cell">
                  <span class="color-danger">￥{{orderTotal}}</span>
                </el-col>
              </el-row>
            </div>
        </el-card>
        </div>
        <div v-loading="loading" element-loading-text="加载中..." v-else>
          <div style="padding: 100px 0;text-align: center">
            获取该订单信息失败
          </div>
        </div>

      </div>
       <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="userName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="tel" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="streetName" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
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
import { orderDetail , orderList,orderOut,orderDelete, transpAdd , orderUpdate,transpGet} from '@/api/index.js'
import countDown from '../countDown'
import moment from 'moment'
export default {
  data () {
      return {
        order:'',
        orderList: [0],
        userId: '',
        orderStatus: 0,
        orderId: '',
        userName: '',
        tel: '',
        streetName: '',
        orderTitle: '',
        createTime: '',
        payTime: '',
        closeTime: '',
        sendTime: '',
        endTime: '',
        orderTotal:'',
        loading: true,
        receiverTime:'',
        receiverDialogVisible:false,
        receiverInfo:'',
        dialogSendVisible: false,
        form:{
          orderNo: '',
          transportation:'',
          transportationNo:''
        },
        formLabelWidth: '120px',
        transp:{
          logisticsCa:'暂无',
          logisticsNo: '暂无'
        }
      }
      
    },
    methods: {
        showUpdateReceiverDialog(){
        this.receiverDialogVisible=true;
      },
      handleDeleteOrder(){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           let params={
                params:{
                    orderNo: this.orderId,
                }
            }
            orderDelete(params.params).then(res =>{
                this.$notify.success({
                    title: '成功',
                    message: '删除成功'
                    })
             this.$router.push({ path: '/order/list'})           
            }).catch(res =>{
                this.$notify.error({
                    title: '失败',
                    message: res.msg
                    })
            })
        
         
        })
      },
      handleSend(){
            this.dialogSendVisible = true
            this.form.orderNo = this.orderId
        },
      showLogisticsDialog(){
        this.$notify.info({
                title: "订单追踪",
                message: "需要对接物流平台，暂未实现此功能！！！"
            })

      },
      async handleUpdateReceiverInfo(){
        
        let params={
          params:{
            orderNo:this.orderId,
            receiverName: this.userName,
            receiverPhone: this.tel,
            receiverAddress: this.streetName
          }
        }
        const res = await orderUpdate(params.params)
        if(res.status!==0 ){
         this.$message.error(res.msg)
          this.receiverDialogVisible = false
        }
        
        this.$message.success("修改成功")
        this._getOrder()
        this._getOrderDet()
       
        this.receiverDialogVisible = false
      },
      async _getOrderDet () {
        let params = {
             orderNo: this.orderId
        }
        const res = await orderDetail(params)
        
        if(res.status === 0){
          if(res.data.status === 0){
              this.orderStatus = -1
          } else if(res.data.status === 10){
              this.orderStatus = 1
          } else if(res.data.status === 20){
              this.orderStatus = 2
          } else if(res.data.status === 40){
              this.orderStatus = 3
          } else if(res.data.status === 30){
              this.orderStatus = 4
          } else if(res.data.status === 50){
              this.orderStatus = 5
          } else if(res.data.status === 60){
              this.orderStatus = 6
          }
          
          this.order = res.data
          this.orderList = res.data.orderItemVoList
          this.orderTotal = await res.data.payment
          this.userName = res.data.receiverName
          this.tel = res.data.receiverPhone
          this.streetName = res.data.receiverAddress
          this.createTime = res.data.createTime
          this.payTime = res.data.paymentTime
          this.sendTime = res.data.sendTime
          this.closeTime = res.data.closeTime
          if (this.orderStatus === 5) {
            this.endTime = res.data.endTime
          } else {
            let sdate=new Date(res.data.createTime)
            sdate.setMinutes(sdate.getMinutes()+30);
            var ss = sdate.getTime();
            this.countTime = (new Date(ss).toLocaleString('chinese',{hour12:false})).replace(/\//g,'-')
          
          }
          this.loading = false
        } else {
          
        }


      },
      async handleSoldOut(){
            let params={
                params:{
                    orderNo: this.orderId,
                }
            }
            const res = await orderOut(params.params)
            if(res.status!== 0 ){
              if(res.msg = '订单状态有误'){
                 this.$notify.error({
                    title: '失败',
                    message: '涉及到退款功能暂未实现，无法取消订单'
                    })
              }
              
            }else{
              this.$notify.success({
                title: '成功',
                message: '取消成功'
              })
            this._getOrderDet()
            this._getOrder()
           
            }       
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
            this._getOrderDet()
            this._getOrder()
            
        },
       async _transpGet(){
         let params={
                orderNo:this.orderId
            }
        const res = await transpGet({params})
        console.log(res)
        if(res.status !== 0){
          this.$message.error(res.msg)
        }
        this.transp = res.data
      },
      async _getOrder(){
        let params={
            orderNo:this.orderId
        }
        const res= await orderList({params})
        if(res.status !== 0){
          this.$message.error(res.msg)
        }
        this.order = res.data.list[0]
        if(this.order.status===40 || this.order.status === 50){
            this._transpGet()
         }
       
      },
      
    },
    created () {
      this.orderId = this.$route.query.orderId
      this.orderTitle = '订单号：' + this.orderId
      this._getOrderDet()
      this._getOrder()
    },
    components: {
      countDown
    },
    filters: {
      formatDate: function(val){
         if(val == null || val == ''){
              return ''
          }
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      },
      formatStatus(value) {
        if (value === 1) {
          return '待付款';
        } else if (value === 2) {
          return '待发货';
        } else if (value === 3) {
          return '待收货';
        } else if (value === 4) {
          return '待评价';
        } else if (value === 5) {
          return '已完成';
        } else {
          return '已关闭';
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝';
        } else if (value === 2) {
          return '微信';
        } else {
          return '未支付';
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .orderStatus {
    // display: flex;
    align-items: center;
    flex-direction: row;
    margin: 50px -150px 40px 60px;
  }

  .orderStatus-close {
    // display: flex;
    align-items: center;
    flex-direction: row;
    margin: 50px -800px 40px 60px;
  }
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
  .color-danger{
    color: rgba(245, 45, 19, 0.932);
  }
</style>
