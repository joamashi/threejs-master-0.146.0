<template>
  <v-app>
 
    <div class="text-center">
      <v-slider
        v-model="model"
        :max="rounded.length - 1"
        :tick-labels="rounded"
      ></v-slider>
  
      <div class="py-3"></div>
  
      <v-sheet
        :class="radius"
        :max-width="model === 6 ? 128 : 256"
        class="mx-auto transition-swing secondary"
        elevation="12"
        height="128"
        width="100%"
      ></v-sheet>
  
      <div class="py-3"></div>
  
      <code class="text-subtitle-1">.{{ radius }}</code>
    </div>



    <div>
      <div class="d-inline pa-2 deep-purple accent-4 white--text">d-inline</div>
      <div class="d-inline pa-2 black white--text">d-inline</div>
      <div class="d-block pa-2 deep-purple accent-4 white--text">d-block</div>
      <div class="d-block pa-2 black white--text">d-block</div>
    </div>

    <hr>

    <v-container fluid>
      <v-row class="text-center" justify="center">
        <v-col cols="12" md="3">
          <div class="pa-4 secondary text-no-wrap rounded-pill">.rounded-pill</div>
        </v-col>
    
        <v-col cols="12" md="3">
          <div class="pa-7 secondary rounded-circle d-inline-block"></div>
          <div>.rounded-circle</div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="pa-4 text-center secondary rounded-0" v-text="`.rounded-0`"></div>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="value in ['-sm', '', '-lg', '-xl']"
          :key="value" cols="12" md="3">
          <div class="pa-4 text-center secondary text-no-wrap"
            :class="`rounded${ value }`"
            v-text="`.rounded${ value }`"
          ></div>
        </v-col>
      </v-row>

      <v-row>

        <!-- 
          lg
          md
          sm
         -->

        <v-col v-for="value in ['t', 'r', 'b', 'l']" :key="value"  cols="12"  sm="6"  md="3" lg="3">
          <div class="pa-4 text-center secondary text-no-wrap"
            :class="`rounded-${ value }-xl`"
            v-text="`.rounded-${ value }-xl`"
          ></div>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="value in ['tl', 'tr', 'br', 'bl']" :key="value" cols="12" md="3">
          <div class="pa-4 text-center secondary text-no-wrap" 
            :class="`rounded-${ value }-xl`" 
            v-text="`.rounded-${ value }-xl`"></div>
        </v-col>
      </v-row>
    </v-container>

    <hr>

    <v-container
      v-for="align in alignments" :key="align"
      class="grey lighten-5 mb-6">
      <v-row :align="align" no-gutters style="height: 150px;">
        <v-col v-for="n in 3" :key="n">
          <v-card class="pa-2" outlined tile>One of three columns</v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="grey lighten-5">
      <v-row no-gutters style="height: 250px;">
        <v-col v-for="align in alignments" :key="align" :align-self="align">
          <v-card class="pa-2" outlined tile>One of three columns</v-card>
        </v-col>
      </v-row>
    </v-container>

    <hr>

    <!-- <v-card>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <v-card-title class="headline">An awesome title</v-card-title>
            <v-card-text>
              <p>
                Duis lobortis massa imperdiet quam. Donec vitae orci sed dolor rutrum auctor. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Praesent congue erat at massa.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <v-card-title class="headline">An even better title</v-card-title>
            <v-card-text>
              <p>
                Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed hendrerit. Maecenas malesuada. Vestibulum ullamcorper mauris at ligula. Proin faucibus arcu quis ante.
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card> -->

    <hr>

    <v-tabs v-model="tab">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>

    <v-tabs-items 
      v-model="tab" 
      active-class="park" 
      transition="slide-no-transition">
      <!-- <v-tab-item v-for="item in items" :key="item">{{ text }}</v-tab-item> -->

      <!-- 
        https://codesandbox.io/s/vuetify-v-tabs-with-vue-router-6rwgo?file=/src/components/User.vue:156-161


        How to use “vuetify” transitions on my components?
        https://stackoverflow.com/questions/44692813/how-to-use-vuetify-transitions-on-my-components


        <v-slide-y-transition>
          <h1>Test</h1>
        </v-slide-y-transition>

        https://stackoverflow.com/questions/48661168/how-to-vuetify-page-transition
      -->

      <v-tab-item>
        <P>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</P>
      </v-tab-item>

      <v-tab-item>
        <P>Duis lobortis massa imperdiet quam. Donec vitae orci sed dolor rutrum auctor. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Praesent congue erat at massa.</P>
      </v-tab-item>

      <v-tab-item>
        <P>Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed hendrerit. Maecenas malesuada. Vestibulum ullamcorper mauris at ligula. Proin faucibus arcu quis ante.</P>
      </v-tab-item>

      <v-tab-item>
        <P>Duis lobortis massa imperdiet quam. Donec vitae orci sed dolor rutrum auctor. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Praesent congue erat at massa.</P>
      </v-tab-item>
    </v-tabs-items>

    <hr>
    
    <v-item-group
      v-model="model3"
      class="pa-2 d-flex justify-center"
      mandatory>
      <v-item
        v-for="([icon, bp, size], i) in sizes"
        :key="i"
        :value="size">
        <template v-slot:default="{ active, toggle }">
          <v-hover v-slot="{ hover }">
            <div
              :class="[(active || hover) ? 'text--primary' : 'text--secondary']"
              class="ma-3 text-center"
              style="cursor: pointer"
              @click="toggle">
              <div
                class="caption"
                v-text="bp"
              ></div>
            </div>
          </v-hover>
        </template>
      </v-item>
    </v-item-group>

    <v-card
      class="d-flex align-center justify-center pa-4 mx-auto"
      max-width="550"
      min-height="76"
      outlined
    >
      <div :class="`text-${model3}`">Example Heading</div>
    </v-card>


    <hr>

    <v-textarea
      name="input-1-1"
      label="Default style"
      value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
    ></v-textarea>

    <!-- 
      <div 
        class="v-input v-textarea v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted">
        <div class="v-input__control">
          <div class="v-input__slot">
            <div class="v-text-field__slot">
              <label for="input-529" class="v-label v-label--active theme--light" style="left: 0px; right: auto; position: absolute;">Default style</label>
              <textarea name="input-1-1" id="input-529" rows="5"></textarea>
            </div>
          </div>
          <div class="v-text-field__details">
            <div class="v-messages theme--light">
              <div class="v-messages__wrapper"></div>
            </div>
          </div>
        </div>
      </div>
     -->
    

    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-textarea
            name="input-7-1"
            label="Default style"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
            hint="Hint text"
          ></v-textarea>
        </v-col>

        <v-col cols="12" md="6">
          <v-textarea
            solo
            name="input-7-4"
            label="Solo textarea"
          ></v-textarea>
        </v-col>

        <v-col cols="12" md="6">
          <v-textarea
            filled
            name="input-7-4"
            label="Filled textarea"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea>
        </v-col>

        <v-col cols="12" md="6">
          <v-textarea
            outlined
            name="input-7-4"
            label="Outlined textarea"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>

    <hr>

    <v-item-group mandatory>
      <v-sheet
        class="overflow-y-auto"
        max-height="600"
        tile
      >
        <v-item
          v-for="[
            c,
            text,
            size,
            weight,
            spacing,
            margin
          ] in classes"
          :key="c"
        >
          <template v-slot:default="{ active, toggle }">
            <v-sheet
              :color="active ? $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4' : undefined"
              class="px-4 pt-4 pb-3"
              tile
              style="cursor: pointer;"
              @click="toggle"
            >
              <div
                :class="[`text-${c}`, active && `mb-${margin}`]"
                class="transition-swing"
                v-text="text"
              >
              </div>
  
              <v-expand-transition>
                <v-responsive
                  v-if="active"
                  max-width="350"
                >
                  <div class="d-flex justify-space-between caption">
                    <div>
                      <div class="grey--text mb-2">
                        Font
                      </div>
  
                      <div class="font-weight-medium">
                        Roboto
                      </div>
                    </div>
  
                    <div>
                      <div class="grey--text mb-2">
                        Weight
                      </div>
  
                      <div
                        class="font-weight-medium"
                        v-text="weight"
                      ></div>
                    </div>
  
                    <div>
                      <div class="grey--text mb-2">
                        Size
                      </div>
  
                      <div
                        class="font-weight-medium"
                        v-text="size"
                      ></div>
                    </div>
  
                    <div>
                      <div class="grey--text text-darken-1 mb-2">
                        Letter spacing
                      </div>
  
                      <div
                        class="font-weight-medium"
                        v-text="spacing"
                      ></div>
                    </div>
                  </div>
                </v-responsive>
              </v-expand-transition>
            </v-sheet>
          </template>
        </v-item>
      </v-sheet>
    </v-item-group>

    <hr>

    <v-container
      class="spacing-playground pa-6"
      fluid
    >
      <v-row>
        <v-col
          class="d-flex align-center"
          cols="12"
          sm="6"
        >
          <v-select
            v-model="paddingDirection"
            :items="directions"
            class="pr-2"
            label="Padding"
          >
            <template v-slot:prepend>
              <strong class="primary--text py-1">p</strong>
            </template>
  
            <template v-slot:append-outer>
              <div class="py-1">
                -
              </div>
            </template>
          </v-select>
  
          <v-select
            v-model="paddingSize"
            :items="paddingSizes.slice(1)"
            label="Size"
          ></v-select>
        </v-col>
  
        <v-col
          class="d-flex"
          cols="12"
          sm="6"
        >
          <v-select
            v-model="marginDirection"
            :items="directions"
            class="pr-2"
            label="Margin"
          >
            <template v-slot:prepend>
              <strong class="primary--text py-1">m</strong>
            </template>
  
            <template v-slot:append-outer>
              <div class="py-1">
                -
              </div>
            </template>
          </v-select>
  
          <v-select
            v-model="marginSize"
            :items="marginSizes"
            label="Size"
          ></v-select>
        </v-col>
  
        <v-col
          class="orange lighten-3 pa-0"
          cols="12"
        >
          <v-sheet
            :class="[computedMargin]"
            elevation="4"
            rounded
          >
            <div
              :class="[computedPadding]"
              class="light-green lighten-3"
            >
              <div
                class="white text-center py-6"
                v-text="playgroundText"
              ></div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <hr>

    <v-checkbox
      v-model="checkbox"
      :label="`Checkbox 1: ${checkbox.toString()}`"></v-checkbox>

    <v-card flat>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col
              cols="12"
              sm="4"
              md="4"
            >
              <v-checkbox
                v-model="ex4"
                label="red"
                color="red"
                value="red"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                label="red darken-3"
                color="red darken-3"
                value="red darken-3"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
            >
              <v-checkbox
                v-model="ex4"
                label="indigo"
                color="indigo"
                value="indigo"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                label="indigo darken-3"
                color="indigo darken-3"
                value="indigo darken-3"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
            >
              <v-checkbox
                v-model="ex4"
                label="orange"
                color="orange"
                value="orange"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                label="orange darken-3"
                color="orange darken-3"
                value="orange darken-3"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
  
          <v-row class="mt-12">
            <v-col
              cols="12"
              sm="4"
              md="4"
            >
              <v-checkbox
                v-model="ex4"
                label="primary"
                color="primary"
                value="primary"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                label="secondary"
                color="secondary"
                value="secondary"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
            >
              <v-checkbox
                v-model="ex4"
                label="success"
                color="success"
                value="success"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                label="info"
                color="info"
                value="info"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
            >
              <v-checkbox
                v-model="ex4"
                label="warning"
                color="warning"
                value="warning"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="ex4"
                label="error"
                color="error"
                value="error"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>



    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>


    <hr>

    
  </v-app>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld'
