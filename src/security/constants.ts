
export const jwtConstants = {
    secret: process.env.SECRET,
    issuer: process.env.ISSUER
  };

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}