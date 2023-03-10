const axios = require('axios').default;
const fs = require('fs');
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;

const key = fs.readFileSync('SPLIT_ADMIN_API_KEY', 'utf8');

const factory = SplitFactory({
  core: {
    authorizationKey: '28bddhnjht06lvi8e5aa9rkmv5glsc40ltaa',
  }
});

exports.handler = async (event) => {
    console.log(event);

    const client = factory.client();
    await client.ready();

    if(!event.queryStringParameters) {
        const response = {
            statusCode: 400,
            body: 'missing query parameters: workspaceName, environmentName, trafficKey',
        };
        return response;
    }

    if(!event.queryStringParameters.workspaceName) {
        const response = {
            statusCode: 400,
            body: 'missing parameter: workspaceName',
        };
        return response;
    }

    if(!event.queryStringParameters.environmentName) {
        const response = {
            statusCode: 400,
            body: 'missing parameter: environmentName',
        };
        return response;
    }

    if(!event.queryStringParameters.trafficKey) {
        const response = {
            statusCode: 400,
            body: 'missing parameter: trafficKey',
        };
        return response;
    }

    const workspaceName = event.queryStringParameters.workspaceName;
    const environmentName = event.queryStringParameters.environmentName;
    const trafficKey = event.queryStringParameters.trafficKey;

    console.log(workspaceName);
    console.log(environmentName);
    console.log(trafficKey);

    let config = {
      method: 'get',
      url: 'https://api.split.io/internal/api/v2/workspaces',
      headers: { 
        'Authorization': 'Bearer ' + key
      }
    };

    let workspaceId;
    await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
        for (const workspace of response.data.objects) {
            if(workspace.name === workspaceName) {
                workspaceId = workspace.id;
            }
        }
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log('workspaceId: ' + workspaceId);

    config = {
      method: 'get',
      url: 'https://api.split.io/internal/api/v2/environments/ws/' + workspaceId,
      headers: { 
        'Authorization': 'Bearer ' + key
      }
    };
    let environmentId;
    await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
        for (const environment of response.data) {
            if(environment.name === environmentName) {
                environmentId = environment.id;
            }
        }
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log('environmentId: ' + environmentId);

    const limit = 50;
    let offset = 0;

    const baseUrl = 'https://api.split.io/internal/api/v2/splits/ws/' + workspaceId + '/?limit=' + limit;
    config = {
        method: 'get',
        url: baseUrl,
        headers: {
            'Authorization': 'Bearer ' + key
        }
    };

    let totalCount = -1;
    let splitDetails = [];
    do {
        console.log(config.url);
        await axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data.objects));

            for(const split of response.data.objects) {
                sConfig = {
                    method: 'get',
                    url: 'https://api.split.io/internal/api/v2/splits/ws/'+ workspaceId + '/' + split.name + '/environments/' + environmentId,
                    headers: {
                        'Authorization': 'Bearer ' + key
                    }
                }

                console.log(sConfig.url);
                await axios(sConfig)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));

                    if(response.status != 404) {
                        const details = {
                            id: response.data.id,
                            name: response.data.name,
                            trafficType: response.data.trafficType.name,
                            killed: response.data.killed,
                            treatments: response.data.treatments,
                            trafficAllocation: response.data.trafficAllocation,
                            rules: response.data.rules,
                            defaultRule: response.data.defaultRule,
                            creationTime: response.data.creationTime,
                            changeNumber: response.data.changeNumber,
                            treatment: client.getTreatment(trafficKey, response.data.name)
                        }

                        splitDetails.push(details);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

                await sleep(250);
            }

            totalCount = response.data.totalCount;
            offset += limit;
            config.url = baseUrl + '&offset=' + offset;
        })
        .catch(function (error) {
            console.log(error);
        });
    } while (offset < totalCount);

    const response = {
        statusCode: 200,
        body: JSON.stringify(splitDetails),
    };
    return response;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
