Guild Wars 2 Server Comparator
==========================

An information hub about Guild Wars 2 servers, providing information about particular servers and how they compare to one another.

***App information***

  When you pull in the app for the first time, you will notice some additional structure that may not be obvious at first glance.
Here is a run down of the folder structure and what everything is doing....

app/ - The app itself! This is simply where the application lives.

Build/ - When deploying, git clones the latest and greatest from the master branch of the repository, it then copies
         the app directory out and places it into the parse folder for deployment. This is a good way to see what exactly
         was handed to parse for deployment. Refer to this if a deployment seems to have gone backwards.
         
node_modules/ - This is simply where all of the installed node modules are contained, many to all of these should be modules
               grunt is using in the build process. (grunt-config-copy, grunt-git, etc....)

parse/ - This is the directory containing all of the relevent code that is deployed to the parse cloud, in this case
        grunt will copy the app to the public directory contained here and run 'parse deploy' to send up to the cloud.

.git, .gitattributes, .gitignore - Git stuff for version control, shouldn't have to be concerned with any of this.

Gruntfile.js - Configuration of tasks used by grunt, here you will find configurations for things such as the tasks run
               for building, deployment, file clean up and transfer, etc....

package.json - This file holds project metadata, this being things like version number, app name, installed grunt plugins, etc...

***Grunt Tasks***

  Here is a list outlining the grunt tasks available currently to the project. Note that all tasks will need to be be prefixed
  with 'grunt', such as 'grunt deploy-test', to see the cofiguration and setup for these tasks and the order they are run, you can refer to
  the Gruntfile.js.
  
  grunt - Running grunt by itself will run whatever tasks are set for 'default' (currently none).
  
  grunt deploy-test - Will clean the existing Build/ directory and copy a fresh clone of the master branch to Build/, will
  then copy out the app/ directory, move it to the parse/public directory and deploy to the testing environment.
  
  grunt start-dev - Will spin up a server to view and prototype the app locally.
  
***If any changes need to be made to the build, please let me know, the build impacts everyone and it is important that it is kept
fairly uniform in order to enforce project convention and standardization.***
