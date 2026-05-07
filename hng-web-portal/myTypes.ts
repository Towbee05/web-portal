interface AuthorizationType {
  authentication_url: string;
  state: string;
}

interface Token {
  access_token: string;
  refresh_token: string;
}

interface PendingToken {
  status: string;
}

interface ErrorToken extends PendingToken {
  message: string;
}

interface SuccessToken extends PendingToken {
  data: Token;
}