// 'HelloWorld' is defined but never used
// 'HelloWorld'가 정의되었지만 사용되지 않음

export default {
  name: 'vuetify',
  
  data () {
    const spacers = Array.from({ length: 17 }, (val, i) => `${i}`)
    const nspacers = Array.from({ length: 16 }, (val, i) => `n${i + 1}`)
    const defaults = ['auto', ...spacers]

    return {
      model: 3,
      rounded: [
        '0',
        'sm',
        'md',
        'lg',
        'xl',
        'pill',
        'circle',
      ],

      alignments: [
        'start',
        'center',
        'end',
      ],

      tab: null,
      items: [ 'Appetizers', 'Entrees', 'Deserts', 'Cocktails'],

      model3: 'caption',
      sizes: [
        ['mdi-devices', 'all', 'caption'],
        ['mdi-cellphone-iphone', 'sm', 'body-2'],
        ['mdi-laptop', 'md', 'body-1'],
        ['mdi-monitor', 'lg', 'h6'],
        ['mdi-television', 'xl', 'h4'],
      ],


      classes: [
        ['h1', 'Heading 1', '6rem', '300', '-.015625em', -1],
        ['h2', 'Heading 2', '3.75rem', '300', '-.0083333333em', 0],
        
        ['h3', 'Heading 3', '3rem', '400', 'normal', 1],

        ['h4', 'Heading 4', '2.125rem', '400', '.0073529412em', 2],
        ['h5', 'Heading 5', '1.5rem', '400', 'normal', 2],
        ['h6', 'Heading 6', '1.25rem', '500', '.0125em', 3],
        ['subtitle-1', 'Subtitle 1', '1rem', '400', '.009375em', 4],
        ['subtitle-2', 'Subtitle 2', '0.875rem', '500', '.0071428571em', 4],
        ['body-1', 'Body 1', '1rem', '400', '.03125em', 4],
        ['body-2', 'Body 2', '0.875rem', '400', '.0178571429em', 4],
        ['button', 'Button', '0.875rem', '500', '.0892857143em', 4],
        ['caption', 'Caption', '0.75rem', '400', '.0333333333em', 4],
        ['overline', 'Overline', '0.75rem', '500', '.1666666667em', 4],
      ],


      directions: ['t', 'b', 'l', 'r', 's', 'e', 'x', 'y', 'a'],
      marginDirection: 'a',
      marginSize: '2',
      marginSizes: [...defaults, ...nspacers],
      paddingDirection: 'a',
      paddingSize: '6',
      paddingSizes: defaults,
      playgroundText: 'Use the controls above to try out the different spacing helpers.',


      ex4: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red darken-3', 'indigo darken-3', 'orange darken-3'],

      checkbox: true,

    }
  },

  // ======================================================================================

  components: {
    
  },

  // ======================================================================================

  created () {
    
  },

  // ======================================================================================

  computed: { 
    radius () {
      let rounded = 'rounded'
      const value = this.rounded[this.model]

      if (value !== 'md') {
        rounded += `-${value}`
      }

      return rounded
    },

    typeClass () {
      const type = ['text', this.model]
      const [, breakpoint] = this.current

      if (breakpoint !== 'all') {
        type.splice(1, 0, breakpoint)
      }

      return `.${type.join('-')}`
    },
    current () {
      return this.sizes.find(size => size[2] === this.model)
    },


    computedPadding () {
      return `p${this.paddingDirection}-${this.paddingSize}`
    },
    computedMargin () {
      return `m${this.marginDirection}-${this.marginSize}`
    },
  },


  // ======================================================================================

  methods: {
    
  },

  // ======================================================================================

  watch: {
    
  }
}
</script>





























