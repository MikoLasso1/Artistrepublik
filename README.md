#### Master Branch Build Status
![Build Status](https://codebuild.us-east-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWXVSanpOc2p6U1oraE5BYnp1Zy9qS1g5b0lDV3I1QjBRMnhJSEcwa3UwVklrUnlQYkk5Q3NZMGRxRmtjbHpkZC9JNFNYOHBSekxoZCtvMXBQdFpPMTdZPSIsIml2UGFyYW1ldGVyU3BlYyI6InRLY3BEUGozQ0xoRWNlemciLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

#### Development Branch Build Status
![Build Status](https://codebuild.us-east-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWXVSanpOc2p6U1oraE5BYnp1Zy9qS1g5b0lDV3I1QjBRMnhJSEcwa3UwVklrUnlQYkk5Q3NZMGRxRmtjbHpkZC9JNFNYOHBSekxoZCtvMXBQdFpPMTdZPSIsIml2UGFyYW1ldGVyU3BlYyI6InRLY3BEUGozQ0xoRWNlemciLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=develop)

## Build Docker 

```bash 
yarn install
yarn run build 
docker build . -t baseui
docker run -p 80:80/tcp 6001:6001/tcp baseui 
```

### URLS
Development
```
https://dev.artistrepublik.com
```

Production
```
https://artistrepublik.com
```


ENV

```bash
NODE_ENV=(environment)
VUE_APP_ENV=(environment)
## Specific to the environment api.artistrepublik.com for prod
VUE_APP_BASE_URL=https://apidev.artistrepublik.com/api/
VUE_APP_BACKEND_APP=https://apidev.artistrepublik.com
VUE_APP_REVIEW_REPUBLIK_URL=https://apidev.reviewrepublik.com
VUE_APP_PUSHER_APP_KEY=(pusher key)
VUE_APP_PUSHER_APP_CLUSTER=ar-redis
VUE_APP_AWS_DEFAULT_REGION=us-east-1
(S3 bucket name for images like profile pictures)
VUE_APP_AWS_BUCKET=arepublik-static
VUE_APP_STRIPE_API_KEY=(strip api key)
VUE_APP_SENTRY_DSN=(sentry dsn from sentry.io)
VUE_APP_APP_URL=(frontend url ex: dev.artistrepublik.com)
VUE_APP_SPOTIFY_CLIENT_ID=(spotify client id)
VUE_APP_PAYPAL_CLIENT_ID=(paypal client id)
VUE_APP_MAPS_API_KEY=(google maps api key)
VUE_APP_INSTAGRAM_APP_ID=(instagram app id)
VUE_APP_ELASTIC_SEARCH_TOKEN=(eleastic search token)
VUE_APP_ELASTIC_SEARCH_URI=(elastic search uri)
VUE_APP_ONE_SIGNAL_APP_ID=(one signal app id)
VUE_APP_MINI_PROFILE_SHORTLINK=
```
