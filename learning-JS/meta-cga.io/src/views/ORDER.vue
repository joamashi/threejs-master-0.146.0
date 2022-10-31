<template>
  <fragment>
    
    <header class="hnf-header">
      <b-container>
        <b-row>
          <b-col cols="8">
            <h1><span>devux.ai</span> / IPA</h1>
          </b-col>
          <b-col cols="4">
      
            <b-button v-b-toggle.sidebar-right><span class="navbar-toggler-icon"></span></b-button>

            <b-sidebar 
              id="sidebar-right"
              right 
              backdrop
              shadow
              @change="toggleBodyScrollbar">
                <div class="sidebar">
                  <div class="preparing">준비중</div>
                </div>
            </b-sidebar>
          </b-col>
        </b-row>
      </b-container>
    </header>


    <!-- 주문 확인 -->
    <b-container fluid="sm" class="ipa" v-if="reject == false">
      <h1><span>{{ complete.name }}</span>님 주문 확인 ({{ complete.id }})</h1>
      <div class="orderComplete-cont">
        <ul>
          <li>
            <h2>픽업 날짜</h2>
            <span class="codeNumber">{{ month }}월 {{ date }}일</span>
          </li>
          <li>
            <h2>픽업 시간</h2>
            <span class="codeNumber">저녁 {{ complete.range }}시쯤</span>
          </li>
          <!-- <li>
            <h2>픽업 장소</h2>
            <span>서울시 관악구 남부순환로143나길 34, 신도마트</span>
          </li> -->
        </ul>

        <ul>
          <li>
            <h2>주문 수량</h2>
            <span class="codeNumber">{{ complete.orderList.fullmax }}병</span>
          </li>
          <li>
            <h2>주문 금액</h2>
            <span class="totalAmount">{{ complete.orderList.totalAmount | currency }}원 </span>
          </li>
          <li>
            <h2>주문</h2>
            <span>
              <ul>
                <li>
                  <em>{{ beerFirst }}</em>
                  <span>... 외 {{ complete.orderList.fullmax }}병</span>
                </li>
              </ul>
            </span>
          </li>          
        </ul>
      </div>
    </b-container>
    
    <b-container fluid="sm" class="ipa" v-if="reject == undefined">
      <h1>픽업 주문 페이지 이동</h1>
      <a href="http://www.devux.ai/ipa" class="order-link-go">www.devux.ai/ipa</a>
    </b-container>

    <div class="map">
        <svg id="svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">
          <path id="path" d="M0 200, C600 200, 600 60, 1000 60"/>
        </svg>
        <address>
          <h2>픽업 장소</h2>
          <p><b-icon icon="geo-alt"></b-icon>서울시 관악구 남부순환로143나길 34, 신도마트</p>
        </address>
      </div>

    <div class="order-io"><a href="http://www.devux.ai/ipa">첫 화면 이동</a></div>
    <div class="channel-io">주문 확인 문의</div>
  </fragment>
</template>

