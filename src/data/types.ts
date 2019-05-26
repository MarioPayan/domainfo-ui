export class Server {
  Address: string = "";
  SSLGrade: string = "";
  Country: string = "";
  Owner: string = "";
}

export class Domain {
  ServersChanged: boolean = false;
  SSLGrade: string = "";
  PreviousSSLGrade: string = "";
  Logo: string = "";
  Title: string = "";
  IsDown: boolean = false;
  Status: string = "";
  Servers: Server[] = [];
}
