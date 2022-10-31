<template>
  <fragment>
    <header :class="'hnf-header ' + orderMovePosition">
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

    <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->

    <div class="ipa-index">
      <div class="lostcoast">
        <h1><span>IPA</span> <br>pick <em>X</em> up</h1>
        <h2>
          <span>#로스트 코스트</span>
          <span>#IPA</span>
          <span>#4,400원</span> 
          <span>#주문(12병 / 24병)하고 바로 픽업</span> 
          <span>#신도마트</span>
          <span>#전용 잔 증정</span>
          <span>#간편주문</span>
          <span class="sale">#최대 400원 THE 할인</span>
        </h2>
      </div>

      <div class="lostcoast-logo">
        <img alt="lostcoast" width="250" src="@/assets/ipa/logo.png">
      </div>

      <div class="map">

        <svg id="svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">
          <path id="path" d="M0 200, C600 200, 600 60, 1000 60"/>
        </svg>

        <address>
          <h2>픽업 장소</h2>
          <p><b-icon icon="geo-alt"></b-icon>서울시 관악구 남부순환로143나길 34, 신도마트</p>
        </address>
      </div>
      
      <div class="btn-area">
        <b-button variant="outline-primary" @click="btnOrder(true)" size="lg">시작하기</b-button>
      </div>
    </div>

    <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->
    
    <b-container fluid="sm" class="ipa">
      <h4>
        <em class="ic"><b-icon-check-square></b-icon-check-square></em> <strong>12병</strong> 또는 <strong>24병</strong> 씩 선택(교차 가능)하시면 매장에서 셀프로 픽업합니다.
      </h4>

      <!-- 12병 / 24병 -->
      <b-form-group>
        <b-form-radio-group
          id="btn-radios-2"
          v-model="ipa.bottle_selected"
          :options="ipa.bottle_options"
          buttons
          button-variant="outline-primary"
          name="radio-btn-outline"
          @change="toggleOrderQuantity"
          size="lg"
        ></b-form-radio-group>
      </b-form-group>

      <!-- IPA List -->
      <ul class="ipa-list">
        <li v-for="(beer, index) in ipa.beers" :key="beer.id">

          <!-- / checkbox -->
          <b-form-checkbox 
            v-model="ipa.beer_selected" 
            :value="beer.code"
            :checked="beer.checked"
            :disabled="beer.checkbox_disabled"
            @change="toggleIndeterminate(index)">
              <i><img :src="beer.Prodpic" :alt="beer.name"></i> 
              <p>{{ beer.name }}</p> 
              <!-- <em>￦ {{ beer.price }} / {{ beer.volume }}mL</em> -->
              <em>￦ {{ beer.price - form.sale | currency }}  <span>{{  beer.price | currency }}</span></em>
          </b-form-checkbox>

          <!-- / spinbutton -->
          <div class="custom-control-select">
            <b-form-spinbutton 
              :id="'spin-' + beer.code" 
              v-model="beer.value" 
              :min="beer.min" 
              :max="beer.max"
              :disabled="beer.spin_disabled"
              :readonly="beer.spin_readonly"
              refs="state-spin"
              @change="spinner(index, beer.value)"
              ></b-form-spinbutton>
          </div>
        </li>
      </ul>

      <div class="channel-io">무엇이든 물어보세요?</div>

      <div class="sticky-product-bar-wrapper--is-visible">
        <b-container>
          <b-row>
            <b-col cols="8">
              <span v-if="ipa.counter !== 0"><em>{{ ipa.counter }}</em>선택 가능</span>
              <span v-else>선택 완료</span>

              <p>금액 <em>￦</em><strong>{{ ipa.totalAmount | currency }} / {{ ipa.fullmax }}병</strong></p>
            </b-col>
            <b-col cols="4">
              <b-button 
                block 
                variant="dark" 
                size="lg" 
                :disabled="ipa.order_disabled" 
                v-b-modal.modal-center>선택</b-button>
            </b-col>
          </b-row>
        </b-container>
      </div>


      <b-modal 
        ref="modal-center" 
        id="modal-center" 
        @show="resetModal"
        @hidden="resetModal"
        centered 
        no-close-on-backdrop>
        <template v-slot:modal-header="{}">
          <h5>{{ ipa.fullmax }}병 <span>({{ ipa.totalAmount | currency }}원)</span> 주문</h5>
        </template>

        

        <b-container fluid>
          <!-- <b-row class="my-1">
            <b-col sm="2">
              <label for="input-default">이름</label>
            </b-col>
            <b-col sm="10">
              <b-form-input id="input-default" placeholder="000-0000-0000"></b-form-input>
            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="2">
              <label for="input-default">연락처</label>
            </b-col>
            <b-col sm="10">
              <b-form-input id="input-default" placeholder="000-0000-0000"></b-form-input>
            </b-col>
          </b-row> -->

          <!-- 연락처를 안받고 싶다 -->

          <div class="mt">
            <!-- <label>주문 번호 <span>(주문자 확인)</span></label>
            <strong class="number">{{ generateRandom(1, 100000) }}</strong>    -->

            <label><em>1</em> 주문 날짜 <span>(오늘 날짜)</span></label>
            <strong class="number">{{ form.year }}년 {{ form.month }}월 {{ form.date }}일 {{ form.week }}</strong>   
          </div>

          <div class="mt">
            <label><em>2</em> 이름 <span>(주문자 이름 / 2자 이상)</span></label>
            <span class="name-input"><b-form-input v-model="inputValue" id="name" size="lg" minlength="3" maxlength="7" placeholder="이름을 입력해 주세요" :class="{ error : form.nameLen == true }"></b-form-input></span>

            <!--  @change="nameInput" -->
          </div>

          <div class="mt">          
            <label for="datepicker"><em>3</em> 픽업 날짜 선택 <span>(주말 가능)</span></label>
            <b-form-datepicker 
              id="datepicker" 
              v-model="form.datepicker" 
              placeholder="픽업 날짜를 선택해 주세요"
              size="lg"
              :date-disabled-fn="dateDisabled"
              menu-class="w-100"
              calendar-width="100%"
              :min="minDate"
              :max="maxDate"
              class="mb-2"></b-form-datepicker>
          </div>

          <div class="mt">
            <label for="range"><em>4</em> 픽업 시간 선택 <span>(예상 시간)</span></label>

            <span class="time" v-if="form.range <  1" :class="{ error : form.range == -1 }" @click="rangeShow">픽업 시간을 선택해 주세요</span>        
            <span class="time" v-else :class="{active : form.range}">저녁 {{ form.range }}시쯤 방문</span>        

            <b-form-input 
              v-if="rangeBl == true"
              id="range" 
              v-model="form.range" 
              type="range" 
              min="6" 
              max="10"
              variant="dark"
              step="1"></b-form-input>
          </div>

          <!-- <b-form-timepicker 
            v-model="value" 
            placeholder="픽업 시간 선택" 
            size="lg"
            menu-class="w-100"
            calendar-width="100%"></b-form-timepicker> -->

          <!-- <b-form-input id="name" size="lg" placeholder="이름"></b-form-input>
          <b-form-input id="phone" size="lg" placeholder="연락처"></b-form-input> -->

          <ul>
            <li><span>결제</span>는 매장에서 가능 합니다</li>
            <li>주문 문의/확인은 <span>채널톡</span>을 통해 확인 가능합니다.</li>
            <li>픽업 날짜 선택 이후 <span>3일간 보관</span> 후 자동 취소됩니다.</li>
          </ul>
        </b-container>
        
      

        <!-- <ul>
          <li v-for="(beer) in ipa.beers" :key="beer.id">
            <div v-if="beer.value !== 0">
              <i><img :src="beer.Prodpic" :alt="beer.name"></i> 
              <p>{{ beer.name }}</p> 
              <em>{{ beer.value }}</em>
            </div>
          </li>
        </ul> -->

        <template v-slot:modal-footer="{}">
          <b-button size="lg" variant="danger" @click="cancel()">다시 주문</b-button>

          <form @submit.prevent="complete">
            <input type="hidden" name="from_name" value="박영철" />

            <!-- 주문 자 -->
            <input type="hidden" name="to_name" :value="form.name" />

            <!-- 픽업 날짜 -->
            <input type="hidden" name="from_datepicker" :value="form.datepicker" /> 

            <!-- 픽업 날짜 -->
            <input type="hidden" name="from_range" :value="form.range" /> 

            <!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->

            <!-- 주문 번호 -->
            <input type="hidden" name="from_id" :value="form.id" />

            <!-- 주문 금액 -->
            <input type="hidden" name="from_totalAmount" :value="ipa.totalAmount" /> 

            <!-- 주문 수량 -->
            <input type="hidden" name="from_orderQuantity" :value="ipa.orderQuantity" /> 

            <!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->

            <!-- 달빛 필스너 -->
            <input type="hidden" name="from_beer_0_name" :value="ipa.beers[0].name" /> 
            <input type="hidden" name="from_beer_0_value" :value="ipa.beers[0].value" /> 

            <!-- 텐저린 위트 에일 -->
            <input type="hidden" name="from_beer_1_name" :value="ipa.beers[1].name" /> 
            <input type="hidden" name="from_beer_1_value" :value="ipa.beers[1].value" /> 

            <!-- 워터멜론 위트 에일 -->
            <input type="hidden" name="from_beer_2_name" :value="ipa.beers[2].name" /> 
            <input type="hidden" name="from_beer_2_value" :value="ipa.beers[2].value" /> 

            <!-- 아프리캇 위트 에일 -->
            <input type="hidden" name="from_beer_3_name" :value="ipa.beers[3].name" /> 
            <input type="hidden" name="from_beer_3_value" :value="ipa.beers[3].value" /> 

            <!-- 그레이트 화이트 윗비어 -->
            <input type="hidden" name="from_beer_4_name" :value="ipa.beers[4].name" /> 
            <input type="hidden" name="from_beer_4_value" :value="ipa.beers[4].value" /> 

            <!-- 샤키네이터 IPA -->
            <input type="hidden" name="from_beer_5_name" :value="ipa.beers[5].name" /> 
            <input type="hidden" name="from_beer_5_value" :value="ipa.beers[5].value" /> 

            <!-- 인디카 IPA -->
            <input type="hidden" name="from_beer_6_name" :value="ipa.beers[6].name" /> 
            <input type="hidden" name="from_beer_6_value" :value="ipa.beers[6].value" /> 

            <!-- 다운 타운 브라운 -->
            <input type="hidden" name="from_beer_7_name" :value="ipa.beers[7].name" /> 
            <input type="hidden" name="from_beer_7_value" :value="ipa.beers[7].value" /> 

            <!-- 피넛 버터 초콜릿 밀크 스타우트 -->
            <input type="hidden" name="from_beer_8_name" :value="ipa.beers[8].name" /> 
            <input type="hidden" name="from_beer_8_value" :value="ipa.beers[8].value" /> 

            <!-- 헤이지 IPA -->
            <input type="hidden" name="from_beer_9_name" :value="ipa.beers[9].name" /> 
            <input type="hidden" name="from_beer_9_value" :value="ipa.beers[9].value" /> 

            <!-- 레버넌트 IPA -->
            <input type="hidden" name="from_beer_10_name" :value="ipa.beers[10].name" /> 
            <input type="hidden" name="from_beer_10_value" :value="ipa.beers[10].value" /> 

            <!-- 포그커터 더블 IPA -->
            <input type="hidden" name="from_beer_11_name" :value="ipa.beers[11].name" /> 
            <input type="hidden" name="from_beer_11_value" :value="ipa.beers[11].value" /> 

            <!-- 트리플 IPA -->
            <input type="hidden" name="from_beer_12_name" :value="ipa.beers[12].name" /> 
            <input type="hidden" name="from_beer_12_value" :value="ipa.beers[12].value" /> 

            <!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->

            <b-button size="lg" variant="dark" type="submit">주문하기</b-button>
          </form>

        </template>
      </b-modal>

    </b-container>
  </fragment>
