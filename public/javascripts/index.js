var app = new Vue({
  el: "#app",
  data: {
    userData: {},
    guilds: [],
    specificGuild: null
  },
  methods: {
    selectGuild: function(id) {
      console.log("Selecting Guild!");
      this.specificGuild = this.guilds.find(i => i.id == id);
    }
  },
  mounted() {
    fetch("/get-user")
      .then(response => response.json())
      .then(res => {
        this.userData = res;
      })
      .catch(e => {
        console.log(e);
        window.location = "/";
      });
    fetch("/get-guilds")
      .then(response => response.text())
      .then(res => {
        this.guilds = JSON.parse(res);
      })
      .catch(e => {
        console.log(e);
        window.location = "/";
      });
  }
});

function selectGuild(id) {
  console.log("select Guild called!");
}
