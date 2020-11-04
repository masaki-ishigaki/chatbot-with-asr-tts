import os
import re
import requests
import html
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from google.cloud import texttospeech
from google.cloud import speech_v1
from google.cloud.speech_v1 import enums

from chat_processing import ChatDataSet


# Create the instance Flask Class and set CORS
app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False

# Set the path of secret key of the Service Account as the enviroment variable
# It is NOT necessary when this module works in the same project for API
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = \
#     os.path.join(os.path.abspath('.') + '\exhibition-chatbot-dbdc417a90e3.json')

GCP_PROJECT = os.environ["GCP_PROJECT"]


@app.route('/dialogflow', methods=['POST'])
def dialogflow_wrapper():
    """
    Throw the query to Dialogflow API and return the reply
    from it to the web client.
    """
    req_body = request.get_json(silent=True, force=True)
    query = req_body["query"]
    print("query: " + query)

    # Initialize Chat Data
    chat = ChatDataSet()

    # Post the query to Dialogflow
    chat.detect_intent(GCP_PROJECT, query, 'ja')
    chat.print_chat_data()

    r = make_response(jsonify(
        {
            'answer': chat.response,
            'intent': chat.intent_name,
        }))

    return r


@app.route('/speech', methods=['POST'])
def text_to_speech_wrapper():
    """
    Text sent from frontend is converted to audio data
    """
    req_body = request.get_json(silent=True, force=True)
    text_for_tts = req_body["text"]

    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.types.SynthesisInput(text=text_for_tts)
    voice = texttospeech.types.VoiceSelectionParams(
        language_code="ja-JP",
        name="ja-JP-Wavenet-B",
        ssml_gender=texttospeech.enums.SsmlVoiceGender.FEMALE
    )
    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.LINEAR16,
        speaking_rate=1.1
    )

    result = client.synthesize_speech(input_text, voice, audio_config)
    response = make_response()
    response.data = result.audio_content
    response.headers['Content-Disposition'] = 'attachment; filename=result.wav'
    response.mimetype = 'audio/wav'

    return response


if __name__ == '__main__':
    app.run(debug=True)
