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
    <b-row v-for="(item, i) in entries" :key="i">
      <b-col>
        <b-card class="mb-1 mt-1 p-3" raised no-body>
          <b-card-title v-text="item.title"></b-card-title>
          <b-card-text v-html="item.body"></b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    source: String
  },

  data: () => ({
    subreaddit: "",
    entries: [
      {
        title: "Welcome!",
        body:
          "Click load to start analyzing your <b>auth.log</b> file!<br>" +
          "Don't worry, your data all processed within your local machine and is not sent to us!"
      },
      {
        title: "What is this?",
        body:
          "This web app takes in your <b>auth.log</b> file and returns useful information that can make you more informed about attacks towards your system.<br>" +
          "Simply select your <b>auth.log</b> file and the application will handle the rest for you."
      },
      {
        title: "What can I learn?",
        body:
          "The things you can learn from your <b>auth.log</b> file are the following:<br>" +
          "<ul><li>Attacks per IP.</li>" +
          "<li>Top Usernames used.</li>" +
          "<li>Attack frequency over time.</li>" +
          "<li>Attacks per city/country. (WIP)</li></ul>"
      },
      {
        title: "What can I learn?",
        body:
          "The things you can learn from your <b>auth.log</b> file are the following:<br>" +
          "<ul><li>Attacks per IP.</li>" +
          "<li>Top Usernames used.</li>" +
          "<li>Attack frequency over time.</li>" +
          "<li>Attacks per city/country. (WIP)</li></ul>"
      },
      {
        title: "Welcome!",
        body:
          "Click load to start analyzing your <b>auth.log</b> file!<br>" +
          "Don't worry, your data all processed within your local machine and is not sent to us!"
      },
      {
        title: "What is this?",
        body:
          "This web app takes in your <b>auth.log</b> file and returns useful information that can make you more informed about attacks towards your system.<br>" +
          "Simply select your <b>auth.log</b> file and the application will handle the rest for you."
      },
      {
        title: "What is this?",
        body:
          "This web app takes in your <b>auth.log</b> file and returns useful information that can make you more informed about attacks towards your system.<br>" +
          "Simply select your <b>auth.log</b> file and the application will handle the rest for you."
      },
      {
        title: "Welcome!",
        body:
          "Click load to start analyzing your <b>auth.log</b> file!<br>" +
          "Don't worry, your data all processed within your local machine and is not sent to us!"
      },
      {
        title: "What can I learn?",
        body:
          "The things you can learn from your <b>auth.log</b> file are the following:<br>" +
          "<ul><li>Attacks per IP.</li>" +
          "<li>Top Usernames used.</li>" +
          "<li>Attack frequency over time.</li>" +
          "<li>Attacks per city/country. (WIP)</li></ul>"
      }
    ],
    drawer: false,
    model: 1
  })
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