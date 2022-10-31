<template>
  <div>
    <header>
      <slot name="header">
        <h1>4</h1>
      </slot>
    </header>

    <p>slot1</p>

    <main>
      <slot>
        <p>slot2</p>
      </slot>
    </main>

    <slot name="myName" :user="user">
      <input :value="user.lastName">
    </slot>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ChildSlotComponent',
  data() {
    return {
      user: {
        firstName: 'Sunny',
        lastName: 'Kim'
      },
    }
  }
}
</script>