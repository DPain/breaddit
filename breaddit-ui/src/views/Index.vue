<template>
  <div>
    <b-row class="pb-3">
      <b-col>
        <div>
          <b-input-group>
            <b-button id="prepend" disabled>
              b/
            </b-button>

            <b-form-input
              class="testtest"
              id="subreaddit-box"
              v-model="subreaddit"
              placeholder="Enter Subreaddit Name"
            ></b-form-input>

            <b-button id="enter">
              <b-icon icon="arrow-return-right" />
            </b-button>
          </b-input-group>
        </div>
      </b-col>
    </b-row>
    <div id="recent">
      <b-row v-for="(item, i) in entries" :key="i">
        <b-col>
          <b-card class="mb-1 mt-1 p-3" raised no-body>
            <b-card-title v-text="item.title"></b-card-title>
            <b-card-text v-html="item.body"></b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import {fetchRecent} from '@/services/recent'

export default {
  name: "Index",
  props: {
    source: String
  },

  data: function() {
    return {
      subreaddit: "",
      entries: [
        {
          title: "Loading...",
          body: "Loading..."
        }
      ],
      drawer: false,
      model: 1
    }
  },

  created: async function() {
    this.entries = await fetchRecent()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/style/variables.scss";

#subreaddit-box {
  background-color: $dark;
  border-radius: 0.25rem;
  border-color: $gray-500;
}

#prepend,
#prepend:disabled {
  opacity: 1;
  border-color: $gray-500;
  margin-right: 0.5rem;
}

#enter {
  border-color: $gray-500;
  margin-left: 0.5rem;
}

a {
  color: #42b983;
}
</style>