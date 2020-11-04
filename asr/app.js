const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 7000;
const http = require('http').Server(app);
const io = require('socket.io')(http);
// require('dotenv').config()

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set Language Code
let speechToTextLanguageCode
let speechToTextConfig = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US',
  profanityFilter: false,
  enableWordTimeOffsets: true,
  diarizationSpeakerCount: 2,
  enableAutomaticPunctuation: true,
  enableSpeakerDiarization: true,
  metadata: {
    interactionType: 'VOICE_COMMAND',
    microphoneDistance: 'NEARFIELD'
  }
}
app.post('/language', (req, res) => {
  let sentCode = req.body.code
  if (sentCode === 1) {
    speechToTextLanguageCode = 'en-US'
  } else if (sentCode === 2) {
    speechToTextLanguageCode = 'fr-FR'
  } else if (sentCode === 4) {
    speechToTextLanguageCode = 'it-IT'
  } else if (sentCode === 8) {
    speechToTextLanguageCode ='ja-JP'
  } else if (sentCode === 16) {
    speechToTextLanguageCode = 'zh'
  } else {
    speechToTextLanguageCode = 'en-US'
  }
  speechToTextConfig.languageCode = speechToTextLanguageCode
  res
    .send('Sucess')
    .end()
})

// Imports the Google client library
const speech = require('@google-cloud/speech').v1p1beta1;

// Request to Google Speech To Text
let request = {
  config: speechToTextConfig,
  single_utterance: true,
  interimResults: true
}

// Creates a client
let client = new speech.SpeechClient();

// Socket Communication
io.on('connection', function(socket) {
  console.log('Client Connected to server');
  let recognizeStream = null;

  socket.on('startStreamingRecognition', function(data) {
    // transform.write(data);
    startStreamingRecognition(socket);
  });
  socket.on('sendAudioData', function(data) {
    if (recognizeStream !== null) {
      recognizeStream.write(data);
    }
  });
  socket.on('stopStreamingRecognition', function() {
    stopStreamingRecognition();
  })

  const speechCallback = data => {
    // process.stdout.write(
    //   (data.results[0] && data.results[0].alternatives[0])
    //     ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
    //     : `\n\nReached transcription time limit, press Ctrl+C\n`);

    // process.stdout.write(data.results[0].isFinal ? 'true\n' : 'false\n')
    // if (speechToTextConfig.languageCode === 'ja-JP') {
    //   if (data.results[0].stability > 0.9) {
    //     console.log('stability is changed')
    //     data.results[0].isFinal = true
    //   }
    // }
    
    socket.emit('sendRecognitionResult', data);

    // If utterance is end, restart stream\
    if (data.results[0].isFinal === true) {
      stopStreamingRecognition();
      client = new speech.SpeechClient();
      startStreamingRecognition(socket);
    }

    // data.results[0].alternatives[0].words.forEach((a) => {
    //   process.stdout.write(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
    // });
  };
  socket.on('silentIsDetected', function(data) {
    socket.emit('stopRecognition');
  });

  function startStreamingRecognition(socket) {
    recognizeStream = client.streamingRecognize(request)
      .on('error', console.error)
      .on('data', speechCallback);
  }

  function stopStreamingRecognition() {
    if (recognizeStream !== null) {
      console.log('Stop recognition')
      recognizeStream.removeListener('data', speechCallback);
      recognizeStream.end()
    }
    recognizeStream = null;
  }
});

// Server starts up
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
