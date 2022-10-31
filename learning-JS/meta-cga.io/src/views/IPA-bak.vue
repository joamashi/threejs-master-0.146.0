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
                  
                </div>
            </b-sidebar>
          </b-col>
        </b-row>
      </b-container>
    </header>

    <!-- <div class="ipa-view">
      <b-container>
        <b-row>
          <b-col cols="12">
            <div class="lostcoast-logo">
              <img alt="lostcoast" width="45" src="@/assets/ipa/logo.png">
            </div>
            <div class="text-0">* 기간 : 2002년 7월말까지</div>
            <div class="text-1">주문하신 모든 분께</div>
            <div class="text-2">ROST COAST 맥주</div>
            <div class="text-3"><em><img width="60" src="@/assets/ipa/lostcoast-cup.png"></em> 전용 잔 을 드립니다.</div>
          </b-col>
        </b-row>
      </b-container>
    </div> -->

    <b-container fluid="sm" class="ipa">

      <h4>
        <em class="ic"><b-icon-check-square></b-icon-check-square></em> 로스트코스트 맥주 중 <strong>12병</strong> 또는 <strong>24병</strong> 씩 선택(교차 가능)하시면 매장에서 셀프로 픽업하실 수 있는 서비스입니다.
      </h4>

      <!-- <h4><em class="ic"><b-icon-check-square></b-icon-check-square></em> 주문한 맥주는 매장에서만 결제가 가능합니다.</h4>

      <h4><em class="ic"><b-icon-check-square></b-icon-check-square></em> 주문한 맥주는 주문 후 일주일간 보관 합니다.</h4> -->

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
        ></b-form-radio-group>
      </b-form-group>



      <!-- IPA List -->
      <ul class="ipa-list">
        <li v-for="(beer, index) in beers" :key="beer.id">

          <!-- / checkbox -->
          <b-form-checkbox 
            v-model="beer_selected" 
            :value="beer.code"
            :options="beer_options"
            :checked="beer.checked"
            :disabled="beer.checkbox_disabled"
            @change="toggleIndeterminate(index)">
              <i><img :src="beer.Prodpic" :alt="beer.name"></i> 
              <p>{{ beer.name }}</p> 
              <em>￦ {{ beer.price }} / {{ beer.volume }}mL</em>
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
              
              <!-- <p>max : {{ beer.max }} || orderQuantity : {{ orderQuantity }}</p>
              <p>fullmax : {{ fullmax  }} || counter : {{ counter }}</p> -->

              <!-- Vue.js의 $refs를 통해 dom에 접근하기 -->
          </div>
        </li>
      </ul>

      <div class="sticky-product-bar-wrapper--is-visible">
        <b-container>
          <b-row>
            <b-col cols="8">
              <span><em>{{ counter }}</em>병 선택 가능</span>
              <p>금액 <em>￦</em><strong>{{ totalAmount }}</strong></p>
            </b-col>
            <b-col cols="4">
              <b-button block variant="dark" size="lg" :disabled="order_disabled">주문</b-button>
            </b-col>
          </b-row>
        </b-container>
      </div>

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

        counter: 0,           // 남은 병
        fullmax: 0,           // 증가 / 감소 병 수
        orderQuantity: 0,     // 전체 주문 병
        totalAmount: 0,       // 총 주문 금액
        order_disabled: true, // 주문 가능 버튼

        // min: 0,
        // max: 0,

        // state: false,

        bottle_selected: 0,
        bottle_options: [
          { 
            text: '12병 주문', 
            value: 12
          },
          { 
            text: '24병 주문', 
            value: 24
          }
        ],
        
        beer_options: [],
        beer_selected: [],
  
        beers: [
          {
            name: '달빛 필스너',
            code: 'ipa-1',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/01.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '텐저린 위트 에일',
            code: 'ipa-2',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/02.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '워터멜론 위트 에일',
            code: 'ipa-3',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/03.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '아프리캇 위트 에일',
            code: 'ipa-4',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/04.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '그레이트 화이트 윗비어',
            code: 'ipa-5',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/05.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '샤키네이터 IPA',
            code: 'ipa-6',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/06.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '인디카 IPA',
            code: 'ipa-7',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/07.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '다운 타운 브라운',
            code: 'ipa-8',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/08.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '피넛 버터 초콜릿 밀크 스타우트',
            code: 'ipa-9',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/09.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '헤이지 IPA',
            code: 'ipa-10',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/10.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '레버넌트 IPA',
            code: 'ipa-11',
            price: 4200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/11.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '포그커터 더블 IPA',
            code: 'ipa-12',
            price: 4600,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/12.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          },
          {
            name: '트리플 IPA',
            code: 'ipa-13',
            price: 5200,
            volume: 355,
            value: 0,
            Prodpic: 'http://devux.ai/assets/ipa/13.png',
            checked: false,
            checkbox_disabled: false,
            spin_disabled: true,
            spin_readonly: false,
            min: 0,
            max: 0
          }
        ],

      }
    },

    components: {
      
    },

    beforeCreate() {
      
    },

    created () {
      document.title = this.$route.meta.title;
      
      this.$http.get('/api/ipa').then(( response ) => {
        this.ipa = response.data[0];

        this.ipa.beers = this.ipa.beers.map((v) => {
          v.min = 1; // 최소 
          v.max = this.ipa.bottle_options[0].value; // 최대
          return v
        });

        this.ipa.bottle_selected = this.ipa.bottle_options[0].value;  // 12 / 24 주문 병 디폴트
        this.ipa.counter = this.ipa.bottle_options[0].value;  // 남은 병
        this.ipa.orderQuantity = this.ipa.bottle_options[0].value;    // 전체 주문 병
      })

    },

    computed: { 

    },

    watch: {
      
    },

    methods: {
      // 12 / 24 선택
      toggleOrderQuantity (value) {
        console.log('toggleOrderQuantity', value);

        this.counter = value;   // 남은 병
        this.orderQuantity = value;     // 전체 주문 병
        

        // spinbutton 초기화
        this.beers = this.beers.map((v) => {
          v.spin_disabled = true;
          v.checkbox_disabled = false;
          v.checked = false;
          v.value = 0;
          v.max = value;

          return v
        });

        // checkbox 초기화
        this.beer_selected = [];

        console.log('checkbox : ', this.beer_selected)
        console.log('beers : ', this.beers)

        // 총 주문 금액 초기화
        this.totalAmount = 0
        this.fullmax = 0

        // 주문 버튼 초기화
        this.order_disabled = true;
      },

      // this.beers[0].checked = true;
      // this.beers[0].checkbox_disabled = true
      // this.beer_selected.push(code);

      order () {
        // 주문하기  #######################################################
        if (this.fullmax == this.bottle_selected) {
          /**
           * 주문 가능 병이 완료
           */
          this.beers.filter((v) => { // index

            // 전체 체크박스 Desabled
            if (v.checked !== true)  v.checkbox_disabled = true

            // 전체 spin버튼 Readonly
            else v.spin_readonly = true
            return v
          })

          this.order_disabled = false;

        } else {
          /**
           * 주문 가능 병이 미완료
           */
          this.beers.filter((v) => { // index

            // 전체 체크박스 Desabled 적용
            if (v.checkbox_disabled == true) v.checkbox_disabled = false

            // 전체 spin버튼 Readonly 해제
            else v.spin_readonly = false
            return v
          })

          this.order_disabled = true;
        }
        // 주문하기  #######################################################

        console.log('beer_selected >> ', this.beer_selected)

      },

      increment (index) {
        // 주문 금액 증가
        this.totalAmount = this.totalAmount + this.beers[index].price;

        // 총 개수 증가
        this.fullmax += 1;

        // 카운트 감소
        this.counter -= 1;
      },
        
      decrement (index) {
        // 주문 금액 감소
        this.totalAmount = this.totalAmount - (this.beers[index].price * this.beers[index].value);

        // 총 개수 감소
        this.fullmax -= this.beers[index].value;

        // 카운트 증가
        this.counter += this.beers[index].value;
      },

      // 맥주 선택
      toggleIndeterminate (index) {

        if (this.beers[index].checked == false) {
          // console.log('주문 선택')

          // ------------------------------------------------------------------------------------

          // 체크박스 활성화
          this.beers[index].checked = true;

          // spin버튼 활성화
          this.beers[index].spin_disabled = false; 

          // ------------------------------------------------------------------------------------

          this.increment(index);

          // MAX 값 감소를 위해 카운트 값 1씩 증가
          // this.beers = this.beers.map((v) => {
          //   v.max = this.counter + 1;
          //   return v
          // });

          // 개수 1개 증가
          this.beers[index].value += 1; 

        } else {
          // console.log('주문 해제')

          // ------------------------------------------------------------------------------------

          // 체크박스 비활성화
          this.beers[index].checked = false;

          // spin버튼 비활성
          this.beers[index].spin_disabled = true; 

          // ------------------------------------------------------------------------------------

          this.decrement(index);

          // this.counter += this.beers[index].value;

          // this.beers = this.beers.map((v) => {

          //   // 카운트 1 일 때 value값 더해서 MAX 값에 전달
          //   if (this.beers[index].value == 1) { 
          //     v.max = this.orderQuantity; // 1일 경우 최대값 전달
          //   } else {
          //     v.max = this.beers[index].value + 1;
          //   } 

          //   // if (index == i) { // 해당 value 값 디폴트
          //   //   v.max = this.orderQuantity - (this.beers[index].value);
          //   // } else {
          //   //   v.max = this.orderQuantity - this.beers[index].value;
          //   // }
          //   return v
          // });

          // value 0으로 초기화
          this.beers[index].value = 0;
        }
        
        // 주문하기 설정
        this.order()
      },

      // 증가 / 감소 #######################################################
      spinner (index, value) { // value
        
        // aria-label="Decrement"
        // aria-label="Increment"        

        // console.log('spinner 시작', index, value, this.beers[index].flog)
        // console.dir(event)

        // console.log('시작', index, value) // 1 2 2
        
        // hasAttribute 사용 못 함
        // const spin = document.querySelectorAll('body > div > ul > li:nth-child(1) > div.custom-control-select > div').hasAttribute('state-spin');
        
        // ㅠㅠ jQuery
        var stateSpin = this.$$('.ipa-list li:eq('+index+') .custom-control-select .form-control').attr('state-spin');

        
        if (stateSpin == 'up') {

          // Increment 증가
          this.increment (index);

          // MAX 값 감소를 위해 카운트 값 1씩 증가
          // this.beers = this.beers.map((v, i) => {
          //   if (index !== i) v.max = this.counter + 1;
          //   return v
          // });
        
        } else { 
          // Decrement 차감

          if (value !== 1) {
            // 주문 금액 감소
            this.totalAmount = this.totalAmount - this.beers[index].price;

            // 총 개수 감소
            this.fullmax -= 1;

            // // 카운트 증가
            this.counter += 1;
          } else {
            // 기다려봐! 초기화 하기
            
            // *************************************************************

            // 체크박스 비활성화
            // this.beer_selected_computed()

            // 결국 체크박스를 해제 하기 위해 beer_selected 배열을 접근해야 된다.

            this.beers[index].checked = false;
            
            // var full = this._.pull(this.beer_selected, this.beers[index].code)
            // this.beer_selected = full;

            // this.beer_selected = ["ipa-6", "ipa-2"]
            // this.beer_options = 'full'

            // console.log(this.beer_selected, this.beer_options, this.beers[index].code)

            var pull_checked = [];
            this.beers.map((v) => {
              if (v.checked == true)  pull_checked.push(v.code)
            })
            this.beer_selected = pull_checked

            // *************************************************************


            // spin버튼 비활성
            this.beers[index].spin_disabled = true; 

            // ------------------------------------------------------------------------------------

            this.decrement(index);

            // value 0으로 초기화
            this.beers[index].value = 0;
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
    }
  }
</script>

<style lang="scss">

  .hnf-header {
    height: 3.8rem;
    padding-top: .7rem;
    // border-bottom: 1px rgba(0, 0, 0, 0.1) solid;

    .col-8 {
      h1 {
        font-family: 'Roboto Mono', monospace;
        font-size: 1.2rem;
        margin-top: 0.5rem;

        span {
          // color: #007bff;
        }
      }
    }

    .col-4 {      
      text-align: right;

      .btn-secondary {
        color: #000;
        background-color: transparent;
        border-color: transparent;
      }
      .btn-secondary:not(:disabled):not(.disabled):active {
        background-color: transparent;
        border-color: transparent;
      }

      .navbar-toggler-icon {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Cpath stroke='rgba(0, 0, 0)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
      }
    }
  }

  .ipa-view {
    // background-color: #A9CFEF;
    height: 9.4rem;
    position: relative;
    background: url('../assets/ipa/bg-waves.png') repeat-x center 0/auto 100%;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: url('../assets/ipa/bg-header.png') repeat-x 0 0/auto 100%;
      height: 1.2rem;
    }

    .container {
      height: 100%;
      .row {
        height: 100%;

        .lostcoast-logo {
          position: absolute;
          top: 1.5rem;
          left: 1rem;
        }

        // .cup-1 {
        //   position: absolute;
        //   top: 1.2rem;
        //   left: 1rem;
        //   z-index: 2;
        //   img {
        //     // transform: rotate(-5deg);
        //   }
        // }
        // .cup-2 {
        //   position: absolute;
        //   top: -.9rem;
        //   right: 2.5rem;
        //   z-index: 1;
        //   display: none;
        //   img {
        //     transform: rotate(-10deg);
        //   }
        // }

        [class^="text-"] {
          position: absolute;
          font-size: 1.6rem;
          font-weight: bold;
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
          z-index: 1;
          letter-spacing: -2px;
        }
        .text-0 {
          top: 6.2rem;
          left: 1rem;
          // transform: rotate(3deg);
          font-size: .7rem;
          letter-spacing: -1px;
          border-bottom: 1px #000 solid;
          text-shadow: 0 0 0 rgba(0,0,0,0.5);
          box-shadow: 0 0 0 rgba(0,0,0,0.5);
          // padding-right: 1rem;
          color: #000;
        }
        .text-1 {
          top: .8rem;
          right: 2rem;
          // transform: rotate(3deg);
          // font-size: 2.8rem;
          // letter-spacing: -10.3px;
        }
        .text-2 {
          top: 3.1rem;
          right: 2rem;
          // transform: rotate(3deg);
        }
        .text-3 {
          top: 5.2rem;
          right: 1.5rem;
          // transform: rotate(3deg);
          // font-size: 2.1rem;
          em {
            // margin: -.5rem -.8rem 0 -.2rem;
            // display: inline-block;
            // vertical-align: .6rem;
            // transform: rotate(-3deg);
            display: none;
            position: absolute;
            top: -4rem;
            left: -3rem;
          }
        }
      }
    }      
  }
  
  
  .container-sm.ipa {
    padding: 15px 15px 100px;

    h4 {
      font-size: .8rem;
      // font-weight: 300;
      line-height: 1.4rem;
      padding-left: 1.3rem;
      padding-bottom: .5rem;
      position: relative;
      // color: rgba(0, 0, 0, 0.5);
      // margin-top: -.5rem;

      strong {
        border-bottom: 1px #000 solid;
      }

      em.ic {
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .form-group {
      margin-top: 1.5rem;

      .btn-group {
        display: flex;
      }

      .btn-outline-primary {
        color: #007bff;
        font-weight: 300;
        font-size: .9rem;
        border-color: #007bff;
      }
      .btn-outline-primary:hover {
        color: #fff;
        border-color: #007bff;
        background-color: #007bff;
      }
      
      .btn-outline-primary:not(:disabled):not(.disabled):active, 
      .btn-outline-primary:not(:disabled):not(.disabled).active {
        color: #fff;
        border-color: #007bff;
        background-color: #007bff;
      }

      .btn-outline-primary:focus, 
      .btn-outline-primary.focus {
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      .btn-outline-primary:not(:disabled):not(.disabled):active:focus, 
      .btn-outline-primary:not(:disabled):not(.disabled).active:focus, 
      .show > .btn-outline-primary.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    }

    .ipa-list {
      li {
        padding: 18px 0;
        border-bottom: 1px rgba(238, 238, 238, 1) solid;
        position: relative;
        
        display: flex;

        &:last-child {
          border-bottom: none;
        }


        .custom-checkbox {
          flex: 1;
          padding-left: 0;
          position: static;

          .custom-control-label {
            font-size: 1.2rem;
            line-height: 1.6rem;
            vertical-align: middle;

            display: block;
            margin-right: 8rem;
                    
            i {
              display: inline-block;
              vertical-align: -6px;
              margin-left: 1.5rem;
              img {
                width: 4rem;
              }
            }

            p {
              position: absolute;
              top: 0.9rem;
              left: 5rem;
              right: 0;

              display: block;
              text-overflow:ellipsis;
              white-space:nowrap;
              word-wrap:normal;
              overflow:hidden;
            }

            em {
              position: absolute;
              top: 2.5rem;
              left: 5rem;

              font-style: initial;
              font-size: .75rem;
              display: block;
              
              color: rgba(142, 50, 13, 0.5); 
            }
          }

          .custom-control-label::before {
            top: 1.30rem;
            left: .2rem;
            // border-radius: 3rem;
            border: 1px #ced4da solid;
            width: 1.5rem;
            height: 1.5rem;
          }
          .custom-control-label::after {
            top: 1.30rem;
            left: .2rem;
            width: 1.5rem;
            height: 1.5rem; 
          }

          .custom-control-input:checked ~ .custom-control-label::before {
              border-color: #007bff;
              background-color: #007bff;
          }
          .custom-control-input:focus ~ .custom-control-label::before {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
          
        }

        .custom-control-select {
            position: absolute;
            right: 0;
            top: 1.9rem;

            .form-control.focus {
                background-color: #fff;
                border-color: #000;
                outline: 0;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.14);
            }

            .b-form-spinbutton {
    
              .btn {
                transition: opacity 0.15s ease-in-out;
                width: 36px;
                opacity: 1;
              }
            }

            .b-form-spinbutton.disabled {
              opacity: .3;
            }

            .b-form-spinbutton.readonly {
              background-color: #fff;
              border: 1px solid #fff;
              color: #007bff;
              

              bdi {
                font-weight: 300;
                // font-size: 1.5rem;
                // min-width: 1.35em;
              }

              .border-left {
                border-left: 1px solid rgba(255, 255, 255, 0) !important;
              }

              .border-right {
                border-right: 1px solid rgba(255, 255, 255, 0) !important;
              }

              .btn {
                opacity: 0;
              }
            }
          }
        
      }
    }
  }

  .sticky-product-bar-wrapper--is-visible {
    transition: transform .2s ease-in-out;
    // transform: translateY(100%);
    background: #FFF200; // A7F46B
    border-top: 1px rgba(218, 213, 130, 0.7) solid;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 5.5rem;
    padding-top: 15px;

    .col-8 {
      span {
        font-size: .85rem;
        line-height: .85rem;
        letter-spacing: .5px;

        em {
          font-style: initial;
          font-weight: bold;
          font-size: 1.5rem;
          letter-spacing: .5px;
          display: inline-block;
          padding-right: 3px;
        }
        strong {
          font-size: 1.2rem;
        }
      }
      p {
        font-size: 1rem;
        line-height: 1.5rem;

        em {
          font-size: .9rem;
          font-style: initial;
          font-weight: bold;
          vertical-align: 8px;
          padding:0 3px 0 9px;
          display: inline-block;
          color: #007bff;
        }

        strong {
          font-size: 1.5rem;
          color: #007bff;
          letter-spacing: .2px;
        }
      }
    }

    .btn-dark:not(:disabled):not(.disabled):active {
      background-color: #0055b1;
      border-color: #0055b1;
    }

    .btn-dark:not(:disabled):not(.disabled):active:focus {
      box-shadow: 0 0 0 0.2rem rgba(104, 186, 255, 0.5);
    }

    .btn-dark {
      background-color: #007bff;
      border-color: #007bff;
      line-height: 1.8;
    }

    .btn.disabled, 
    .btn:disabled {
      opacity: 0.25;
    }
  }
</style> 