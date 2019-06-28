class APIConfig {
  localhost: string = "http://localhost:3333";
  cloud9: string = "https://domainfo-mariopayan.c9users.io";
  heroku: string = "https://domainfo.herokuapp.com";
  version: string = "v1";
  name: string = "api";
  public url(env: string) {
    let dev = env === "dev";
    let url = "";
    if (dev) {
      url = this.localhost + "/" + this.version + "/" + this.name + "/";
    } else {
      url = this.cloud9 + "/" + this.version + "/" + this.name + "/";
    }
    return url;
  }
}
var apiConfig = new APIConfig();
export default apiConfig;
