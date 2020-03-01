import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/books'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Generate Upload Url')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId

  logger.info('Requesting Signed Uplaod Url')
  const signedUrl = await generateUploadUrl(event, bookId)
  logger.info(`Signed Upload Url Recieved: ${signedUrl}`)
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}