<script>

  // var channelData = {
  //   "memberId": "99898",
  //   "profile": {
  //     "name": "박영철2",
  //     "mobileNumber": "01091806580"
  //   }
  // }
  // channelData

  export default {
    name: 'OrderComplete',

    components: {
      
    },

    data() {
      return {
        reject : false,
        month: '',
        date: '',
        beerFirst : '',
        complete: Object
        // complete : {
        //   codeNumber: 0,
        //   date: 23,
        //   datepicker: "2020-06-30",
        //   id: 1300,
        //   month: 6,
        //   name: "박영철",
        //   nameLen: false,

        //   orderList: {
        //     beer_selected: ["ipa-2","ipa-3","ipa-4","ipa-6"],
        //     beers: [
        //       {
        //         code: "ipa-0",
        //         name: "1텐저린 위트 에일",
        //         value: 0
        //       },
        //       {
        //         code: "ipa-1",
        //         name: "2텐저린 위트 에일",
        //         value: 5
        //       },
        //       {
        //         code: "ipa-2",
        //         name: "3asfa텐저린 위트 에일",
        //         value: 6
        //       },
        //       {
        //         code: "ipa-3",
        //         name: "4텐저린 위트 에일",
        //         value: 12
        //       },
        //       {
        //         code: "ipa-4",
        //         name: "5텐저린 위트 에일",
        //         value: 0
        //       },
        //       {
        //         code: "ipa-5",
        //         name: "6텐저린 위트 에일",
        //         value: 0
        //       },
        //       {
        //         code: "ipa-6",
        //         name: "7텐저린 위트 에일",
        //         value: 0
        //       },
        //       {
        //         code: "ipa-7",
        //         name: "8텐저린 위트 에일",
        //         value: 0
        //       }
        //     ],
        //     bottle_options: [],
        //     bottle_selected: 1,
        //     counter: 0,
        //     fullmax: 1,
        //     orderQuantity: 1,
        //     order_disabled: false,
        //     totalAmount: 4200,
        //   },
        //   range: "8",
        //   sale: 200,
        //   week: "화요일",
        //   year: 2020,
        // }
      }
    },

    mounted () {
      var svg = document.getElementById("svg");
      var path = document.getElementById("path");
      var limitRates = [ 123.75, 44.65];

      var userRate = 73.65; 
      
      function getPointPlacement(max, min, user) {
        var length = path.getTotalLength();
        var adjustedLength = length - 850;
        var percent = (user - min) / (max - min);
        var point = path.getPointAtLength(Math.floor( (adjustedLength * percent) + 25) );
        return point;
      }
      var point = getPointPlacement(limitRates[0], limitRates[1], userRate);
      
      function createCircle(x, y){
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 20);
        svg.appendChild(circle);
      }
      createCircle(point.x, point.y);
    },

    created () {
      document.title = this.$route.meta.title;

      // 시작은 body에 overflow 클래스 적용
      const body = document.getElementsByTagName('body')[0];
      body.classList.add("orderComplete");

      const body2 = document.getElementsByTagName('body')[0];
      body2.classList.add("pick-up");

      this.complete = this.$route.query.complete
      this.reject = this.$route.query.complete.reject
      // this.reject = false

      if (this.reject == false) {
        // 좀 불안하지만 complete로 데이터 체크
        // console.log('complete :: ', this.$route.query.complete);
        // console.log('complete :: ', this.complete.id);


        var str = this.complete.datepicker
        var result = str.split('-')

        // 픽업 날짜
        if (result[1].charAt(0) == '0') {
          this.month = result[1].charAt(1)
        } else {
          this.month = result[1]
        }
        this.date = result[2]

        this.complete.orderList.beer_selected.reverse().map((v, i) => {
          console.log(v,i)
          var _v = v
          
          this.complete.orderList.beers.some((v, i) => {
            
            if (_v == v.code) {
              console.log(_v, v.code, i)
              this.beerFirst = v.name;
            }
            // continue
          })
        })
      }


      // %5Bobject%20Object%5D
      // "[object Object]"


      // function shuffleRandom (n) {
      //   var ar = new Array();
      //   var temp;
      //   var rnum;
       
      //   //전달받은 매개변수 n만큼 배열 생성 ( 1~n )
      //   for(var i=1; i<=n; i++){
      //       ar.push(i);
      //   }
 
      //   //값을 서로 섞기
      //   for(var i=0; i< ar.length ; i++)
      //   {
      //       rnum = Math.floor(Math.random() *n); //난수발생
      //       temp = ar[i];
      //       ar[i] = ar[rnum];
      //       ar[rnum] = temp;
      //   }
 
      //   return ar;
      // }

      // console.log(this.$emailjs)

      // // this.emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_USER_ID')
      // this.emailjs.sendForm('gmail', 'template_GilsFYLg', 'e.target', 'user_jaUG6eriutvSK1ypKDCoB')
      // .then((result) => {
      //     console.log('SUCCESS!', result.status, result.text);
      // }, (error) => {
      //     console.log('FAILED...', error);
      // });
      
    },

    filters: {
      currency (value) {
        var num = new Number(value)
          return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },

    methods: {
      // 좌측메뉴
      toggleBodyScrollbar (visible) {
        const body = document.getElementsByTagName('body')[0];
        if(visible) body.classList.add("overflow-hidden");
        else body.classList.remove("overflow-hidden");
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/ipa.scss";
</style> 