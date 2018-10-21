<template>
  <div class="grid-container">
    <div class="clearfix">
      <button 
        v-if="hasPreviousState"
        @click="loadPreviousState"
        class="button">
        Previous
      </button>
      <button 
        v-if="hasNextState"
        @click="loadNextState"
        class="button float-right">
        Next
      </button>
    </div>

    <div v-if="reversedData.length > 0" class="list-group">
      <div
        v-for="item, index in reversedData"
        :class="['list-group-item', {active: index === (reversedData.length - currentStateIndex - 1)}]">
          <a
            class="action"
            @click.prevent="setActiveState(reversedData.length - index - 1)" 
            href="#">
            {{generateCommitMessage(item)}}
          </a>
          <a href="#" 
            class=""
            @click.prevent="removeSavedItem(reversedData.length - index - 1)"
            class="button small alert">x</a>
      </div>
    </div>

    <div class="text-center" v-if="storedData.length > 0">
      <button 
        @click="clearStoredData"
        class="button small">
        Clear saved data ({{this.storedData.length}})
      </button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      storedData: [],
      currentStateIndex: 0
    };
  },

  computed: {
    hasNextState() {
      return this.currentStateIndex + 1 < this.storedData.length;
    },
    hasPreviousState() {
      return this.currentStateIndex > 0;
    },
    reversedData() {
      return this.storedData.slice().reverse();
    }
  },

  mounted() {
    this.storedData = this.getStoredData();
    this.currentStateIndex =
      this.storedData.length > 0 ? this.storedData.length - 1 : 0;
    this.$root.$on("pushCurrentState", this.pushCurrentState.bind(this));

    this.setActiveState(this.currentStateIndex);
  },

  methods: {
    getStoredData() {
      var storedData;
      try {
        storedData =
          JSON.parse(localStorage.getItem("commitMessageBuilderData")) || [];
      } catch (e) {
        storedData = [];
      }
      return storedData;
    },

    pushCurrentState(currentState) {
      if (this.isDuplicateState(currentState)) {
        return;
      }

      this.storedData.push(currentState);
      this.currentStateIndex = this.storedData.length - 1;
      this.persist();
    },

    isDuplicateState(state) {
      var encodedState = JSON.stringify(state);
      return this.storedData.some(currentState => {
        return JSON.stringify(currentState) === encodedState;
      });
    },

    loadNextState() {
      this.currentStateIndex++;
      this.$root.$emit(
        "updateCurrentState",
        this.storedData[this.currentStateIndex]
      );
    },
    loadPreviousState() {
      this.currentStateIndex--;
      this.$root.$emit(
        "updateCurrentState",
        this.storedData[this.currentStateIndex]
      );
    },
    setActiveState(index) {
      this.currentStateIndex = index;
      this.$root.$emit(
        "updateCurrentState",
        this.storedData[this.currentStateIndex]
      );
    },

    removeSavedItem(index) {
      this.storedData.splice(index, 1);
      this.persist();

      if (
        index < this.currentStateIndex ||
        this.currentStateIndex > this.storedData.length - 1
      ) {
        this.currentStateIndex = Math.max(0, this.currentStateIndex - 1);
      }

      if (this.storedData.length > 0) {
        this.setActiveState(this.currentStateIndex);
      }
    },

    clearStoredData() {
      this.storedData = [];
      this.currentStateIndex = 0;
      this.persist();
    },

    generateCommitMessage(data) {
      return `${data.type}(${data.jiraTicket}): ${data.impactArea} - ${
        data.commitMessage
      }`;
    },

    persist() {
      localStorage.setItem(
        "commitMessageBuilderData",
        JSON.stringify(this.storedData)
      );
    }
  }
};
</script>

<style scoped>
.list-group {
  margin-bottom: 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 0;
  background: #fefefe;
  box-shadow: none;
  overflow: hidden;
  color: #0a0a0a;
}

.list-group > :last-child {
  margin-bottom: 0;
}

.list-group-item {
  display: flex;
  padding: 0;
  border-bottom: 1px solid #e6e6e6;
}

.list-group-item > :last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.list-group-item.active {
  color: #fefefe;
  background-color: #1779ba;
  border-color: 1px solid #1779ba;
}

.list-group-item .action {
  width: 100%;
  padding: 0.4rem;
}

.list-group-item.active .action {
  color: #fefefe;
}

.list-group-item:hover,
.list-group-item:focus {
  background-color: #e8f2ff;
}

.list-group-item:hover.active,
.list-group-item:focus.active {
  background-color: #1779ba;
}

.list-group-item.disabled,
.list-group-item.disabled:hover,
.list-group-item.disabled:focus,
.list-group-item[disabled],
.list-group-item[disabled]:hover,
.list-group-item[disabled]:focus {
  color: #8a8a8a;
  cursor: not-allowed;
  background-color: #fefefe;
}
</style>