<style lang="scss">
  @import "../scss/vuetifyjs.scss";

  // @import '~vuetify/src/styles/main.sass';
  // @import '~vuetify/src/styles/styles.sass';

  // @import '../scss/vuetify.css';

  // .v-application--wrap {
  //   min-height: inherit;
  // }


  .v-slider {
    cursor: default;
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }
  .v-slider input {
    cursor: default;
    padding: 0;
    width: 100%;
    display: none;
  }

  .v-slider__track-container {
    position: absolute;
    border-radius: 0;
  }

  .v-slider__track-background, .v-slider__track-fill {
    position: absolute;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }

  .v-slider__thumb-container {
    outline: none;
    position: absolute;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    top: 50%;
  }
  .v-slider__thumb-container:hover .v-slider__thumb:before {
    transform: scale(1);
  }

  .v-slider__thumb {
    position: absolute;
    width: 12px;
    height: 12px;
    left: -6px;
    top: 50%;
    border-radius: 50%;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    transform: translateY(-50%);
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }
  .v-slider__thumb:before {
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    content: "";
    color: inherit;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.3;
    position: absolute;
    left: -12px;
    top: -12px;
    transform: scale(0.1);
    pointer-events: none;
  }

  .v-slider__ticks-container {
    position: absolute;
  }

  .v-slider__tick {
    position: absolute;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    border-radius: 0;
  }
  .v-slider__tick--filled {
    background-color: rgba(255, 255, 255, 0.5);
  }
  .v-application--is-ltr .v-slider__tick:first-child .v-slider__tick-label {
    transform: none;
  }
  .v-application--is-rtl .v-slider__tick:first-child .v-slider__tick-label {
    transform: translateX(100%);
  }
  .v-application--is-ltr .v-slider__tick:last-child .v-slider__tick-label {
    transform: translateX(-100%);
  }
  .v-application--is-rtl .v-slider__tick:last-child .v-slider__tick-label {
    transform: none;
  }

  .v-slider__tick-label {
    position: absolute;
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    white-space: nowrap;
  }

  .v-slider__thumb-label-container {
    position: absolute;
    left: 0;
    top: 0;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .v-slider__thumb-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 0;
    position: absolute;
    left: 0;
    bottom: 100%;
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .v-slider--horizontal {
    min-height: 32px;
    margin-left: 8px;
    margin-right: 8px;
  }
  .v-slider--horizontal .v-slider__track-container {
    width: 100%;
    height: 2px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .v-slider--horizontal .v-slider__track-background, .v-slider--horizontal .v-slider__track-fill {
    height: 100%;
  }
  .v-slider--horizontal .v-slider__ticks-container {
    left: 0;
    height: 2px;
    width: 100%;
  }
  .v-application--is-ltr .v-slider--horizontal .v-slider__tick:first-child .v-slider__tick-label {
    transform: translateX(0%);
  }
  .v-application--is-rtl .v-slider--horizontal .v-slider__tick:first-child .v-slider__tick-label {
    transform: translateX(0%);
  }
  .v-application--is-ltr .v-slider--horizontal .v-slider__tick:last-child .v-slider__tick-label {
    transform: translateX(-100%);
  }
  .v-application--is-rtl .v-slider--horizontal .v-slider__tick:last-child .v-slider__tick-label {
    transform: translateX(100%);
  }
  .v-slider--horizontal .v-slider__tick .v-slider__tick-label {
    top: 8px;
  }
  .v-application--is-ltr .v-slider--horizontal .v-slider__tick .v-slider__tick-label {
    transform: translateX(-50%);
  }
  .v-application--is-rtl .v-slider--horizontal .v-slider__tick .v-slider__tick-label {
    transform: translateX(50%);
  }
  .v-slider--horizontal .v-slider__thumb-label {
    transform: translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg);
  }
  .v-slider--horizontal .v-slider__thumb-label > * {
    transform: rotate(-45deg);
  }

  .v-slider--vertical {
    min-height: 150px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .v-slider--vertical .v-slider__track-container {
    height: 100%;
    width: 2px;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  .v-slider--vertical .v-slider__track-background, .v-slider--vertical .v-slider__track-fill {
    width: 100%;
  }
  .v-slider--vertical .v-slider__thumb-container {
    left: 50%;
  }
  .v-slider--vertical .v-slider__ticks-container {
    top: 0;
    width: 2px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  .v-application--is-ltr .v-slider--vertical .v-slider__tick .v-slider__tick-label, .v-application--is-ltr .v-slider--vertical .v-slider__tick:first-child .v-slider__tick-label, .v-application--is-ltr .v-slider--vertical .v-slider__tick:last-child .v-slider__tick-label {
    transform: translateY(-50%);
    left: 12px;
  }
  .v-application--is-rtl .v-slider--vertical .v-slider__tick .v-slider__tick-label, .v-application--is-rtl .v-slider--vertical .v-slider__tick:first-child .v-slider__tick-label, .v-application--is-rtl .v-slider--vertical .v-slider__tick:last-child .v-slider__tick-label {
    transform: translateY(-50%);
    right: 12px;
  }
  .v-slider--vertical .v-slider__thumb-label > * {
    transform: rotate(-135deg);
  }

  .v-slider__thumb-container--focused .v-slider__thumb:before {
    transform: scale(1);
  }

  .v-slider--active .v-slider__tick {
    opacity: 1;
  }

  .v-slider__thumb-container--active .v-slider__thumb:before {
    transform: scale(1.5) !important;
  }

  .v-slider--disabled {
    pointer-events: none;
  }
  .v-slider--disabled .v-slider__thumb {
    width: 8px;
    height: 8px;
    left: -4px;
  }
  .v-slider--disabled .v-slider__thumb:before {
    display: none;
  }

  .v-slider__ticks-container--always-show .v-slider__tick {
    opacity: 1;
  }

  .v-input__slider.v-input--is-readonly > .v-input__control {
    pointer-events: none;
  }
  .v-application--is-ltr .v-input__slider .v-input__slot .v-label {
    margin-left: 0;
    margin-right: 12px;
  }
  .v-application--is-rtl .v-input__slider .v-input__slot .v-label {
    margin-right: 0;
    margin-left: 12px;
  }

  .v-application--is-ltr .v-input__slider--inverse-label .v-input__slot .v-label {
    margin-right: 0;
    margin-left: 12px;
  }
  .v-application--is-rtl .v-input__slider--inverse-label .v-input__slot .v-label {
    margin-left: 0;
    margin-right: 12px;
  }

  .v-input__slider--vertical {
    align-items: center;
  }
  .v-application--is-ltr .v-input__slider--vertical {
    flex-direction: column-reverse;
  }
  .v-application--is-rtl .v-input__slider--vertical {
    flex-direction: column;
  }
  .v-input__slider--vertical .v-input__slot, .v-input__slider--vertical .v-input__prepend-outer, .v-input__slider--vertical .v-input__append-outer {
    margin: 0;
  }
  .v-input__slider--vertical .v-messages {
    display: none;
  }

  .v-input--has-state .v-slider__track-background {
    opacity: 0.4;
  }
  .v-color-picker__canvas {
    position: relative;
    overflow: hidden;
    contain: strict;
  }
  .v-color-picker__canvas-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 15px;
    height: 15px;
    background: transparent;
    border-radius: 50%;
    box-shadow: 0px 0px 0px 1.5px white, inset 0px 0px 1px 1.5px rgba(0, 0, 0, 0.3);
  }
  .v-color-picker__canvas-dot--disabled {
    box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.7), inset 0px 0px 1px 1.5px rgba(0, 0, 0, 0.3);
  }
  .v-color-picker__canvas:hover .v-color-picker__canvas-dot {
    will-change: transform;
  }
  .v-color-picker__edit {
    margin-top: 24px;
    display: flex;
  }

  .v-color-picker__input {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
  .v-application--is-ltr .v-color-picker__input:not(:last-child) {
    margin-right: 8px;
  }
  .v-application--is-rtl .v-color-picker__input:not(:last-child) {
    margin-left: 8px;
  }
  .v-color-picker__input input {
    border-radius: 4px;
    margin-bottom: 8px;
    min-width: 0;
    outline: none;
    text-align: center;
    width: 100%;
    height: 28px;
  }
  .v-color-picker__input span {
    font-size: 0.75rem;
  }
  .v-color-picker__swatches {
    overflow-y: auto;
  }
  .v-color-picker__swatches > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px;
  }

  .v-color-picker__swatch {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .v-color-picker__color {
    position: relative;
    height: 18px;
    max-height: 18px;
    width: 45px;
    margin: 2px 4px;
    border-radius: 2px;
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    overflow: hidden;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC) repeat;
    cursor: pointer;
  }
  .v-color-picker__color > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>