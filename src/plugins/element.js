import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

Vue.prototype.$message = Element.Message
Vue.prototype.$confirm = Element.MessageBox.confirm
// export default function ErrorMe(text){
//     Element.Message.error(text)
// }
