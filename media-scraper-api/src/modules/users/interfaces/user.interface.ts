export interface CreateUser {
  username: string;
  password: string;
  name: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  name: string;
}
