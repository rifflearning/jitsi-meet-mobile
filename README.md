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
