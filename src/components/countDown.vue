<template>
  <span :endTime="endTime" :callback="callback" :endText="endText">
    <slot>
      {{content}}
    </slot>
    
  </span>
</template>
<script>
export default {
  data () {
    return {
      content: ''
    }
  },
  props: {
    endTime: {
      type: String,
      default: ''
    },
    endText: {
      type: String,
      default: '已结束'
    },
    callback: {
      type: Function,
      default: null
    }
  },
  watch: {
      endTime: function(newVal,oldVal){   
          this.countdowm(newVal);//newVal即是chartData
      }
  },
  methods: {
    countdowm (timestamp) {  
      let self = this 
      var new_time_str = timestamp.replace(/-/g, '/')
      let end_Time =  Date.parse(new Date(new_time_str))
      let timer = setInterval(function () {
        let nowTime = Date.parse(new Date())
        if (end_Time > nowTime) {
          let t = end_Time - nowTime
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          let format = ''
          if (day > 0) {
            format = `${day} 天 ${hour} 小时 ${min} 分 ${sec} 秒`
          }
          if (day <= 0 && hour > 0) {
            format = `${hour} 小时 ${min} 分 ${sec} 秒`
          }
          if (day <= 0 && hour <= 0) {
            format = `${min} 分 ${sec} 秒`
          }
          self.content = format
        } else {
          clearInterval(timer)
          self.content = self.endText
          self._callback()
        }
      }, 1000)
    },
    _callback () {
      if (this.callback && this.callback instanceof Function) {
        this.callback(...this)
      }
    }
  },
  mounted () {
    this.countdowm(this.endTime)
  }
}
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  
</style>
