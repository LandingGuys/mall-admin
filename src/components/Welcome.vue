<template>
  <div>
    <div class="calendar">
      <el-calendar v-model="value">
      </el-calendar>
    </div>

      
  </div>
</template>

<script>
export default {
    data() {
      return {
        value: new Date()
      }
    },
    methods(){
    }
}
</script>

<style lang="less" scoped>



</style>