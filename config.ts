const path = require('path');

export const config = {
  public_key: path.resolve('dev-certs', 'jwtRS256.key.pub'),
  private_key: path.resolve('dev-certs', 'jwtRS256.key'),
};
