<template>
  <div class="list">
    <b-spinner
      id="spinner"
      variant="primary"
      label="Spinning"
      v-if="loading"
    ></b-spinner>
    <div class="domainList" v-if="showData && !loading">
      <b-card
        class="domainCardList"
        v-for="domain in domains"
        :key="domain.Url"
        v-bind:img-src="domain.Logo"
        img-right
      >
        <b-row>
          <b-col class="firstCol">
            <h2>
              Title: <b>{{ domain.Title }}</b>
            </h2>
            <h5>
              SSL Grade: <b>{{ domain.SSLGrade }}</b>
            </h5>
            <h5>
              Previous SSL Grade: <b>{{ domain.PreviousSSLGrade }}</b>
            </h5>
            <h5>
              Is Up?
              <span v-if="domain.IsDown">
                <b> <i class="fas fa-times"></i> </b>
              </span>
              <span v-else>
                <b> <i class="fas fa-check"></i> </b>
              </span>
            </h5>
            <h5>
              Has server changed?
              <span v-if="domain.ServersChanged">
                <i class="fas fa-check"></i>
              </span>
              <span v-else> <i class="fas fa-times"></i> </span>
            </h5>
          </b-col>
          <b-col class="secondCol">
            <b-tabs pills card content-class="mt-3">
              <b-tab
                class="serverTabs"
                v-for="(server, index) in domain.Servers"
                :key="server.Address"
                v-bind:title="'Server ' + (index + 1)"
              >
                <b-card class="serverCardList">
                  <h6>
                    Address: <b>{{ server.Address }}</b>
                  </h6>
                  <h6>
                    SSL Grade: <b>{{ server.SSLGrade }}</b>
                  </h6>
                  <h6>
                    Country: <b>{{ server.Country }}</b>
                  </h6>
                  <h6>
                    Owner: <b>{{ server.Owner }}</b>
                  </h6>
                </b-card>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Domain, Server } from "../data/index";
import api from "../data/apiConfig";
import env from "../data/environment";

var apiUrl = api.url(env);

@Component({})
export default class List extends Vue {
  @Prop({ default: false }) private loading!: boolean;
  @Prop({ default: false }) private showData!: boolean;
  @Prop({ default: [] }) domains!: Domain[];
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
      ]
    };
  }
  getList() {
    this.loading = true;
    this.showData = false;

    fetch(apiUrl + "domain/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.domains = data;
        this.loading = false;
        this.showData = true;
      });
  }
  beforeMount() {
    this.getList();
  }
}
</script>
<style>
.domainList {
  width: 100%;
  display: inline-block;
}
.domainCardList {
  background-color: #edf3fc;
  margin: 5px;
}
.domainCardList img {
  max-height: 150px;
  max-width: 300px;
  margin: auto;
  padding-right: 30px;
}
.serverList {
  display: inline-block;
  padding-bottom: 5px;
}
.serverCardList {
  color: black;
}
.card-header-pills {
  background-color: rgba(0, 0, 0, 0);
}
.card-header {
  background-color: rgba(0, 0, 0, 0);
}
.list hr {
  border-top: 1px dashed white;
  opacity: 0.7;
}
.firstCol {
  margin-top: 40px;
}
.secondCol {
  max-width: 600px;
}
</style>
