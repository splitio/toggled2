import axios from 'axios';
import fs from 'fs';


const splitAdminApiKey = fs.readFileSync('SPLIT_ADMIN_API_KEY', 'utf8');

export const handler = async(event) => {
  console.log(event);

  const body = event.body;
  console.log(body);

  let params = new URLSearchParams(body);
  const workspaceName = params.get('workspaceName');
  const environmentName = params.get('environmentName');
  const splitName = params.get('splitName');

  const workspaceId = await getWorkspaceId(workspaceName);
  const environmentId = await getEnvironmentId(environmentName, workspaceId);

  console.log('workspaceId: ' + workspaceId);
  console.log('environmentId: ' + environmentId);
  console.log('splitName: ' + splitName);

  const removeUrl = 'https://api.split.io/internal/api/v2/splits/ws/' + workspaceId 
    + '/' + splitName + '/environments/' + environmentId;
  const deleteUrl = 'https://api.split.io/internal/api/v2/splits/ws/'+ workspaceId 
    + '/' + splitName;

  await axios.delete(removeUrl, { headers: {'Authorization': 'Bearer ' + splitAdminApiKey}})
  .then((response) => {
    console.log('removed definition from environment');
  })
  .catch((error) => {
    console.log(error);
  });

  await axios.delete(deleteUrl, { headers: {'Authorization': 'Bearer ' + splitAdminApiKey}})
  .then((response) => {
    console.log('deleted split ' + splitName);
  })
  .catch((error) => {
    console.log(error);
  });

  const response = {
      statusCode: 200,
      body: JSON.stringify('deleted'),
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