</template>
 














<script>
  export default {
    name: 'IPA',
    
    props: {
      msg: String
    },

    data() {
      return {
        ipa: Object,
        // ipa_backup: Object,
        orderMovePosition: '',

        // 주문날짜 min / max
        minDate: '',
        maxDate: '',
        rangeBl: false,

        inputValue: '',
        
        form: {
          
          // 주문신청 처리 성공
          reject: false,

          // 난수로 생성된 아이디값
          id : '',

          // 주문확인 리스트
          orderList: [],

          // 세일가격
          sale: 200,

          // 이름
          name: '',
          nameLen: '',

          // 픽업 날짜
          datepicker: '',

          // 픽업 시간
          range: -1,

          // 난수 만들기
          codeNumber: 0,

          // 날짜
          year: 0,    // 년
          month : 0,  // 월
          date : 0,   // 일
          week : 0,   // 요일,
        }
      }
    },

    components: {
      
    },

    beforeCreate() {
      
    },

    created () {

      // 타이틀 태그 적용
      document.title = this.$route.meta.title;

      
      this.$http.get('/api/ipa').then(( response ) => {
        this.ipa = response.data[0];
        // this.ipa_backup = response.data[0];

        this.ipa.beers = this.ipa.beers.map((v) => {
          v.min = 1;                                // 최소 
          v.max = this.ipa.bottle_options[0].value; // 최대
          return v
        });

        this.ipa.bottle_selected = this.ipa.bottle_options[0].value;  // 12 / 24 주문 병 디폴트
        this.ipa.counter = this.ipa.bottle_options[0].value;          // 남은 병
        this.ipa.orderQuantity = this.ipa.bottle_options[0].value;    // 전체 주문 병
      })

      // 모바일 주소창 게산 100vh
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // 시작은 body에 overflow 클래스 적용
      const body = document.getElementsByTagName('body')[0];
      body.classList.add("overflow");
      body.classList.remove("orderComplete");

      const body2 = document.getElementsByTagName('body')[0];
      body2.classList.add("pick-up");

      // document.querySelector(':root').style
      // .setProperty('--vh', window.innerHeight/100 + 'px');

      // window.addEventListener('resize', () => {
        
      // });

      // 'animation'
      // let html = document.documentElement;
      // let deg = 0;
      // let tick = () => {
      //   html.style.background = `background linear-gradient(${deg++}deg, #ed9f16, #ff4f00)`;
      //   requestAnimationFrame(tick);
      // };
      // requestAnimationFrame(tick);

      // 초기 아이디 값 구하기
      var id = this.generateRandom(1, 10000)
      this.form.id = id
      // console.log('초기 아이디 값 구하기 :: ', this.form.id)

      // 오늘 날짜 구하기
      var today = new Date()
      this.form.year =  today.getFullYear()
      this.form.month = today.getMonth() + 1
      this.form.date = today.getDate()

      var week = ['일요일', '월요일', '화요일', '수요일',  '목요일', '금요일', '톤요일']
      this.form.week = week[new Date().getDay()]

      // 특정 날짜 요일 구하기
      // this.week = week[new Date('2014-12-45').getDay()] // 목요일

      // 주문 날짜 MIN : 1하루 이후 가능
      const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' +  (today.getDate()+1)
      // minDate.setMonth(minDate.getMonth() - 2)
      // minDate.setDate(15)
      this.minDate = date

      // 주문 날짜 MAX
      const maxDate = new Date(new Date(date).setDate(40))
      this.maxDate = maxDate.getFullYear() + '-' + (maxDate.getMonth()+1) + '-' +  maxDate.getDate()
    },

    computed: { 

    },

    watch: {
      inputValue (val) {
        if(val.length >= 3) {
          this.form.nameLen = false
          this.form.name = this.inputValue
        } else {
          this.form.nameLen = true
        }
      }
    },

    filters: {
      currency (value) {
        var num = new Number(value)
          return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },

    methods: {
      // 12 / 24 선택
      toggleOrderQuantity (value) {

        // 세일 가격 개수별로 다르게
        if (value == 24) {
          this.form.sale = 400
        } else {
          this.form.sale = 200    
        }

        // 남은 병
        this.ipa.counter = value;

        // 전체 주문 병
        this.ipa.orderQuantity = value;

        // checkbox 초기화
        this.ipa.beer_selected = [];

        // 총 주문 금액 초기화
        this.ipa.totalAmount = 0
        this.ipa.fullmax = 0

        // 주문 버튼 초기화
        this.ipa.order_disabled = true;
        
        // spinbutton 초기화 : 최적화 하기 고민
        this.ipa.beers = this.ipa.beers.map((v) => {
          v.checkbox_disabled = false;
          v.spin_disabled = true;
          v.checked = false;
          v.value = 0;
          v.max = value;
          return v
        })
        // this.ipa.beers = this.ipa_backup;

      },

      // sale (price) {
      //   return this.comma(price - 200)
      // },

      // comma (price) {
      //   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // },

      // 선택 완료
      order () {
        // 주문하기

        if (this.ipa.fullmax == this.ipa.bottle_selected) {
          /**
           * 주문 가능 병이 완료
           */
          this.ipa.beers.filter((v) => { // index

            // 전체 체크박스 Desabled
            if (v.checked !== true)  v.checkbox_disabled = true

            // 전체 spin버튼 Readonly
            else v.spin_readonly = true
            return v
          })

          this.ipa.order_disabled = false;

        } else {
          /**
           * 주문 가능 병이 미완료
           */
          this.ipa.beers.filter((v) => { // index

            // 전체 체크박스 Desabled 적용
            if (v.checkbox_disabled == true) v.checkbox_disabled = false

            // 전체 spin버튼 Readonly 해제
            else v.spin_readonly = false
            return v
          })

          this.ipa.order_disabled = true;
        }
      },

      // 증가
      increment (index) {
        // 주문 금액 증가
        this.ipa.totalAmount = this.ipa.totalAmount + this.ipa.beers[index].price - this.form.sale;

        // 총 개수 증가
        this.ipa.fullmax += 1;

        // 카운트 감소
        this.ipa.counter -= 1;
      },
      
      // 감소
      decrement (index) {
        // 주문 금액 감소
        this.ipa.totalAmount = this.ipa.totalAmount - ((this.ipa.beers[index].price - this.form.sale) * this.ipa.beers[index].value);

        // 총 개수 감소
        this.ipa.fullmax -= this.ipa.beers[index].value;

        // 카운트 증가
        this.ipa.counter += this.ipa.beers[index].value;
      },

      // 맥주 선택
      toggleIndeterminate (index) {

        if (this.ipa.beers[index].checked == false) {
          // console.log('주문 선택')

          // ------------------------------------------------------------------------------------

          // 체크박스 활성화
          this.ipa.beers[index].checked = true;

          // spin버튼 활성화
          this.ipa.beers[index].spin_disabled = false; 

          // ------------------------------------------------------------------------------------

          this.increment(index);

          // 개수 1개 증가
          this.ipa.beers[index].value += 1; 

        } else {
          // console.log('주문 해제')

          // ------------------------------------------------------------------------------------

          // 체크박스 비활성화
          this.ipa.beers[index].checked = false;

          // spin버튼 비활성
          this.ipa.beers[index].spin_disabled = true; 

          // ------------------------------------------------------------------------------------

          this.decrement(index);

          // value 0으로 초기화
          this.ipa.beers[index].value = 0;
        }
        
        // 주문하기 설정
        this.order()
      },

      // 증가 / 감소
      spinner (index, value) { // value
        
        var stateSpin = this.$$('.ipa-list li:eq('+index+') .custom-control-select .form-control').attr('state-spin');

        if (stateSpin == 'up') {

          // Increment 증가
          this.increment (index);
        
        } else { 
          // Decrement 차감

          if (value !== 1) {
            // 주문 금액 감소
            this.ipa.totalAmount = this.ipa.totalAmount - this.ipa.beers[index].price;

            // 총 개수 감소
            this.ipa.fullmax -= 1;

            // // 카운트 증가
            this.ipa.counter += 1;
          } else {

            this.ipa.beers[index].checked = false;
            
            var pull_checked = [];
            this.ipa.beers.map((v) => {
              if (v.checked == true) pull_checked.push(v.code)
            })
            this.ipa.beer_selected = pull_checked

            // spin버튼 비활성
            this.ipa.beers[index].spin_disabled = true; 

            this.decrement(index);

            // value 0으로 초기화
            this.ipa.beers[index].value = 0;
          }

        }
        
        // 주문하기 설정
        this.order()
      },

      // 좌측메뉴
      toggleBodyScrollbar (visible) {
        const body = document.getElementsByTagName('body')[0];
        if(visible) body.classList.add("overflow-hidden");
        else body.classList.remove("overflow-hidden");
      },
      
      // 시작하기
      btnOrder (visible) {
        this.orderMovePosition = 'orderMovePosition';

        const body = document.getElementsByTagName('body')[0];
        if(visible) body.classList.remove("overflow");
      },
      
      // 주말제외
      dateDisabled () {
        this.$$('#datepicker__value_').addClass('state');

        // const weekday = date.getDay()
        // const day = date.getDate()
        // return weekday === 0 || weekday === 6 || day === 13
      },

      // 모달 팝업 데이터 초기화
      resetModal () {
        this.form.datepicker = ''
        this.form.range = 0
      },

      // 난수 만들기
      generateRandom (min, max) {
        var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return ranNum;
      },

      // onContext() {
      //   console.log('onContext')
      // },
      
      // 다시 주문
      cancel () {
        this.form.nameLen = false
        this.form.datepicker = ''
        this.form.range = -1
        this.rangeBl = false
        this.$refs['modal-center'].hide();
      }, 

      // 주문하기
      complete (e) {

        // validator 이름 / 날짜 / 시간
        if (this.inputValue.length < 2) this.form.nameLen = true
        if (this.form.datepicker == '') this.$$('#datepicker__value_').addClass('error');
        if (this.form.range == 0) this.form.range = -1


        if (this.inputValue.length > 2 && this.form.datepicker !== '' && this.form.range !== -1) {


          // var id = this.generateRandom(1, 10000)
          // this.form.id = id


          
          // 선택 ipa 담기
          this.form.orderList = this.ipa
          // JSON.stringify(this.form)

          // console.log(this.form)
          
          this.$router.push({path: '/order/:' + this.form.id, query: { complete: this.form }})

          // var templateParams = [
          //   {user_name: ''},
          //   {user_email: ''},
          //   {Send: ''}
          // ]
          // console.log(this.$emailjs, JSON.stringify(templateParams))

          // let params = {
          //   user_id: 'user_jaUG6eriutvSK1ypKDCoB',
          //   service_id: 'gmail',
          //   template_id: 'template_GilsFYLg',
          //   template_params: {
          //   'YOUR_PARAM1_NAME': 'YOUR_PARAM1_VALUE',
          //   'YOUR_PARAM2_NAME': 'YOUR_PARAM2_VALUE'
          //   }
          // };

          // let headers = {
          //   'Content-type': 'application/json'
          // };

          // let options = {
          //   method: 'get',
          //   headers: headers,
          //   body: JSON.stringify(params)
          // };

          // this.emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_USER_ID')
          // this.emailjs.sendForm(options)


          var target = e.target
          // console.log(target)

          this.$emailjs.sendForm('default_service', 'template_GilsFYLg', target, 'user_jaUG6eriutvSK1ypKDCoB')
          .then((result) => {
              console.log('SUCCESS!', result.status, result.text);
          }, (error) => {
              console.log('FAILED...', error);
          });

          // {reply_to: "asd", from_name: "ww", to_name: "22", message_html: "11"}
        }
      },

      rangeShow () {
        return this.rangeBl = true;
      },

      // nameInput () {
      //   // if (this.form.name == '') 
      //   // console.log(this.form.name)
      //   return 
      // }


      // onSubmit(evt) {
      //   evt.preventDefault()
      //   alert(JSON.stringify(this.form))
      // },
      // onReset(evt) {
      //   evt.preventDefault()
      //   // Reset our form values
      //   this.form.email = ''
      //   this.form.name = ''
      //   this.form.food = null
      //   this.form.checked = []
      //   this.show = false

      //   this.$nextTick(() => {
      //     this.show = true
      //   })
      // }
    },

    mounted () {

      var svg = document.getElementById("svg");
      var path = document.getElementById("path");
      var limitRates = [ 123.75, 44.65];

      // var packageRates = [
      //   113.65,
      //   65.72,
      //   55.12
      // ];

      var userRate = 73.65; // user rate
      
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

      // function createPointer(x, y){
      //   var triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      //   var points = x + ",285 "+ (x-15) + ",301 " + (x+15) + ",301";
      //   triangle.setAttribute("id", "pointer-triangle");
      //   triangle.setAttribute("points", points);
        
      //   var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      //   line.setAttribute("id", "pointer-line");
      //   line.setAttribute("x1", x);
      //   line.setAttribute("y1", "300");
      //   line.setAttribute("x2", x);
      //   line.setAttribute("y2", y);
        
      //   svg.appendChild(triangle);
      //   svg.appendChild(line);
      // }
      // createPointer(point.x, point.y);
    },
  }
</script>

<style lang="scss">
  @import '~bootstrap';
  @import '~bootstrap-vue';

  @import "../scss/ipa.scss";
</style> 