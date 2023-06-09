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
  if (!(ver.roles.includes('chatVTFK.chatCompletion'))) return {status: 401, body: `You are not authorized to view this resource, you do not have the correct role(s)`}

  const openai = new OpenAIApi(configuration);

  const priorMessages = req.body.priorMessages
  const currentMessage = req.body.message

  const initialMessage = {
    role: 'system',
    content: 'Skriv en kort introduksjon og kort om hva du kan brukes til. Du skal alltid svare med markdown, men skal ikke nevne dette i introduksjonen.'
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
        if (completion.data.choices[0].message) {
          return await azfHandleResponse(completion.data.choices[0].message, context, req, 200)
        }
      }
  } catch(error) {
      return error
  }
}
