<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入用户名/email/phone" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="角色" prop="role" :formatter="roleFormatter"></el-table-column>
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <el-avatar shape="square" :size="50" :src="scope.row.avatarUrl" ></el-avatar>
                    </template>
                    
                </el-table-column>
                <el-table-column label="注册时间" prop="createTime" :formatter="dateFormatter"></el-table-column>
                <el-table-column label="最后登录" prop="updateTime" :formatter="dateFormatterU"></el-table-column>
                <!-- <el-table-column label="状态" prop="role"></el-table-column> -->
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                            <!-- 修改按钮 -->
                             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                            <!-- 分配角色按钮 -->
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[6, 8, 10, 15]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" :rules=" [
            { required: true, message: '请选择角色', trigger: 'blur' },
        ]">
            <el-radio-group v-model="addForm.role" size="medium">
                <el-radio border label= "0" >管理员</el-radio>
                <el-radio border label= "1" >普通用户</el-radio>
            </el-radio-group>
        </el-form-item> 
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->

    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" type="password"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="头像">
            <el-avatar shape="square" :size="80" :src="editForm.avatarUrl"></el-avatar>
            <el-upload
              class="upload-img"
              ref="upload"
              action="/api/file/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="onSuccess"
              :on-error="onError"
              :with-credentials="true">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    </div>
</template>
<script>
import { getUserListByCondition  , userAdd, userEdit , userInfo, userDelete } from '@/api/index.js'
import { Col } from 'element-ui'
export default {
    data(){
        var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
        return{
            //获取用户列表的参数对象
           queryInfo:{
                query: '',
                pageNum: 1,
                pageSize: 6    
           },
           //用户 1 ,管理员0
           userlist:[],
           fileList:[],
           total:0,
           imageUrl:'',
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
             // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                phone: '',
                role: '0',
            },
             editForm: {
                username: '',
                // password: '',
                email: '',
                phone: '',
                avatarUrl:'',
            },
            // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
       
      },
      editFormRules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],

      }
               
            
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
      
        roleFormatter(row,column){
            let role = row.role;
            if(role == 0){
                return '管理员';
            }else{
                return '普通用户'
            }
        },
        dateFormatter(row,column){
             let datetime = row.createTime;
             if(datetime){
                datetime = new Date(datetime);
                let y = datetime.getFullYear() + '-';
                let mon = datetime.getMonth()+1 + '-';
                let d = datetime.getDate();
                let h = datetime.getHours();
                let m = datetime.getMinutes();
                let s = datetime.getSeconds();
                return y + mon + d +" "+h+":"+m+":"+s;
            }
        return ''
        },
        dateFormatterU(row,column){
             let datetime = row.updateTime;
             if(datetime){
                datetime = new Date(datetime);
                let y = datetime.getFullYear() + '-';
                let mon = datetime.getMonth()+1 + '-';
                let d = datetime.getDate();
                let h = datetime.getHours();
                let m = datetime.getMinutes();
                let s = datetime.getSeconds();
                return y + mon + d +" "+h+":"+m+":"+s;
            }
            return ''
        },
        //监听 pageSize 改变事件
        handleSizeChange(newSize){
            //console.log(newSize)
            this.queryInfo.pageSize = newSize;
            this.getUserList()
        },
        //监听 pageNum 当前页
        handleCurrentChange(newPage){
            //console.log(newPage)
            this.queryInfo.pageNum = newPage
            this.getUserList()
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
            // this.handleRemove(Object.values(this.fileList), this.fileList);
        },
        
        async showEditDialog(id) {
            // console.log(id)
            let params ={
              id: id
            }
            const res= await userInfo(params)
            if(res.status !== 0){
              return this.$message.error(res.msg);
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 根据id 删除对应的用户id
        async removeUserById(id){
            // 弹框 询问用户 是否删除 数据
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let params ={
              id: id
            }
            userDelete(params).then(res =>{
                   if(res.status !== 0){
                      return this.$message.error(res.msg);
                    }
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.getUserList();
             });
             
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        setRole(){

        },
        // 模糊查询
        searchUserList(){
            this.queryInfo.pageNum =1,
            this.getUserList()
        },
        // 获取用户列表
        async getUserList(){
          const res = await getUserListByCondition(this.queryInfo)
        
              if(res.status !== 0) {
                  if(res.status === 9 || res.status === 10)
                  this.$message.error(res.msg)
                  return this.$router.push('/login')
              }
                this.userlist = res.data.list;
                this.total = res.data.total

        },
        // 添加用户
        async addUser(){
            this.$refs.addFormRef.validate(async valid =>{
            if(!valid) return;
            //可以发起添加用户的网络请求
             const res = await userAdd(this.addForm)
             if(res.status !== 0){
                 return this.$message.error(res.msg);
             }
             this.$message.success("添加用户成功！")
             //隐藏添加用户对话框
             this.addDialogVisible = false;
             // 更新用户列表
             this.getUserList();
        })},
        async editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
              if(!valid) return;
              // 可以发起修改用户的网络请求
               console.log(this.editForm)
             const res = await userEdit(this.editForm)
             if(res.status !== 0){
               return this.$message.error(res.msg);
             }
             this.$message.success("修改用户成功！")
             //隐藏添加用户对话框
             this.editDialogVisible = false;
             // 更新用户列表
             this.getUserList();
            })
        },
            // 上传文件
          submitUpload() {
            // console.log(this.$refs.upload)
            this.$refs.upload.submit();
          },
          // 上传文件
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          // 上传文件
          handlePreview(file) {
            console.log(file);
          },
          onSuccess(res, file, fileList) {
              console.log(res)
              if(res.status !==0){
                return this.$message.error(res.msg);
              }
              this.$message.success(res.data.msg)
              this.editForm.avatarUrl = res.data.url;

          },
          onError(err, file, fileList) {
              console.log(err)
          },

    },
    
    
    
}
</script>
<style  scoped>
     .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .upload-img{
    float: right;
  }
</style>