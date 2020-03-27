<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div >
        <img src="../assets/logo.png" alt=""  class="head-img">
        <span>智慧药房后台管理系统</span>
      </div>
      <div style="padding-left: 900px">
          <a href="#"  @click="toFront" style="color: white;text-decoration: none;">智慧药房商城</a>
      </div>
      
      <el-dropdown>
            <span class="el-dropdown-link">
                <el-avatar :src="userinfo.avatarUrl"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
            
                <span>
                    <el-dropdown-item>个人信息</el-dropdown-item>
                </span>
                <span @click="logout">
                    <el-dropdown-item >
                        退出
                    </el-dropdown-item>
                </span>
            </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
             <el-menu
            background-color="#304156"
            text-color="#fff" unique-opened
            :collapse="isCollapse" :collapse-transition="false" router :default-active="this.$route.path"
            active-text-color="#409EFF">
            <el-menu-item index="/home">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-s-goods"></i>
                    <span>商品</span>
                </template>
                <el-menu-item index="/product/list">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>商品列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/product/add">
                    <template slot="title">
                        <i class="el-icon-circle-plus"></i>
                        <span>添加商品</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/product/sort">
                    <template slot="title">
                        <i class="el-icon-s-fold"></i>
                        <span>首页轮播管理</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-s-order"></i>
                    <span>订单</span>
                </template>
                <el-menu-item index="/order/list">
                    <template slot="title">
                        <i class="el-icon-s-order"></i>
                        <span>订单列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/order/set">
                    <template slot="title">
                        <i class="el-icon-s-check"></i>
                        <span>订单设置</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-user-solid"></i>
                    <span>用户</span>
                </template>
                <el-menu-item index="/user/list">
                    <template slot="title">
                        <i class="el-icon-user-solid"></i>
                        <span>用户列表</span>
                    </template>
                </el-menu-item>
                 <!-- <el-menu-item index="/user/add">
                    <template slot="title">
                        <i class="el-icon-circle-plus"></i>
                        <span>添加用户</span>
                    </template>
                </el-menu-item> -->
                
              
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>类目</span>
                </template>
                <el-menu-item index="/category/list">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>类目列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/category/add">
                    <template slot="title">
                        <i class="el-icon-circle-plus"></i>
                        <span>添加类目</span>
                    </template>
                </el-menu-item>
               
                
              
            </el-submenu>
            
            </el-menu>
            
           
            
              
           
           
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

       
    
<script>
import { loginOut, getUserInfo} from '../api/index' 
export default {
    data(){
        return{
           isCollapse: false,
           userinfo:{
               avatarUrl: '',
           }
        }

    },
    methods:{
        toFront(){
            window.open("http://www.mall.wast.club")
        },
        logout(){
            loginOut().then(res =>{
                window.sessionStorage.clear();
                this.$router.push('/login'); 
            }).catch(res =>{

            })
            
        },
        async _getUserInfo(){
            const res = await getUserInfo()
            if(res.status !==0){
                this.$message.error(res.msg)
            }
            this.userinfo=res.data

        },
        //点击按钮切换折叠
        toggleCollapse(){
            this.isCollapse = ! this.isCollapse;
        }
        
    },
    mounted(){
        this._getUserInfo()
    }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    .head-img {
        width: 50px;
        border-radius: 50%;
        margin-left: 20px
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #304156;
  .el-menu{
      border-right: none;
  }
   
  
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}


.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>