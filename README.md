# billboard-top-100
Node.js API to retrieve top songs, albums, and artists from Billboard's charts

[![https://nodei.co/npm/billboard-top-100.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/billboard-top-100.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/billboard-top-100)

[![Build Status](https://travis-ci.org/darthbatman/billboard-top-100.svg?branch=master)](https://travis-ci.org/darthbatman/billboard-top-100)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/darthbatman/billboard-top-100)


# install

```
npm install billboard-top-100
```

# example

```js
var billboard = require("billboard-top-100").getChart;

// date defaults to saturday of this week

billboard('hot-100', function(songs, err){
	if (err) console.log(err);
	console.log(songs); //prints array of top 100 songs
	console.log(songs[3]); //prints song with rank: 4
	console.log(songs[0].title); //prints title of top song
	console.log(songs[0].artist); //prints artist of top songs
	console.log(songs[0].rank) //prints rank of top song (1)
	console.log(song[0].cover) //prints URL for Billboard cover image of top song
});

// date format YYYY-MM-DD

billboard('hot-100', '2016-08-27', function(songs, err){
	if (err) console.log(err);
	console.log(songs); //prints array of top 100 songs for week of August 27, 2016
	console.log(songs[3]); //prints song with rank: 4 for week of August 27, 2016
	console.log(songs[0].title); //prints title of top song for week of August 27, 2016
	console.log(songs[0].artist); //prints artist of top songs for week of August 27, 2016
	console.log(songs[0].rank) //prints rank of top song (1) for week of August 27, 2016
	console.log(song[0].cover) //prints URL for Billboard cover image of top song for week of August 27, 2016
});

// 'all time' chart

billboard('greatest-billboard-200-albums', function(songs, err){
	if (err) console.log(err);
	console.log(songs); //prints array of top 200 albums
	console.log(songs[3]); //prints album with rank: 4
	console.log(songs[0].title); //prints title of top album
	console.log(songs[0].artist); //prints artist of top songs
	console.log(songs[0].rank) //prints rank of top album (1)
	console.log(song[0].cover) //prints URL for Billboard cover image of top album
});

// list all available charts

var listCharts = require('billboard-top-100').listCharts;

listCharts(function(data){
	console.log(data['Overall Popularity']); //prints larray of charts in 'Overall Popularity' category
});

```

# chart categories

Greatest of All Time: 'Greatest of All Time'

Overall Popularity: 'Overall Popularity'

Breaking and Entering: 'Breaking and Entering'

Pop: 'Pop'

Country: 'Country'

Rock: 'Rock'

R&B/Hip-Hop: 'R&B/Hip-Hop'

Dance/Electronic: 'Dance/Electronic'

Latin: 'Latin'

Christian/Gospel: 'Christian/Gospel'

Holiday: 'Holiday'

Additional Genres: 'Additional Genres'

International: 'International'

Web: 'Web'

# charts

## Greatest of All Time

Greatest of All Time Billboard 200 Albums: 'greatest-billboard-200-albums'

Greatest of All Time Billboard 200 Artists: 'greatest-billboard-200-artists'

Greatest of All Time Hot 100 Artists: 'greatest-hot-100-artists'

Greatest of All Time Hot 100 Singles: 'greatest-hot-100-singles'

Greatest of All Time Adult Pop Songs Artists: 'greatest-adult-pop-artists'

Greatest of All Time Adult Pop Songs: 'greatest-adult-pop-songs'

Greatest Of All Time Hot Latin Songs Artists: 'greatest-hot-latin-songs-artists'

Greatest Of All Time Hot Latin Songs: 'greatest-hot-latin-songs'

Greatest of All Time Top Country Artists: 'greatest-country-artists'

Greatest of All Time Top Country Songs: 'greatest-country-songs'

Greatest of All Time Top Country Albums: 'greatest-country-albums'

## Overall Popularity

Billboard 200: 'billboard-200'

Artist 100: 'artist-100'

Radio Songs: 'radio-songs'

Billboard Twitter Real-Time: 'billboard-twitter-realtime'

The Hot 100: 'hot-100'

Digital Song Sales: 'digital-song-sales'

Songs Of The Summer: 'summer-songs'

Billboard Twitter Top Tracks: 'twitter-top-tracks'

Billboard Twitter Emerging Artists: 'twitter-emerging-artists'

On-Demand Songs: 'on-demand-songs'

Streaming Songs: 'streaming-songs'

Top Album Sales: 'top-album-sales'

Vinyl Albums: 'vinyl-albums'

Digital Albums: 'digital-albums'

Independent Albums: 'independent-albums'

Catalog Albums: 'catalog-albums'

Social 50: 'social-50'

Tastemaker Albums: 'tastemaker-albums'

## Breaking and Entering

Heatseekers Albums: 'heatseekers-albums'

## Pop

Pop Songs: 'pop-songs'

Adult Pop Songs: 'adult-pop-songs'

Adult Contemporary: 'adult-contemporary'

## Country

Country Digital Song Sales: 'country-digital-song-sales'

Country Streaming Songs: 'country-streaming-songs'

Top Country Albums: 'country-albums'

Bluegrass Albums: 'bluegrass-albums'

Hot Country Songs: 'country-songs'

## Rock

Hot Rock Songs: 'rock-songs'

Country Airplay: 'country-airplay'

Rock Airplay: 'rock-airplay'

Rock Digital Song Sales: 'rock-digital-song-sales'

Rock Streaming Songs: 'rock-streaming-songs'

Top Rock Albums: 'rock-albums'

Alternative Songs: 'alternative-songs'

Alternative Albums: 'alternative-albums'

Adult Alternative Songs: 'triple-a'

Mainstream Rock Songs: 'hot-mainstream-rock-tracks'

Hard Rock Albums: 'hard-rock-albums'

Americana/Folk Albums: 'americana-folk-albums'

## R&B/Hip-Hop

Hot R&B/Hip-Hop Songs: 'r-b-hip-hop-songs'

R&B/Hip-Hop Airplay: 'hot-r-and-b-hip-hop-airplay'

R&B/Hip-Hop Digital Song Sales: 'r-and-b-hip-hop-digital-song-sales'

R&B/Hip-Hop Streaming Songs: 'r-and-b-hip-hop-streaming-songs'

Hot R&B Songs: 'r-and-b-songs'

R&B Streaming Songs: 'r-and-b-streaming-songs'

Hot Rap Songs: 'rap-song'

Rap Streaming Songs: 'rap-streaming-songs'

Top R&B/Hip-Hop Albums: 'r-b-hip-hop-albums'

R&B Albums: 'r-and-b-albums'

Rap Albums: 'rap-albums'

Adult R&B Songs: 'hot-adult-r-and-b-airplay'

Hot Dance/Electronic Songs: 'dance-electronic-songs'

Rhythmic Songs: 'rhythmic-40'

## Dance/Electronic

Dance/Electronic Digital Song Sales: 'dance-electronic-digital-song-sales'

Dance/Electronic Streaming Songs: 'dance-electronic-streaming-songs'

Dance Club Songs: 'dance-club-play-songs'

Dance/Mix Show Airplay: 'hot-dance-airplay'

Top Dance/Electronic Albums: 'dance-electronic-albums'

## Latin

Hot Latin Songs: 'latin-songs'

Latin Digital Song Sales: 'latin-digital-song-sales'

Latin Airplay: 'latin-airplay'

Latin Streaming Songs: 'latin-streaming-songs'

Tropical Songs: 'tropical-songs'

Latin Pop Songs: 'latin-pop-songs'

Regional Mexican Songs: 'regional-mexican-songs'

Regional Mexican Albums: 'regional-mexican-albums'

Latin Pop Albums: 'latin-pop-albums'

Top Latin Albums: 'latin-albums'

## Christian/Gospel

Hot Christian Songs: 'christian-songs'

Christian Airplay: 'christian-airplay'

Christian Digital Song Sales: 'christian-digital-song-sales'

Tropical Albums: 'tropical-albums'

Christian Streaming Songs: 'christian-streaming-songs'

Top Christian Albums: 'christian-albums'

Hot Gospel Songs: 'gospel-songs'

Gospel Digital Song Sales: 'gospel-digital-song-sales'

Gospel Streaming Songs: 'gospel-streaming-songs'

Top Gospel Albums: 'gospel-albums'

Gospel Airplay: 'gospel-airplay'

## Holiday

Holiday 100: 'hot-holiday-songs'

Holiday Digital Song Sales: 'holiday-season-digital-song-sales'

Holiday Albums: 'holiday-albums'

Holiday Streaming Songs: 'holiday-streaming-songs'

Holiday Airplay: 'holiday-songs'

## Additional Genres

Blues Albums: 'blues-albums'

Classical Albums: 'classical-albums'

Comedy Albums: 'comedy-albums'

Kid Albums: 'kids-albums'

Jazz Albums: 'jazz-albums'

Smooth Jazz Songs: 'jazz-songs'

New Age Albums: 'new-age-albums'

Reggae Albums: 'reggae-albums'

Soundtracks: 'soundtracks'

World Albums: 'world-albums'

## International

Japan Hot 100: 'japan-hot-100'

China V Chart: 'china-v-chart'

The Official U.K. Singles Chart: 'united-kingdom-songs'

The Official U.K. Albums Chart: 'united-kingdom-albums'

Billboard Canadian Hot 100: 'canadian-hot-100'

Canadian Digital Song Sales: 'hot-canada-digital-song-sales'

Billboard Canadian Albums: 'canadian-albums'

Germany Songs: 'germany-songs'

Germany Albums: 'german-albums'

France Songs: 'france-songs'

## Web

Spotify Velocity: 'spotify-velocity'

Spotify Rewind: 'spotify-rewind'

Spotify Viral 50: 'spotify-viral-50'

YouTube: 'youtube'

LyricFind Global: 'lyricfind-global'

LyricFind U.S.: 'lyricfind-us'

Next Big Sound: 'next-big-sound-25'

# api

### listCharts(callback)

Type: `function`

Returns object containing arrays of charts separated by category

### getChart(chart[, date], callback)

Type: `function`

```chart``` string

```date``` string ('all time' charts will not accept a date)

```callback``` function

Returns array of songs/albums/artists in chart. 

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

```Last Week``` string (position of song on chart last week)

```Peak Position``` string (peak position of song on chart)

```Wks on Chart``` string (number of weeks song has been on chart)

Position information of song.


# license

MIT © [Rishi Masand](https://github.com/darthbatman)
