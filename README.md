# top40ukgenerator

top40ukgenerator is a tool that get songs list from Official Singles Chart Top 40, search for the youtube video and then insert them into a youtube playlist.

## Installation

```bash
npm install
```

[Create credentials to YouTube Data API](https://developers.google.com/youtube/v3/quickstart/nodejs#step_1_turn_on_the) and put them in the file `credentials/client_secret.json`.


## Usage

```bash
node index.js --playlistId [playlistId]
```

`--playlistId` is the playlist to be updated, be carefull, this script will clean the playlist.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)


## TODO:

- If playlistId is not provided so we can create a new one
- Improve code organization
- Search for official video
- Being able to especify a date to search in Official Singles Chart Top 40