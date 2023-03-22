# TOGGLED

<<<<<<< HEAD
Create a dashboard table depicting all splits in an environment, one to each row.  Include deep detail about the treatments and default rule.  Evaluate and display the treatment returned for a particular traffic key.

# Pre-requisites

These instructions expect a reader that is adept with AWS Lambdas. You must also have the node.js package manager, 'npm', installed.  If you have never used npm or git, you can use nvm or brew to install it.

```
brew install npm
brew install git
```
... on any OSX terminal.

You will be cloning the node.js repository locally, installing its dependencies, and creating a ZIP archive for upload to AWS.  On AWS, you'll make a new lambda and upload your zip to define it.  Then you'll create a functional URL to reach it.  Replace the index.html functional url with your new one to  finish the installation.

## Installing

From the OSX command line (other platforms will be virtually the same), make a new directory and 

```bash
git clone <copy link to the repository from github>.git
cd toggled2
vi SPLIT_ADMIN_API_KEY // paste your Split Admin API key, with no extra characters or lines
npm install 
zip -r toggled2.zip .
```

In AWS, create a new lambda called toggled.  Using the code interface, upload the toggled2.zip you just created.

Your lambda is ready for action, but needs a function URL, and a change in configuration.

First, change the general configuration time limit to five minutes.  The lambda can take several minutes to run when there are hundreds of splits.

Second, create the functional GET URL.  Enable CORS and give the Allow Headers field a *
Copy the functional URL into the index.html (which you can open locally in your browser, or post seomwhere else).

Line 53 or therabouts...
```
url: 'https://64qqfffcsblvfoo.lambda-url.us-west-2.on.aws/',
```
Swap in your own URL.

If the lambda is installed properly, you can cut-and-paste the functional URL into your browser and get an error response.

Use the index.html in your browser to provide workspace, environment, and traffic key params.:w

=======
Create a dashboard table depicting all splits in an environment, one to each row.  Include deep detail about the treatments and default rule.  Evaluate and display the treatment returned for a particular traffic key.  Toggle the treatments to the default rule.  Delete a split.
>>>>>>> 6f6d265 (working toggles)

## Author

david.martin@split.io
