/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const datasources = require(`./models/data.${locale}.json`);
    const speechText = datasources.strings.properties.welcome;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'rootToken',
        version: '1.0',
        document: require('./models/apl.json'),
        datasources
      })
      .getResponse();
  },
};

const ShowMetricConversionsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ShowMetricConversionsIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'rootToken',
        commands: [
          {
            type: 'SetPage',
            componentId: 'rootPager',
            value: 1
          }
        ]
      })
      .getResponse();
  },
};

const ShowUSMeasurementsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ShowUSMeasurementsIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'rootToken',
        commands: [
          {
            type: 'SetPage',
            componentId: 'rootPager',
            value: 0
          }
        ]
      })
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me to show metric conversions or U.S. measurements.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('MeasurePro', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('MeasurePro', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I didn\'t understand that. Please say again.')
      .reprompt('Sorry, I didn\'t understand that. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ShowMetricConversionsIntentHandler,
    ShowUSMeasurementsIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();