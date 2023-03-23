import axios from 'axios';
import fs from 'fs';

const splitAdminApiKey = fs.readFileSync('SPLIT_ADMIN_API_KEY', 'utf8');

export const handler = async(event) => {
  console.log(event);

  const workspaceName = event.queryStringParameters.workspaceName;
  const workspaceId = await getWorkspaceId(workspaceName);
  const url = 'https://api.split.io/internal/api/v2/environments/ws/' + workspaceId;
  var config = {
    method: 'get',
    url: url,
    headers: { 
      'Authorization': 'Bearer ' + splitAdminApiKey, 
      'Content-Type': 'application/json'
    }
  };
  let environments = [];
  console.log(config);

  await axios(config)
  .then(function (response) {
    console.log(response);
    for(const environment of response.data) {
      console.log(environment);
      environments.push({name: environment.name, id: environment.id});
    }
  })
  .catch(function (error) {
    console.log(error);
  });

  const response = {
      statusCode: 200,
      body: environments,
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

