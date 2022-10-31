<template>
  <fragment>

    <div>
      <router-link to="/">Home</router-link> |
      <router-link to="/testvue2020">TestVue2020</router-link>
    </div>

    <img alt="Vue logo" :width="width" src="../../assets/logo.png">
    <img alt="Vue logo" width="50" src="@/assets/logo.png">

    <hr>

    <HelloWorld msg="Welcome to Your Vue.js App"/> <!-- 컴포넌트 -->

    <hr>

    <p :title="message">{{ message }}</p>
    <p v-bind:title="message">{{ message }}</p>
    <p v-bind:title="message">{{ message.split('').reverse().join('') }}</p>

    <p>원본 메시지: "{{ message }}"</p>
    <p>computed 메시지: "{{ now }}"</p>
    <!-- <p>역순으로 표시한 메시지: "{{ reverseMessage() }}"</p> -->
    
    <hr>

    <button v-on:click="reverseMessage">reverseMessage</button>
    <button @click="reverseMessage">reverseMessage</button>
    <button @click="aaa">aaa</button>

    <hr>

    <input v-model="message">

    <p v-if="seen">이제 나를 볼 수 있어요</p>

    <hr>

    <ol>
      <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
    </ol>

    <ol>
      <!-- <todo-item v-for="item in groceryList" :todo="item" :key="item.id"></todo-item> -->
    </ol>

    <hr>

    <p>{{ foo + " fofofo" }}</p>
    <button v-on:click="foo = 'baz!!!!!!!!!!!!!'">Change it</button>

    <hr>

    <span v-once>다시는 변경하지 않습니다: {{ msg + 1 }}</span>
    <span v-html="msg"></span>

    <hr>

    <div :id="dynamicId1">"dynamicId1"</div>
    <div :id="dynamicId2">"dynamicId2"</div>
    <div :id="'list-' + id">"dynamicId3"</div>
    <button :disabled="isButtonDisabled">Button</button>

    <hr>

    <a :href="'http://' + url"> naver!! </a>
      <!-- 
        <a :[attributeName]="url"> ... </a>
        <a :[someAttr]="value"> ... </a>
        <a v-on:[eventName]="doSomething"> ... </a>
        <a @[eventName]="doSomething"> ... </a>
        <form v-on:submit.prevent="onSubmit"> ... </form>


        v-bind 약어
        * 전체 문법
        <a v-bind:href="url"> ... </a>

        * 약어
        <a :href="url"> ... </a>

        * shorthand with dynamic argument (2.6.0+)
        <a :[key]="url"> ... </a>


        v-on 약어
        * 전체 문법
        <a v-on:click="doSomething"> ... </a>

        * 약어
        <a @click="doSomething"> ... </a>

        * shorthand with dynamic argument (2.6.0+)
        <a @[event]="doSomething"> ... </a>
      -->

    <hr>

    <p>test 메서드 실행 {{ test() }} {{ aaa() }} {{ foo }}</p>

    <hr>

    <h2>{{ fullName  }}</h2>
  </fragment>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld'
// import todoItem from '@/components/todoItem'

/*
  Root Instance
  └─ TodoList
    ├─ TodoItem
    │  ├─ DeleteTodoButton
    │  └─ EditTodoButton
    └─ TodoListFooter
        ├─ ClearTodosButton
        └─ TodoListStatistics


  // 데이터 객체
  var data = { a: 1 }

  // Vue인스턴스에 데이터 객체를 추가합니다.
  var vm = new Vue({
    data: data
  })

  // 같은 객체를 참조합니다!
  vm.a === data.a // => true

  // 속성 설정은 원본 데이터에도 영향을 미칩니다.
  vm.a = 2
  data.a // => 2

  // ... 당연하게도
  data.a = 3
  vm.a // => 3


  vm.$data === data // => true
  vm.$el === document.getElementById('example') // => true

  // $watch 는 인스턴스 메소드 입니다.
  vm.$watch('a', function (newVal, oldVal) {
    // `vm.a`가 변경되면 호출 됩니다.
  })
*/

export default { // 인스턴스
  name: 'TestVue2020',
  
  // ======================================================================================
  
  data () {
    return {
      message: '안녕하세요 Vue!',
      seen: true,

      width: 80,

      todos: [
        { text: 'JavaScript 배우기' },
        { text: 'Vue 배우기' },
        { text: '무언가 멋진 것을 만들기' }
      ],

      newTodoText: '',
      visitCount: 0,
      hideCompletedTodos: false,
      // todos: [],
      error: null,

      foo: 'bar',
      a: 1,

      msg : '<strong>그래그래</strong>',

      dynamicId1: "dnte0101",
      dynamicId2: null,
      id: 0,
      isButtonDisabled: true,

      url: 'www.naver.com',


      firstName: 'Foo',
      lastName: 'Bar',
      fullName: 'Foo Bar'
    }
  },

  // ======================================================================================

  components: {
    HelloWorld,
    // todoItem
  },

  // ======================================================================================

  // 인스턴스 라이프사이클 훅
  created () {
    document.title = this.$route.meta.title;

    
    // `this` 는 vm 인스턴스를 가리킵니다.
    console.log('created::: a is: ' + this.a)
  },

  // ======================================================================================

  computed: { 
    // computed 속성은 종속 대상을 따라 저장(캐싱)된다는 것
    // computed 속성인 reversedMessage를 여러 번 요청해도 계산을 다시 하지 않고 계산되어 있던 결과를 즉시 반환합니다.

    now () {
      console.log(Date.now())
      return Date.now()
    }
  },


  // ======================================================================================

  methods: {
    // 메소드를 호출하면 렌더링을 다시 할 때마다 항상 함수를 실행

    test() {
      console.log('test 메서드 실행 1' + this.lodash.random(20))
      console.log('test 메서드 실행 2' + this._.random(20))
      console.log('test 메서드 실행 3' + this.custom.random(20))
    },

    reverseMessage () {
      this.message = this.message.split('').reverse().join('')
    },

    aaa () {
      console.log('aaa')
      this.foo = this.message
    }
  },

  // ======================================================================================

  watch: {
    //  Vue 인스턴스의 데이터 변경을 관찰하고 이에 반응하는 보다 일반적인 watch 속성을 제공

    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}
</script>


<style lang="scss" scoped>
  // @import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css";
  // @import "../scss/variables.scss";
</style> 