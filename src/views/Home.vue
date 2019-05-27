<template>
  <div class="home">
    <div id="busy-holder" v-if="loading"></div>
    <b-spinner
      id="spinner"
      variant="primary"
      label="Spinning"
      v-if="loading"
    ></b-spinner>
    <b-row>
      <b-col>
        <div class="mainInputContainer">
          <b-form-input
            class="mainInput"
            v-model="domain"
            placeholder="yourdomain.com"
          ></b-form-input>
        </div>
        <b-button-group class="buttons">
          <b-button variant="primary" v-on:click="search()">Search!</b-button>
          <b-button variant="outline-warning" v-on:click="clean()"
            >Clean</b-button
          >
        </b-button-group>
        <h6 v-if="internalLoading">
          Hey, sorry for bothering you. <br />
          <br />Sometimes, <b>SSL Labs</b> take too much time getting all the
          data but don't worry, we will show you as much as we could find, so
          feel free to click search again in whenever you want to see if this
          data is completed, you wouldn't see this message once the data is
          completed :) <br />
          <br />If you don't believe me, can check it
          <b>
            <a
              v-bind:href="
                'https://api.ssllabs.com/api/v3/analyze?host=' + domain
              "
              >here</a
            >
          </b>
          and just look for "In progress" fields, if everything is ok, just
          search again!
        </h6>
        <h6 v-if="invalidDomain">
          Please review your domain, don't use 'http://' either 'www.', just
          leave it like 'domain.com'
        </h6>
        <h2 v-if="backendDown">
          Panic! Looks like there is a problem in the backend side, try with
          another url, if fail again, please contact the admin
          <h6>{{ errorMessage }}</h6>
        </h2>
      </b-col>
      <b-col cols="8">
        <b-card
          id="domainCard"
          v-if="showData"
          v-bind:img-src="domain_data.Logo"
          img-top
        >
          <h2>
            Title: <b>{{ domain_data.Title }}</b>
          </h2>
          <h5>
            SSL Grade: <b>{{ domain_data.SSLGrade }}</b>
          </h5>
          <h5>
            Previous SSL Grade: <b>{{ domain_data.PreviousSSLGrade }}</b>
          </h5>
          <h5>
            Is Up?
            <span v-if="domain_data.IsDown">
              <b> <i class="fas fa-times"></i> </b>
            </span>
            <span v-else>
              <b> <i class="fas fa-check"></i> </b>
            </span>
          </h5>
          <h5>
            Has server changed?
            <span v-if="domain_data.ServersChanged">
              <i class="fas fa-check"></i>
            </span>
            <span v-else> <i class="fas fa-times"></i> </span>
          </h5>
          <hr />
          <h4 v-if="domain_data.Servers.length != 0">Servers:</h4>
          <div
            class="servers"
            v-for="server in domain_data.Servers"
            :key="server.Address"
          >
            <b-card class="server">
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
          </div>
        </b-card>
        <b-card id="textHelp" v-else img-src="../assets/domainfo.png" img-top>
          <b-card-text>
            <h4>
              Type a domain like "truora.com" on the left side and click the
              search button to get and show the info
            </h4>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Domain, Server } from "../data/index";
import api from "../data/apiConfig";
import env from "../data/environment";

var apiUrl = api.url(env);

@Component({})
export default class Home extends Vue {
  @Prop({ default: "" }) domain!: string;
  @Prop({ default: false }) private loading!: boolean;
  @Prop({ default: false }) private internalLoading!: boolean;
  @Prop({ default: false }) private showData!: boolean;
  @Prop({ default: false }) private invalidDomain!: boolean;
  @Prop({ default: false }) private backendDown!: boolean;
  @Prop({ default: false }) public errorMessage!: string;
  @Prop({ default: new Domain() }) domain_data!: Domain;
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
  clean() {
    this.domain = "";
    this.showData = false;
  }
  isDomainOk() {
    let regex = new RegExp(/^\w+(\.\w+)$/);
    let valid = regex.test(this.domain);
    this.invalidDomain = !valid;
    return valid;
  }
  search() {
    if (this.isDomainOk()) {
      this.loading = true;
      this.internalLoading = false;
      this.showData = false;
      fetch(apiUrl + "domain/" + this.domain, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.status === 211) {
            this.internalLoading = true;
            this.search();
            return null;
          } else if (response.status === 206) {
            this.internalLoading = true;
          } else if (response.status === 200) {
            this.internalLoading = false;
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            this.domain_data.ServersChanged =
              "ServersChanged" in data ? data.ServersChanged : false;
            this.domain_data.SSLGrade =
              "SSLGrade" in data && data.JAJAJAJAJAJA != ""
                ? data.SSLGrade
                : "¯\\_(ツ)_/¯";
            this.domain_data.PreviousSSLGrade =
              "PreviousSSLGrade" in data && data.PreviousSSLGrade != ""
                ? data.PreviousSSLGrade
                : "¯\\_(ツ)_/¯";
            this.domain_data.Logo =
              "Logo" in data && data.Logo != "" ? data.Logo : "¯\\_(ツ)_/¯";
            this.domain_data.Title =
              "Title" in data && data.Title != "" ? data.Title : "¯\\_(ツ)_/¯";
            this.domain_data.IsDown = "IsDown" in data ? data.IsDown : false;
            this.domain_data.Status =
              "Status" in data && data.Status != ""
                ? data.Status
                : "¯\\_(ツ)_/¯";
            this.domain_data.Servers = "Servers" in data ? data.Servers : [];
            this.loading = false;
            this.showData = true;
          }
        })
        .catch(error => {
          this.errorMessage = error;
          this.loading = false;
          this.showData = false;
        });
    }
  }
}
</script>

<style>
.mainInputContainer {
  width: 100%;
}
.mainInput {
  display: inline;
  font-size: 34px;
}
#spinner {
  text-align: center;
  position: fixed;
  float: center;
  width: 100px;
  height: 100px;
  top: 35%;
  right: 35%;
  z-index: 3;
}
#busy-holder {
  width: 99%;
  height: 99%;
  position: absolute;
  display: block;
  background: white;
  opacity: 0.5;
  z-index: 2;
}
.buttons {
  padding: 20px;
}
#domainCard img {
  padding: 12px;
  max-width: 350px;
}
.servers {
  display: inline-block;
  padding-left: 30px;
  padding-top: 10px;
}
.server {
  max-width: 250px;
}
hr {
  border-top: 1px dashed gray;
  opacity: 0.3;
}
</style>
