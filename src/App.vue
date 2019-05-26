<template>
  <div id="domainfo">
    <sidebar-menu :menu="menu" :collapsed="collapsed" @collapse="onCollapse" />
    <div>
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-nav class="ml-auto">
          <b-navbar-brand>
            <b>Domainfo</b>
          </b-navbar-brand>
        </b-navbar-nav>
      </b-navbar>
      <div
        id="content"
        v-bind:class="{ contract: !expanded, expand: expanded }"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";

@Component({
  components: {
    SidebarMenu
  }
})
export default class Domainfo extends Vue {
  @Prop({ default: true }) private expanded!: boolean;
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Main Navigation"
        },
        {
          href: "/",
          title: "Check Domain",
          icon: "fas fa-search"
        },
        {
          href: "/list",
          title: "List Checked Domains",
          icon: "fas fa-list"
        }
      ],
      collapsed: false
    };
  }
  onCollapse(collapsed: boolean) {
    this.expanded = !collapsed;
  }
}
</script>

<style>
#domainfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.v-sidebar-menu .vsm-header {
  padding: 25px 0px 25px 0px;
  text-align: center;
}
.v-sidebar-menu .vsm-item {
  text-align: left;
}
.v-sidebar-menu.vsm-default {
  width: 270px !important;
}
#content {
  margin: 40px;
}
#content.expand {
  padding-left: 270px;
  transition: all 0.3s ease;
}
#content.contract {
  padding-left: 50px;
  transition: all 0.3s ease;
}
</style>
