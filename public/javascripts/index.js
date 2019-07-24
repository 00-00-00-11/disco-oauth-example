var app = new Vue({
  el: "#app",
  data: {
    userData: {}
  },
  mounted() {
    fetch("/get-user")
      .then(response => response.json())
      .then(res => {
        if (res) {
          this.userData = res;
        }
      })
      .catch(() => {
        window.location = "/";
      });
  }
});
