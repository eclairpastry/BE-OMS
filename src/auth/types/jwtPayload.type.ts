export type JwtPayload = {
  id: string;
  name: string;
  username: string;
  image: string;
  role: string;
  role_permission: string[];
  sub_role: string;
  sub_role_permission : string[];
};
