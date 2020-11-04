import re
import json
import dialogflow_v2 as dialogflow
import google.protobuf  as pf


class ChatDataSet(object):
    def __init__(self):
        self.query = ''
        self.action = ''
        self.response = ''
        self.context_name = ''
        self.context_lifespancount = 0
        self.intent_name = ''
        self.intent_confidence = 0.0

    def detect_intent(self, project_id, query, language_code):
        """
        Call Dialogflow API and get the reponse to the query,
        and then set the response values into the attributes of this class
        """
        session_client = dialogflow.SessionsClient()

        session = session_client.session_path(project_id, "hoge")

        # Detect intent
        text_input = dialogflow.types.TextInput(
            text=query, language_code=language_code)
        query_input = dialogflow.types.QueryInput(text=text_input)
        response = session_client.detect_intent(
            session=session, query_input=query_input)
        fulfillment = response.query_result.fulfillment_text

        # Set the values from Dialogflow to the attributes
        self.query = query
        self.action = response.query_result.action
        self.response = fulfillment
        self.intent_name = response.query_result.intent.display_name
        self.intent_confidence = \
            response.query_result.intent_detection_confidence

    def print_chat_data(self):
        """
        Output the data ChatDataSet class has for logging.
        """

        print('query: ' + self.query)
        print('action: ' + self.action)
        print('response: ' + self.response)
        print('context: ' + self.context_name)
        print('context_lifespancount: ' + str(self.context_lifespancount))
        print('intent_name: ' + self.intent_name)
        print('intent_confidence: ' + str(self.intent_confidence))
