<template>
  <div class="bg">
    <div v-if="false">
      <div class="loadbox"> <img src="../../assets/loading.gif"> 页面加载中... </div>
    </div>
    <div class="head">
      <h1>智慧村务信息综合化平台</h1>
<!--      <img src="../../assets/weather.png">-->

      <div class="weather"><span style="margin:0px 20px">距离更新还有{{ss}}</span><span>{{ date }}</span></div>
    </div>
    <div class="mainbox">
      <ul class="clearfix">
        <li>
          <div class="boxall" style="height: 20%">
            <div class="alltitle">最新投票详情</div>
            <div class="sycm">
              <ul class="clearfix">
                <li><h2>{{ newVote.title }}</h2><span>标题</span></li>
                <li><h2>{{ newVote.sup }}</h2><span>支持</span></li>
                <li><h2>{{newVote.opp}}</h2><span>反对</span></li>
              </ul>
              <div style="border-bottom: 1px solid rgba(255,255,255,.1)"></div>
            </div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 30%">
            <div class="alltitle">村内男女比例</div>
            <div class="sy" id="echarts1"></div>
            <div class="sy" id="echarts2"></div>
            <div class="sy" id="echarts3"></div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 40%">
            <div class="alltitle">投票情况</div>
            <div id="echarts4" style="height: 90%; width: 100%;"></div>
            <div class="boxfoot"></div>
          </div>
        </li>
        <li>
          <div class="bar">
            <div class="barbox">
              <ul class="clearfix">
                <li class="pulll_left counter">{{allPeople}}</li>
                <li class="pulll_left counter">{{ cadrePeople}}</li>
              </ul>
            </div>
            <div class="barbox2">
              <ul class="clearfix">
                <li class="pulll_left">村内总人数</li>
                <li class="pulll_left">村内干部人数</li>
              </ul>
            </div>
          </div>
          <div class="map">
            <div class="map1"><img src="../../assets/lbx.png"></div>
            <div class="map2"><img src="../../assets/jt.png"></div>
            <div class="map3"><img src="../../assets/map.png"></div>
            <div class="map4" id="map_1"></div>
          </div>
        </li>
        <li>
          <div class="boxall" style="height:55%">
            <div class="alltitle">村内新闻</div>
            <!--            <div class="tabs">
                          <ul class="clearfix">
                            <li><a class="active" href="#">7天</a></li>
                            <li><a href="#">15天</a></li>
                            <li><a href="#">30天</a></li>
                          </ul>
                        </div>-->
<!--            <div class="clearfix" style="height:35%;margin-top:1rem">-->
<!--              <div class="sy" id="echarts6" style="height:100%"></div>-->
<!--              <div class="sy" id="echarts7" style="height:100%"></div>-->
<!--              <div class="sy" id="echarts8" style="height:100%"></div>-->
<!--            </div>-->
            <div class="adduser">
              <div class="tit02"><span>新闻展示</span></div>
              <div class="adduser" >
                <ul class="clearfix" id="news">
                  <li class="clearfix" style="display:flex;padding: 10px 12px;" v-for="item in newsData">
                    <img style="height:100px;border-radius:10px;margin-right: 5px" :src="item.img.split(',')[0]">
                    <div style="display:flex;flex-direction:column;justify-content: space-between;color: white;">
                      <p style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;overflow: hidden;font-size: 16px">
                        {{ item.title }}</p>
                      <p style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;overflow: hidden;">{{item.con}}</p>
                      <p>{{item.date}}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="boxfoot"></div>
          </div>
          <div class="boxall" style="height: 40%">
            <div class="alltitle">村民建言献策</div>
            <div class="wrap">
              <ul id="jy">
                <li v-for="item in jyData">
                  <img :src="item.img.split(',')[0]" style="height:100px;margin-right: 5px">
                  <div style="display:flex;flex-direction:column;justify-content: space-between;color: white;">
                    <p style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;overflow: hidden;">{{item.con}}</p>
                    <p>{{item.date}}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="boxfoot"></div>
          </div>
        </li>
      </ul>

    </div>
    <div class="back"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import axios from 'axios'
