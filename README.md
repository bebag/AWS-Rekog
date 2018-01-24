# Face ReKognition WebApp project

1. Create an EC2 instance with node.js installed (http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)

   1. download and install nvm

      ```
      http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
      . ~/.nvm/nvm.sh
      nvm install 8.9.1
      (to check latest release ... https://github.com/nodejs/Release)
      (https://nodejs.org/download/release/latest-carbon/)

      To test it's running correctly, type on the console:
      node -e "console.log('Running Node.js ' + process.version)"
      ```

      ​

   2. nvm install node.js

   3. npm init

   4. npm install angularjs

   5. npm install webcamjs

   6. npm install nodemon

   7. git clone

   8. ​use the "start" script to launch the web server (nodejs)

   9. you might have to create the "images" directory in the static one (as I've removed the images from github)

   10. don't forget to open port 8888 …. web page available on https://<IP>:8888
