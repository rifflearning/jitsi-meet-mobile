# Jitsi Meet

## Development:
Running with webpack-dev-server for development:
```
clone https://github.com/rifflearning/jitsi-meet.git
git checkout develop
npm install
make dev
```
Also see official guide here [here](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-web).

## Customization and deployment to AWS
In order to customize **jitsi-meet** with riff theme, all features and set up a new enviroment please follow next steps:

1. Install Jitsi-Meet to aws with [official guide](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart).

2. Deploy *develop* branch to the instance:
    ```
    git clone https://github.com/rifflearning/jitsi-meet.git
    git checkout develop
    npm install
    ```
    Add enviroment variables `.env` file (*ask colleagues for the config file*) with appropriate variables for deployment:
    ```
    ### Firebase for riff login
    API_KEY=example_value
    AUTH_DOMAIN=example_value
    DATABASE_URL=example_value
    PROJECT_ID=example_value
    STORAGE_BUCKET=example_value
    MESSAGING_SENDER_ID=example_value

    ### AWS deployment
    # Path to key.pem for aws deployment:
    PEM_PATH=~/example/path/to/key.pem

    # Aws instance name for deployment:
    AWS_NAME=example_aws_name@0.0.0.0

    # Riff-server url for sibilant:
    RIFF_SERVER_URL=https://example-riff-server.com
    ```
    Build and deploy with:
    ```
    make deploy-aws
    ```

## Add emotional intelligence detection (optional)
Open **http port 4455** on aws for connecting facial recognition server to nodejs-emotions server over the `http`.

### Install nodejs-emotions server
- download [nodejs-emotions.zip socket.io server](https://github.com/rifflearning/nodejs-emotions/archive/main.zip)

- copy from local machine to aws instance:
    ```
    scp -i ~/path_to/key.pem ~/path_to/nodejs-emotions.zip example-aws-name@0.0.0.0:/home/ubuntu
    ```
- connect to aws instance via `ssh` using `key.pem` and run nodejs-emotions:
    ```
    ssh -i ~/example_path_to/key.pem example_aws_name@0.0.0.0

    # install nodejs and unzip:
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get install unzip

    # unzip:
    unzip nodejs-emotions.zip
    rm nodejs-emotions.zip

    # run nodejs-emotions in background:
    cd nodejs-emotions
    npm i
    node index.js &
    ```
    You can check if app is running:
    ```
    sudo netstat -nlp | grep :4455
    ```
### Add nginx config to redirect socket.io to nodejs-emotions server
- find this part in the nginx config `/etc/nginx/sites-available/[domain].conf` on aws:
    ```
    #ensure all static content can always be found first
    location ~ ^/(libs|css|static|images|fonts|lang|sounds|connection_optimization|.well-known)/(.*)$
    {
        add_header 'Access-Control-Allow-Origin' '*';
        alias /usr/share/jitsi-meet/$1/$2;

        # cache all versioned files
        if ($arg_v) {
          expires 1y;
        }
    }
    ```
    After that paste config for nodejs-emotions:

    ```
    # config for socket.io for nodejs-emotions server
    location ^~ /emotions-server/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy false;

        proxy_pass http://localhost:4455/emotions-server/;
        proxy_redirect off;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    ```
    and restart nginx:
    ```
    sudo systemctl restart nginx
    ```
### Add EMOTIONS_SERVER_URL url to the `.env` file
```
### Firebase for riff login
API_KEY=example_value
AUTH_DOMAIN=example_value
DATABASE_URL=example_value
PROJECT_ID=example_value
STORAGE_BUCKET=example_value
MESSAGING_SENDER_ID=example_value

### AWS deployment
# Path to key.pem for aws deployment:
PEM_PATH=~/example/path/to/key.pem

# Aws instance name for deployment:
AWS_NAME=example_aws_name@0.0.0.0

# Riff-server url for sibilant:
RIFF_SERVER_URL=https://example-riff-server.com

# Emotions-server url for emotion-intelligence:
EMOTIONS_SERVER_URL=/
```
> **Warning:** *Don't forget to remove `EMOTIONS_SERVER_URL` in `.env` file when deploying to other aws instance without running nodejs-emotions server.*

Now we have running nodejs-emotions server and nginx config, and .env file confugured so you can deploy the app:
```
make deploy-aws
```
