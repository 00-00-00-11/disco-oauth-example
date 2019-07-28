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
      .then(response => response.text())
      .then(res => {
        console.log(res);
        this.userData = JSON.parse(res);
      })
      .catch(e => {
        console.log(e);
        setTimeout(() => {
          window.location = "/";
        }, 5000);
      });
    fetch("/get-guilds")
      .then(response => response.text())
      .then(res => {
        console.log(res);
        this.guilds = JSON.parse(res);
      })
      .catch(e => {
        console.log(e);
        setTimeout(() => {
          window.location = "/";
        }, 5000);
      });
  }
});

function selectGuild(id) {
  console.log("select Guild called!");
}
