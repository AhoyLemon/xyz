var app = new Vue({
  el: '#app',
  data: {
    flipping: false,
    coinSide: "heads",
    cheatMode: false,
    intent: null,
    flipComplete: false
  },

  methods: {

    intend(s) {
      let self = this;
      if (s != self.intent) {
        self.cheatMode = true;
        self.intent = s;
      } else {
        self.cheatMode = false;
        self.intent = null;
      }
    },

    flipCoin() {
      let self = this;
      self.flipComplete = false;
      self.flipping = true;

      setTimeout(
        function() {

          let r = randomNumber(1,99);
          let s;
          if (self.cheatMode && self.intent) {
            s = self.intent;
          } else {
            if (r < 50) {
              s = "heads";
            } else {
              s = "tails";
            }
          }
          

          self.coinSide = s;
          self.flipping = false;
          self.flipComplete = true;
        }, 5000);

    }
  },

  computed: {
    computedHeads() {
      let self = this;
      if (self.cheatMode) {
        return 'img/heads-2.png';
      } else {
        return 'img/heads.png';
      }
    },
    computedTails() {
      let self = this;
      if (self.cheatMode) {
        return 'img/tails-2.png';
      } else {
        return 'img/tails.png';
      }
    }
  },

  mounted: function() {

  }

});
