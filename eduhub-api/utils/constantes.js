export const PUERTO = 4001;
export const FRONTEND_URL = "http://localhost:3000";

export const JWT_SECRET = process.env.JWT_SECRET || "dev_access_secret";
export const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";

export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
export const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "10h";



