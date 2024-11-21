// netlify/functions/scheduled-fetch.js
const { handler } = require('./index');

exports.handler = async (event, context) => {
  const year = new Date().getFullYear();
  const seasons = ['winter', 'spring', 'summer', 'fall'];
  const promises = seasons.map(season => handler({
    path: `/api/anime/${year}/${season}`,
    httpMethod: 'GET',
    queryStringParameters: {},
  }, context));

  await Promise.all(promises);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Data fetched and stored successfully' }),
  };
};