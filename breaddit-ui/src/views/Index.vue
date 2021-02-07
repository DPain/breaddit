<template>
  <div>
    <b-row class="pb-3">
      <b-col></b-col>
      <b-col cols="9">
        <div>
          <b-input-group>
            <b-input-group-prepend>
              <b-button id="prepend" disabled>
                b/
              </b-button>
            </b-input-group-prepend>

            <b-form-input
              id="subreaddit-box"
              v-model="subreaddit"
              placeholder="Enter Subreaddit Name"
            ></b-form-input>

            <b-input-group-append>
              <b-button>
                <b-icon icon="arrow-return-right" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card-group columns>
          <b-card
            v-for="(item, i) in entries"
            :key="i"
            class="m-1 p-1"
            raised
          >
            <b-card-title class="headline" v-text="item.title"></b-card-title>
            <b-card-text v-html="item.body"></b-card-text>
          </b-card>
        </b-card-group>
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
  border: 0;
}
#prepend {
  opacity: 1;
}
a {
  color: #42b983;
}
</style>