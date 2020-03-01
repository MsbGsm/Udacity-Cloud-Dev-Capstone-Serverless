import 'source-map-support/register'
import { updateBook } from '../../businessLogic/books'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Book Update')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId
  const updatedBook: UpdateBookRequest = JSON.parse(event.body)


  try {
    logger.info(`Updating Book item with ID: ${bookId}`)
    await updateBook(event, bookId, updatedBook)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }

  } catch (e) {
    logger.error(`Updating Book Item with ID: ${bookId} failed`, {error: e.message})
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(e.message)
    }
  }
}

