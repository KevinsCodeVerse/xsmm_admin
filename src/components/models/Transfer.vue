<template>
  <el-row class="transfer" :gutter="20">
    <el-col :span="12" class="transfer_left">
      <el-input
        size="small"
        placeholder="成员名称"
        v-model="searchValue"
        prefix-icon="el-icon-search"
      ></el-input>
      <ul class="left_list" v-if="searchList.length>0">
        <li v-for="(item,index) in searchList" :key="index" @click="pushSelectList(item)">
          <i class="el-icon-s-custom"></i>
          <span style="margin-left:10px">{{item.name}}</span>
          <i class="el-icon-check isLeard" v-if="item.isLeader"></i>
        </li>
      </ul>
      <div v-else style="color:#ccc;text-align:center;margin-top:10px">暂无人员</div>
    </el-col>
    <el-col :span="12" class="transfer_right">
      <div style="height:30px">
        <span>已选择成员</span>
      </div>
      <ul class="right_list">
        <li v-for="(item,index) in selectList" :key="index">
          <i class="el-icon-s-custom"></i>
          <span style="margin-left:10px">{{item.name}}</span>
          <span class="el-icon-circle-close delete_btn" @click="delLeader(item.id)"></span>
        </li>
      </ul>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props:{
    leftList:{
      type:Array,
      default:function(){
        return []
      },
      require:true
    },
    orgId:{
      type:Number,
      require:true
    }
  },
  data() {
    return {
      searchValue: "",
      //右侧数据
      selectList:[]
    };
  },
  mounted(){
    this.filterIsLearder();
  },
  computed:{
    //左侧列表
    searchList(){
      if(this.searchValue===''||!this.searchValue){
        return this.leftList
      }else{
        return this.leftList.filter(item=>{
          return item.name.match(this.searchValue);
        })
      }
    }
  },
  methods:{
    //清空已选列表
    emptySelectList(){
      this.selectList = [];
    },
    pushSelectList(val){
      let status = false;
      for(let i=0;i<this.selectList.length;i++){
        if(this.selectList[i].id===val.id){
          status = true  
          break
        }
      }
      if(!status){
        val.isLeader = true
        this.selectList.push(val);
      }
    },
    //获取右侧选中数据
    getSelectList(){
      return this.selectList;
    },
    //删除右侧上级部门人员
    delLeader(id){
      this.selectList.forEach((item,index,arr)=>{
        if(item.id===id){
          arr.splice(index,1);
          item.isLeader = false
        }
      })
    },
    //筛选出已经是上级的成员
    filterIsLearder(){
      this.leftList.forEach(item=>{
        //找出departIds中对应部门ID的索引
        let index = item.departIds.indexOf(this.orgId);
        item.isLeader = false;
        if(item.isLeaderInDept[index]===1){
          item.isLeader = true
          this.selectList.push(item)
        }
      })
    }
  }
};
</script>
<style scoped>
.transfer{
  width:100%;
  height: 350px;
}
ul>li{
  list-style: none;
}
.transfer .transfer_left{
  height: 100%;
  border-right: 1px solid #ccc;
}
.transfer .transfer_left .left_list{
  margin-top:5px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.transfer .transfer_right{
  height: 100%;
}
.transfer .transfer_right .right_list{
  margin-top:5px;
  overflow-y: auto;
  height: 100%;
  overflow-x: hidden;
}
.transfer .transfer_right .right_list>li{
  display: inline-block;
  width: 100%;
  line-height: 19px;
  /* padding:5px 10px 5px 0 ; */
  padding:5px 10px 5px 0px;
  
}
.transfer .transfer_right .right_list>li:hover{
  background-color: rgba(192,192,192,.3);
}
.transfer .transfer_right .right_list .delete_btn{
  float:right;
  margin-top: 3px;
}
.delete_btn:hover{
  cursor: pointer;
}
.transfer .transfer_left .left_list .isLeard{
  float:right;
}
.transfer .transfer_left .left_list>li{
  display: inline-block;
  width: 100%;
  line-height: 19px;
  padding:5px 10px 5px 0 ;
}
.transfer .transfer_left .left_list>li:hover{
  background-color: rgba(192,192,192,.3);
}
</style>