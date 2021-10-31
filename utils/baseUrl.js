const baseUrl = process.env.NODE_ENV !== "production" ? process.env.BASE_URL : process.env.HEROKU_URL;

export default baseUrl;
