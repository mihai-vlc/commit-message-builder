<template>
  <div id="app">
    <commit-form />
    <history-navigation />
    <div class="credits">Made with ♥ by <a href="https://github.com/ionutvmi">Mihai Ionut Vilcu</a></div>
  </div>
</template>

<script>
import CommitForm from "./components/CommitForm";
import HistoryNavigation from "./components/HistoryNavigation";

export default {
  name: "App",
  components: {
    CommitForm,
    HistoryNavigation
  }
};
</script>

<style scoped>
  .credits {
    margin-top: 40px;
    text-align: center;
    color: #efefef;
  }
  .credits a {
    color: #efefef;
  }
  .credits:hover a,
  .credits:hover {
    color: #aaa;
  }

</style>
