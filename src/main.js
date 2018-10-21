/**
 * Author: Mihai Ionut Vilcu <ionutvmi@gmail.com>
 * Date: Oct 2018
 */
import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;

Vue.directive("autoselect", {
  inserted: function(el) {
    el.addEventListener("click", function() {
      window.getSelection().selectAllChildren(el);
    });
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
