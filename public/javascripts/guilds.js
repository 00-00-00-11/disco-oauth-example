Vue.component("guild", {
  props: ["guildObject"],
  template: `
    <div :title="guildObject.name">
            <img :src="guildObject.icon + '?size=128'" />
        <p class="hide-big">{{ guildObject.name }}</p>
    </div>
    `
});
