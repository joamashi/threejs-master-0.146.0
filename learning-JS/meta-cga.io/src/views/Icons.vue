<template>
  <fragment>
    
      <form @submit.prevent="sendEmail">
        <label>reply_to</label>
        <input type="text" name="reply_to" />
        <label>from_name</label>
        <input type="text" name="from_name" />
        <label>to_name</label>
        <input type="text" name="to_name" />
        <label>message_html</label>
        <input type="text" name="message_html" />
        <input type="submit" value="Send">
      </form>
    
  </fragment>
</template>

<script>
import $emailjs from 'emailjs-com';

  export default {
    name: '',
    data () {
      return {

      }
    },

    created () {
      document.title = this.$route.meta.title;

      console.log(this.$emailjs)
    },

    methods: {
      sendEmail: (e) => {
        
        
        var dsd = e.target
        console.log(dsd)

        $emailjs.sendForm('default_service', 'template_GilsFYLg', dsd, 'user_jaUG6eriutvSK1ypKDCoB')
          .then((result) => {
              console.log('SUCCESS!', result.status, result.text);
          }, (error) => {
              console.log('FAILED...', error);
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style> 