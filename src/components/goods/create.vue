<template>
<div>
    <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/product/list' }">商品</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      <el-card>
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="商品简介" prop="subtitle">
                <el-input v-model="form.subtitle" ></el-input>
            </el-form-item>
            <el-form-item label="选择类目" prop="categoryId">
                <el-cascader
                    v-model="form.categoryId"
                    placeholder="请选择类目"
                    :options="categoryList"
                    :props="{ checkStrictly: true }"
                    @change="handleChange"
                    clearable></el-cascader>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <input class="amount-input" size="10" maxlength="6" type="number" placeholder="请输入金额" v-model.number="form.price">
                <span style="margin-left:10px">元</span>
            </el-form-item>
            <el-form-item label="库存数量" prop="stock">
                <el-input placeholder="0~9999" v-model.number="form.stock"></el-input>
                <span style="margin-left:10px">件</span>
            </el-form-item>
            <el-form-item label="是否上架" prop="status">
                <el-radio-group v-model="form.status">
                <el-radio label="上架"></el-radio>
                <el-radio label="下架"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否热卖" prop="isHot">
                <el-radio-group v-model="form.isHot">
                <el-radio label="热卖"></el-radio>
                <el-radio label="非热卖"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否新品" prop="isNew">
                <el-radio-group v-model="form.isNew">
                <el-radio label="新品"></el-radio>
                <el-radio label="非新品"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="展示图" prop="subImages">
                <div v-for="pic in this.form.subImages" :key="pic" style="float:left;margin-right:30px">
                      <img :src="pic" class="gallery">
                      <a  @click="deleteImage(pic)">
                        <div style="float:right" >
                            <i class="el-icon-close"></i>
                        </div>
                      </a>
                    </div>
                    <div>
                        <el-upload
                        class="upload-demo"
                        drag
                        action="/api/file/upload"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    </div>
                    
                </el-form-item>
            <el-form-item label="商品详情" >
                <div id="main">
                    <mavon-editor 
                    v-model="form.detail" 
                    :ishljs = "true" 
                    ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"
                    @change="change"
                    />
                </div>
                
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存并发布</el-button>
                <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
            </el-form>

            <el-tooltip placement="top" content="返回顶部">
              <back-to-top :visibility-height="100" />
            </el-tooltip>
      </el-card>
</div>
  
</template>
<script>
import { upload , productAdd, getCategoryList} from '@/api/index.js'
import BackToTop from '@/components/BackToTop'
export default {
    data() {
      return {
        form: {
          name: '',
          subtitle: '',
          categoryId: [],
          price: '',
          stock: '',
          status: false,
          isNew: '',
          isHot: '',
          mainImage: '',
          subImages: [],   
          detail: ''           
        },
        rules: {
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '请选择类目', trigger: 'change' }
          ],
          subtitle: [
            { required: true, message: '请输入商品简介', trigger: 'blur' },
            { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
          ],
          price: [
                { required: true, message: '请输入正确价格'},
                { type: 'number', message: '价格必须为数字值'}
          ],
          stock: [
                { required: true, message: '请输入正确库存数量'},
                { type: 'number', message: '库存数量必须为数字值'}
          ],
          status: [
            { required: true, message: '请选择是否上下架', trigger: 'change' }
          ],
          isHot: [
            { required: true, message: '请选择是否添加热卖', trigger: 'change' }
          ],
          isNew: [
            { required: true, message: '请选择是否添加新品', trigger: 'change' }
          ],
          subImages: [
            { required: true, message: '请添加商品图片', trigger: 'change' }
          ],
          
        },
        status:'',
        isNew: '',
        isHot: '',
        dialogImageUrl: '',
        dialogVisible: false,
        categoryList: [],
        html:'',
      }
    },
    methods: {
      onSubmit(formName) {
           this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.status === "上架"){
                this.status = 1
            }else{
                this.status = 2
            }
            if(this.form.isHot === "热卖"){
                this.isHot = 1
            }else{
                this.isHot = 2
            }
            if(this.form.isNew === "新品"){
                this.isNew = 1
            }else{
                this.isNew = 2
            }

            let params = {
                params: {
                    name: this.form.name,
                    subtitle: this.form.subtitle,
                    categoryId: this.form.categoryId[this.form.categoryId.length-1],
                    mainImage: this.form.subImages[0],
                    subImages: this.form.subImages.join(";"),
                    price: this.form.price,
                    stock: this.form.stock,
                    status: this.status,
                    isHot: this.isHot,
                    isNew: this.isNew,
                    detail: this.html
                }
            }
            console.log(params);
            productAdd(params.params).then(res =>{
                    if(res.status !== 0){
                        return this.$message.error(res.msg)
                    }
                    this.$message.success('商品发布成功')
                    this.$router.push('/product/list')
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
       handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {   
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSuccess(res, file){
          if(res.status !==0){
            return this.$message.error(res.msg);
          }
          this.form.subImages.push(res.data.url)
      },
      // 绑定@imgAdd event
     async $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
       var formdata = new FormData();
       formdata.append('file', $file);
        // this.img_file[pos] = $file;
        const res = await upload(formdata)
        
        if(res.status !==0){
            this.$message.error(res.msg)
        }
        let url = res.data.url
        this.$refs.md.$img2Url(pos, url);
    },
    $imgDel(pos) {
        delete this.img_file[pos];
    },
    change(value, render){
        // render 为 markdown 解析后的结果
        this.html = render;
        
    },
    handleChange(value) {
        //console.log(value);
      },
    async _getCategoryList(){
        const res= await getCategoryList()
        // console.log(res)
        if(res.status !== 0){
            this.$message.error(res.msg)
        }
        this.categoryList=res.data
        
    },
    deleteImage(pic){
        for (let i in this.form.subImages) {
            if ( this.form.subImages[i] === pic) {
                 this.form.subImages.splice(i,1)
            }
        }
       
    },

    },
    created (){
        this._getCategoryList()
    },
    watch:{
        'form.price':function (newVal,oldVal){
           // 解决数字键盘可以输入输入多个小数点问题
            if(newVal==='' && oldVal.toString().indexOf('.')>0){
                this.form.price = oldVal;
                return ;
            } 
            // 保留两位小数
            if(newVal){
                newVal = newVal.toString();
                var pointIndex =  newVal.indexOf('.');
                if(pointIndex>0 && (newVal.length - pointIndex)>3){
                this.form.price = oldVal;
                return ;
                }
            }
            // 最大值
            if(newVal>999999){
                this.form.price = oldVal;
                return ;
            }
            // 最小值
            if(newVal< 0){
                this.form.price = 0;
                return;
            }
        }
    },
    components:{
    //   MyNumberInput
     BackToTop ,
    }

}
</script>
<style lang="less" scoped>
    .el-input{
        width: 500px;
    }
    .amount-input{
        width: 500px;
        -webkit-appearance: none;
        background-color: #FFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
       
    }
    .gallery {
    width: 150px;
    // margin-right: 5px;
  }
</style>
