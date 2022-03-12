# osu-pattern-gallery-server

## Depencencies:
### MongoDB
Create free cluster using https://www.mongodb.com/cloud/atlas/register

### Imgur
used to save images to https://imgur.com/
free permenant storage
create cliend ID here https://api.imgur.com/#registerapp

### Osu
See OAuth section in https://osu.ppy.sh/home/account/edit

## Env Variables
add `.env` file with follow variables:
- OSU_API_KEY #used to access osu beatmap info
- SESSION_SECRET #used by server application to create sessions
- MONGO_URL
- MONGO_DATABASE
- IMGUR_CLIENT_ID

## Run project
`npm install`
`npm start`
`npm test`

