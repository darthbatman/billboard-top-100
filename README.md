# billboard-top-100
Node.js API to retrieve top 100 songs from Billboard's The Hot 100

# install

```
npm install billboard-top-100
```

# example

```js
var billboard = require("billboard-top-100");

// date defaults to saturday of this week

billboard(function(songs){
	console.log(songs); //prints array of top 100 songs
	console.log(songs[3]); //prints song with rank: 4
	console.log(songs[0].title); //prints title of top song
	console.log(songs[0].artist); //prints artist of top songs
	console.log(songs[0].rank) //prints rank of top song (1)
	console.log(song[0].cover) //prints URL for Billboard cover image of top song
});

// date format YYYY-MM-DD

billboard('2016-08-27', function(songs){
	console.log(songs); //prints array of top 100 songs for week of August 27, 2016
	console.log(songs[3]); //prints song with rank: 4 for week of August 27, 2016
	console.log(songs[0].title); //prints title of top song for week of August 27, 2016
	console.log(songs[0].artist); //prints artist of top songs for week of August 27, 2016
	console.log(songs[0].rank) //prints rank of top song (1) for week of August 27, 2016
	console.log(song[0].cover) //prints URL for Billboard cover image of top song for week of August 27, 2016
});

```
# api

### songs

Type: `array`

Song objects.

### songObject.rank

Type: `number`

Rank of song on charts.

### songObject.title

Type: `string`

Title of song.

### songObject.artist

Type: `string`

Name of artist of song.

### songObject.cover

Type: `string`

Cover image URL of song.

### songObject.position

Type: `object`

Position information of song.


# license

MIT © [Rishi Masand](https://github.com/darthbatman)
