<template>
     <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/order/list' }">订单</el-breadcrumb-item>
            <el-breadcrumb-item>订单设置</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scope>
    
</style>