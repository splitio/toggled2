# TOGGLED

Create a dashboard table depicting all splits in an environment, one to each row.  Include deep detail about the treatments and default rule.  Evaluate and display the treatment returned for a particular traffic key.

# Pre-requisites

These instructions expect a reader that is adept with AWS Lambdas. You must also have the node.js package manager, 'npm', installed.  If you have never used npm or git, you can use nvm or brew to install it.

```
brew install npm
brew install git
```
... on any OSX terminal.

You will be cloning the node.js repository locally, installing its dependencies, and creating a ZIP archive for upload to AWS.  On AWS, you'll make a new lambda and upload your zip to define it.  Then you'll create a functional URL to reach it. Replace the index.html functional url with your new one to  finish the installation.

## Installing

From the OSX command line (other platforms will be virtually the same), make a new directory and 

```bash
git clone <copy link to the repository from github>.git
cd 
vi SPLIT_ADMIN_API_KEY
npm install 
zip -r split2mixpanel.zip .
```

In AWS, create a new lambda called split2mixpanel.  Using the code interface, upload the split2mixpanel.zip you just created.

Your lambda is ready for action, but needs an REST API gateway.  In AWS, build a new REST API.  Give it a POST method and link it to your lambda.  Check the box 'Use Lambda Proxy Integration'.

![alt text](http://www.cortazar-split.com/lambda_proxy.png)

Deploy the POST method and copy the URL, which will look something like this:

https://ygp1r7dssxx.execute-api.us-west-2.amazonaws.com/prod
 
## Base64 encode your MixPanel secret

Go to https://codebeautify.org/base64-encode

Put your Mixpanel secret into the Base64 Encode entry area and hit the button to Base64 encode.

Now create a url.  Start with the API gateway url from the next step, and add a query parameter with your encoded secret:

```
https://ygp1r7cna6.execute-api.us-west-2.amazonaws.com/prod?m=MjI0OTc5YThmY2MyM2MyNjI0OTAyNjgxYmY5YzIwNmU=
```

## Configure a Split Impressions webhook

From Split's Admin Settings and Integrations, find and create an Impressions webhook for the workspace and environments you want to integrate.

For the URL, use the URL you just created.

The test button should come back a success.  If not, consult the author.

## Author

david.martin@split.io
