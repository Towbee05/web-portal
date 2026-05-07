import { UUID } from "crypto";

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

type Profile = {
  id: UUID;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: Date;
};
