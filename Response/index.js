const { basic } = require('../sharedCode/utils/queryChatGPT')
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers');
const { Configuration, OpenAIApi } = require("openai");
const { verifyToken } = require('../sharedCode/utils/verifyToken')
const config = require('../config');

const configuration = new Configuration({
    apiKey: config.openAI.apikey,
})

module.exports = async function (context, req) {
  const ver = verifyToken(req.headers.authorization)
  if (!ver.verified) return { status: 401, body: `You are not authorized to view this resource, ${ver.msg}` }

  const openai = new OpenAIApi(configuration);

  const priorMessages = req.body.priorMessages
  const currentMessage = req.body.message
  const isInitializing = req.body.message

  console.log(currentMessage)
  console.log(priorMessages)

  const initialMessage = {
    role: 'system',
    content: 'Skriv en kort introduksjon og kort om hva du kan brukes til. Du heter ChatVTFK'
  }

  try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[
          initialMessage,
          ...priorMessages, 
          { 
              role: 'user',
              content: currentMessage
          }
        ]
      })
      
      if (completion.data) {
        console.log(completion.data.choices[0].message)
        if (completion.data.choices[0].message) {
          return await azfHandleResponse(completion.data.choices[0].message, context, req, 200)
        }
      }
  } catch(error) {
      return error
  }
}