import URL from './URL'
export default {
  async created() {
    this.init();
  },
  methods:{
    getDate(){
      let date = new Date()
      let y =date.getFullYear();
      let m = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1)
      let d =date.getDate()<10?"0"+date.getDate():date.getDate();
      this.date=y+'-'+m+'-'+d;
    },
    async init(){
      let newsData=await axios({method:'GET',url:this.url+'/get_news'})
      let jyData=await axios({method:'GET',url:this.url+'/get_speak'})
      this.newsData=newsData.data.data
      this.jyData=jyData.data.data
      this.getDate()
      var myChart1 = echarts.init(document.getElementById('echarts1'));
      var myChart2 = echarts.init(document.getElementById('echarts2'));
      var myChart3 = echarts.init(document.getElementById('echarts3'));
      var myChart4 = echarts.init(document.getElementById('echarts4'));
      // var myChart8 = echarts.init(document.getElementById('echarts8'));
      // var myChart6 = echarts.init(document.getElementById('echarts6'));
      // var myChart7 = echarts.init(document.getElementById('echarts7'));
      let sexPro = await axios({method:'GET',url:this.url+'/get_sex_pro'})
      let allPeople = await axios({method:'GET',url:this.url+'/get_all_people'})
      let cadrePeople=await axios({method:'GET',url:this.url+'/get_cadre_sum'})

      this.allPeople=allPeople.data.data
      this.cadrePeople=cadrePeople.data.data
      var v1 = sexPro.data.data.man
      var v2 = sexPro.data.data.wman
      var v3 = v1 + v2
      var option1 = {
        series: [{
          type: 'pie',
          radius: ['70%', '80%'],
          color: '#0088cc',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v3,
            name: '平均单客价',
            label: {
              normal: {
                formatter: v3 + '',
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                }
              }
            }
          }, ]
        }]
      };

      var option2 = {
        series: [{
          type: 'pie',
          radius: ['70%', '80%'],
          color: '#0161a1',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v1,
            name: '男消费',
            label: {
              normal: {
                formatter: v1 + '',
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                }
              }
            }
          }, {
            value: v2,
            name: '女消费',
            label: {
              normal: {
                formatter: v1 + '',
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,.2)'
              },
              emphasis: {
                color: '#fff'
              }
            },
          }]
        }]
      };
      var option3 = {
        series: [{
          type: 'pie',
          radius: ['70%', '80%'],
          color: '#e6004f',
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: v2,
            name: '男消费',
            label: {
              normal: {
                formatter: v2 + '',
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                }
              }
            }
          }, {
            value: v1,
            name: '女消费',
            label: {
              normal: {
                formatter: v2 + '',
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,.2)'
              },
              emphasis: {
                color: '#fff'
              }
            },
          }]
        }]
      };
      //option4
      let titleData =[]
      let oppData=[]
      let supData=[]
      let allVote=await axios({method:'GET',url:this.url+'/get_all_vote'})
      let newVote=await axios({method:'GET',url:this.url+'/get_now_vote'})
      this.newVote=newVote.data.data
      for(let x in allVote.data.data){
        titleData.push(allVote.data.data[x].title)
        oppData.push(allVote.data.data[x].opp)
        supData.push(allVote.data.data[x].sup)
      }
      var option4 = {
        color: ['#fd0000', '#00e141'],
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: titleData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }

        ],

        series: [
          {
            name: '反对',
            type: 'bar',
            data: oppData,
            itemStyle:{
              normal:{
                label: {
                  show:true,
                  position:'top',
                  textStyle:{
                    color: '#fff',
                    fontSize:14
                  }
                }
              }
            },
          },
          {
            name: '支持',
            type: 'bar',
            data: supData,
            itemStyle:{
              normal:{
                label: {
                  show:true,
                  position:'top',
                  textStyle:{
                    color: '#fff',
                    fontSize:24
                  }
                }
              }
            },
          }
        ]
      };
      // var v0 = 1000;
      // var v1 = 353;
      // var v2 = 178;
      // var v3 = 68;
      // var option6 = {
      //   series: [{
      //     type: 'pie',
      //     radius: ['70%', '80%'],
      //     color: '#0088cc',
      //     label: {
      //       normal: {
      //         position: 'center'
      //       }
      //     },
      //     data: [{
      //       value: v1,
      //       name: '新增会员',
      //       label: {
      //         normal: {
      //           formatter: v1 + '',
      //           textStyle: {
      //             fontSize: 20,
      //             color: '#fff',
      //           }
      //         }
      //       }
      //     },
      //       {
      //         value: v0,
      //         name: '老会员',
      //         label: {
      //           normal: {
      //             formatter: function(params) {
      //               return '占比' + Math.round(v1 / v0 * 100) + '%'
      //             },
      //             textStyle: {
      //               color: '#aaa',
      //               fontSize: 12
      //             }
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: 'rgba(255,255,255,.2)'
      //           },
      //           emphasis: {
      //             color: '#fff'
      //           }
      //         },
      //       }
      //     ]
      //   }]
      // };
      // var option7 = {
      //   series: [{
      //     type: 'pie',
      //     radius: ['70%', '80%'],
      //     color: '#fccb00',
      //     label: {
      //       normal: {
      //         position: 'center'
      //       }
      //     },
      //     data: [{
      //       value: v2,
      //       name: '新增领卡会员',
      //       label: {
      //         normal: {
      //           formatter: v2 + '',
      //           textStyle: {
      //             fontSize: 20,
      //             color: '#fff',
      //           }
      //         }
      //       }
      //     },
      //       {
      //         value: v0,
      //         name: '总领卡会员',
      //         label: {
      //           normal: {
      //             formatter: function(params) {
      //               return '占比' + Math.round(v2 / v0 * 100) + '%'
      //             },
      //             textStyle: {
      //               color: '#aaa',
      //               fontSize: 12
      //             }
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: 'rgba(255,255,255,.2)'
      //           },
      //           emphasis: {
      //             color: '#fff'
      //           }
      //         },
      //       }
      //     ]
      //   }]
      // };
      // var option8 = {
      //   series: [{
      //     type: 'pie',
      //     radius: ['70%', '80%'],
      //     color: '#62b62f',
      //     label: {
      //       normal: {
      //         position: 'center'
      //       }
      //     },
      //     data: [{
      //       value: v3,
      //       name: '女',
      //       label: {
      //         normal: {
      //           formatter: v3 + '',
      //           textStyle: {
      //             fontSize: 20,
      //             color: '#fff',
      //           }
      //         }
      //       }
      //     }, {
      //       value: v0,
      //       name: '男',
      //       label: {
      //         normal: {
      //           formatter: function(params) {
      //             return '占比' + Math.round(v2 / v0 * 100) + '%'
      //           },
      //           textStyle: {
      //             color: '#aaa',
      //             fontSize: 12
      //           }
      //         }
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: 'rgba(255,255,255,.2)'
      //         },
      //         emphasis: {
      //           color: '#fff'
      //         }
      //       },
      //     }]
      //   }]
      // };
      myChart1.setOption(option1);
      myChart2.setOption(option2);
      myChart3.setOption(option3);
      myChart4.setOption(option4);
      // myChart6.setOption(option6);
      // myChart7.setOption(option7);
      // myChart8.setOption(option8);
      var newsIndex = this.newsData.length
      var jyIndex= this.jyData.length
      this.fuck =  setInterval(()=>{
        newsIndex==1?newsIndex=this.newsData.length:newsIndex--;
        document.getElementById('news').style.marginTop=-(this.newsData.length-newsIndex)*125+'px'
        jyIndex==1?jyIndex=this.jyData.length:jyIndex--;
        document.getElementById('jy').style.marginTop=-(this.jyData.length-jyIndex)*125+'px'
      },10000)
      let ss = 120
      this.fuck1=setInterval(()=>{
        ss--
        this.ss=('0'+Math.floor(ss/60))+':'+(ss%60<10?'0'+ss%60:ss%60)
      },1000)
      this.fuck2 =  setTimeout(()=>{
        clearInterval(this.fuck)
        clearInterval(this.fuck1)
        clearInterval(this.fuck2)
        this.init()
      },120000)
    }
  },
  watch: {

  },
  data() {
    return {
      date:'',
      url:URL.url,
      cadrePeople:'',
      allPeople:'',
      newsData:[],
      jyData:[],
      fuck:'',
      fuck1:'',
      fuck2:'',
      ss:'02:00',
      newVote:{}
    }
  }
}
</script>
<style>
@import "./css/comon0.css";
</style>
