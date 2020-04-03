<template>
     <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>类目</el-breadcrumb-item>
            <el-breadcrumb-item>新增类目</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="类目名称" prop="name" style="width:50%">
                <el-input v-model="form.name" ></el-input>
            </el-form-item>

            <el-form-item label="上级类目" prop="parentId">
                <el-cascader
                    v-model="form.parentId"
                    placeholder="请选择上级类目"
                    :options="categoryList"
                    :props="{ checkStrictly: true }"
                    @change="handleChange"
                    clearable></el-cascader>
            </el-form-item>
            <el-form-item label="是否上架" prop="status">
                <el-radio-group v-model="form.status">
                <el-radio label="上架"></el-radio>
                <el-radio label="下架"></el-radio>
                </el-radio-group>
            </el-form-item>
             <el-form-item label="类目排序" prop="sortOrder" style="width:50%">
                <el-input v-model.number="form.sortOrder" ></el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存并发布</el-button>
                <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </div>
</template>
<script>
import {  getCategoryList,categoryAdd} from '@/api/index.js'
export default {
    data(){
        return{
            form: {
              name: '', 
              parentId: [],
              status: '',
              sortOrder: 1,   
        },
        status:'',
        list:[],
        categoryList:[],
        noFather:{
          value: 0,
          label: '无上级分类',
          children: null
        },
        rules: {
          name: [
            { required: true, message: '请输入类目名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '请选择上级类目', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择是否添加热卖', trigger: 'change' }
          ],
          sortOrder: [
                { required: true, message: '请输入合适类目排序编号' ,trigger: 'change'},    
                { type: 'number', message: '价格必须为数字值'}
          ],  
        },
        }
    },
    methods:{
         handleChange(value) {
        //console.log(value);
       },
        async _getCategoryList(){
            const res= await getCategoryList()
            if(res.status !== 0){
                this.$message.error(res.msg)
            }
            this.list=res.data
            this.categoryList.push(this.noFather)
            for(let i =0;i<this.list.length;i++){
              this.categoryList.push(this.list[i])
            }
            console.log(this.categoryList)
        },
         onSubmit(formName) {
           this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.status === "上架"){
                this.status = 1
            }else{
                this.status = 2
            }
            let params = {
                params: {
                    name: this.form.name,
                    parentId: this.form.parentId[this.form.parentId.length-1],
                    status: this.status,
                    sortOrder: this.form.sortOrder
                }
            }
            console.log(params);
            categoryAdd(params.params).then(res =>{
                    if(res.status !== 0){
                        return this.$message.error(res.msg)
                    }
                    this.$message.success('类目发布成功')
                    this.$router.push('/category/list')
                })
             } else {
                console.log('error submit!!');
                return false;
             }
            });
       
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    created(){
        this._getCategoryList()
    }
       
}
</script>
<style lang="less" scope>
    
</style>