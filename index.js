#!/usr/bin/env node
process.on('unhandledRejection', err => {
  throw err;
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('SIGTERM', () => {
  process.exit();
});

require('dotenv');

const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const ixfeed = require('index-feed');
const level = require('level');
const through = require('through2');
const Twit = require('twit');

const ddb = level(path.join(__dirname, 'data.db'));
const idb = level(path.join(__dirname, 'index.db'));
const ixf = ixfeed({data: ddb, index: idb, valueEncoding: 'json'});

// const twitConfig = {
//   // The secret keys live in the `.env` file. See `.env.sample` to start from scratch.
//   twitter: {
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token: process.env.ACCESS_TOKEN,
//     access_token_secret: process.env.ACCESS_TOKEN_SECRET
//   }
// };
// const T = new Twit(twitConfig.twitter);
// const twitterStream = T.stream('statuses/filter', {track: '@madewithaframe'});

// const isReply = tweet => {
//   const sender = tweet.user.screen_name;
//   if (sender !== 'aframevr' && sender !== 'madewithaframe') {
//     return false;
//   }
//   return /^@(aframevr|madewithaframe)/i.test(tweet.text);
// };

const tweets = [];

// const storeTweet = tweet => {
//   tweets.push(tweet);
//   // ixf.index.add(function (row, cb) {
//   //   // if (/^hacker!/.test(row.key)) { } else { cb(); }
//   //   cb(null, {
//   //     'tweet.name': row.value.name,
//   //     'tweet.space': row.value.hackerspace
//   //   });
//   // });
// };

// twitterStream.on('tweet', function (tweet) {
//   if (!isReply(tweet)) {
//     return;
//   }
//   const tweetText = (tweet.text || '').toLowerCase();
//   if (tweetText.indexOf('#aframevr') > -1 ||
//       tweetText.indexOf('#webvr') > -1 ||
//       tweetText.indexOf('#madewithaframe') > -1 ||
//       tweetText.indexOf('#madewithaframevr') > -1) {
//     saveTweet({
//       type: 'tweet',
//       tweet: tweet
//     });
//   }
// });

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());

app.post('/tweets', (req, res) => {
  tweets.push(req.body);
  res.send(tweets);
});

app.get('/tweets', (req, res) => {
  res.send(tweets);
});

const listener = app.listen(process.env.PORT || 7000, () => {
  console.log('Listening on port %s', listener.address().port);
});
