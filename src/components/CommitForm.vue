<template>
<div>
  <h1 class="text-center">Commit Message Builder</h1>

  <div class="grid-container">
    <div :class="['callout', isValidCommit ? 'success': 'alert']">
      <pre v-autoselect>{{result}}</pre>
    </div>      
  </div>
  
  <form action="#" class="grid-container" @submit.prevent="saveToClipboard">
    <div class="grid-x grid-padding-x">
      <div class="medium-4 cell">
        <label>Type:
            <select v-model="type">
              <option v-for="option in availableTypes" v-bind:value="option.value">
                {{ option.label }}
              </option>
            </select>
        </label>
      </div>
      
      <div class="medium-4 cell">
        <label>Impact area:
            <select v-model="impactArea">
              <option v-for="option in availableImpactAreas" v-bind:value="option.value">
                {{ option.label }}
              </option>
          </select>
        </label>
      </div>
      
      <div class="medium-4 cell">
        <label>Jira ticket
          <input type="text" placeholder="ABC-123" v-model="jiraTicket"/>
        </label>
      </div>

      <div class="medium-12 cell">
        <label>Commit message
          <textarea rows="6" placeholder="Commit message" v-model="commitMessage"></textarea>
        </label>
      </div>

      <div class="medium-12 cell">
        <button class="button expanded" type="submit" :disabled="!isValidCommit">
          <span v-if="status == 'ready'">Save to clipboard</span>
          <span v-if="status == 'saved'">Copied to clipboard !</span>
        </button>
      </div>

     </div>
  </form>
    
</div>
  
  
</template>

<script>
import {copyTextToClipboard} from '../utils/clipboard';

var availableTypes = 'fix|feat|refactor|style|perf|test|docs|chore'.split('|').map(v => ({label: v, value: v}));
var availableImpactAreas = 'GLOBAL|CHECKOUT|PDP|HP|PLP|CART|MYACCOUNT|MISC'.split('|').map(v => ({label: v, value: v}));
var commitRegex = /^(fix|feat|refactor|style|perf|test|docs|chore)\([A-Z][A-Z_0-9]+-[0-9]+\): (GLOBAL|CHECKOUT|PDP|HP|PLP|CART|MYACCOUNT|MISC) - .+/;


export default {
  data() {
    return {
      type: availableTypes[0].value,
      impactArea: availableImpactAreas[0].value,
      jiraTicket: '',
      commitMessage: '',
      
      availableTypes: availableTypes,
      availableImpactAreas: availableImpactAreas,

      status: 'ready'
    };
  },
  
  computed: {
    result() {
      return `${this.type}(${this.jiraTicket}): ${this.impactArea} - ${this.commitMessage}`;
    },

    isValidCommit() {
      return commitRegex.test(this.result);
    }
  },

  mounted() {
    this.$root.$on("updateCurrentState", this.updateCurrentState.bind(this));
  },

  methods: {
    saveToClipboard() {
      copyTextToClipboard(this.result);
      this.setTemporaryStatus('saved');
      this.saveCurrentState();
    },
    setTemporaryStatus(newStatus) {
      if (this.status != 'ready') {
        return;
      }

      var originalStatus = this.status;
      setTimeout(() => this.status = originalStatus, 1500);
      this.status = newStatus;
    },

    saveCurrentState() {
      var currentState = {
        type: this.type,
        impactArea: this.impactArea,
        jiraTicket: this.jiraTicket,
        commitMessage: this.commitMessage
      };

      this.$root.$emit('pushCurrentState', currentState);
    },

    updateCurrentState(newState) {
      this.type = newState.type;
      this.impactArea = newState.impactArea;
      this.jiraTicket = newState.jiraTicket;
      this.commitMessage = newState.commitMessage;
    }

  }
};
</script>

<style scoped>

</style>
