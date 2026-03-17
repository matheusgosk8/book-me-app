import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.BOOKME_BACK_END_URL || 'http://localhost:3000'
  }
});