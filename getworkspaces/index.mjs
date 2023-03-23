import axios from 'axios';
import fs from 'fs';

const splitAdminApiKey = fs.readFileSync('SPLIT_ADMIN_API_KEY', 'utf8');

export const handler = async(event) => {
  console.log(event);

  const body = event.body;
  console.log(body);
  const limit = 20;
  const baseUrl = 'https://api.split.io/internal/api/v2/workspaces?limit=' + limit + '&offset=';
  let offset = 0;
  var config = {
    method: 'get',
    url: baseUrl + offset,
    headers: { 
      'Authorization': 'Bearer ' + splitAdminApiKey, 
      'Content-Type': 'application/json'
    }
  };
  let workspaces = [];
  console.log(config);
  let totalCount = -1;
  do {
    config.url = baseUrl + offset;

    await axios(config)
    .then(function (response) {
      console.log('success 322!')
      console.log(response);
      for(const workspace of response.data.objects) {
        console.log(workspace);
        workspaces.push({name: workspace.name, id: workspace.id});
      }
      totalCount = response.data.totalCount;
      console.log('totalCount: ' + totalCount);
    })
    .catch(function (error) {
      console.log(error);
    });
    offset += limit;

  } while(offset < totalCount);

  const response = {
      statusCode: 200,
      body: workspaces,
  };
  return response;
};

async function getWorkspaceId(name) {
  let result = '';

  await axios.get('https://api.split.io/internal/api/v2/workspaces?name=' + name, 
    { headers: {'Authorization': 'Bearer ' + splitAdminApiKey}})
  .then((response) => {
    console.log(response.data);
    result = response.data.objects[0].id;
  })
  .catch((error) => {
    console.log(error);
  });
  return result;
}

async function getEnvironmentId(name, workspaceId) {
  let result = '';

  await axios.get('https://api.split.io/internal/api/v2/environments/ws/' + workspaceId, 
    { headers: {'Authorization': 'Bearer ' + splitAdminApiKey}})
  .then((response) => {
    console.log(response.data);
    for(const environment of response.data) {
      if(environment.name === name) {
        result = environment.id;
      }
    }
  })
  .catch((error) => {
    console.log(error);
  });
  return result;
}
