<template>
  <child-slot-component>
    <!-- <template v-slot:header>
      <h1>1</h1>
    </template> -->

    <template v-slot:footer>
      <h1>3</h1>
    </template>
    
    <h3>h3</h3>

    <template v-slot:myName="slotProps"> 
      <!-- 
        slotProps: 
        자식에서 슬롯 요소에서 바인딩 시킨 user 데이터를 가지고 있음
      -->
      <input :value="slotProps.user.lastName">
    </template>
  </child-slot-component>
</template>

<script>
import ChildSlotComponent from './ChildSlotComponent.vue'

export default {
  name: 'App',
  components: {
    ChildSlotComponent
  }
}
</script>