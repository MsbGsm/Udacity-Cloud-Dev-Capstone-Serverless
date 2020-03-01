import 'source-map-support/register'
import { createBook } from '../../businessLogic/books'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { createLogger } from '../../utils/logger'


const logger = createLogger('Create Book')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBook: CreateBookRequest = JSON.parse(event.body)


  if (!newBook.title || !newBook.author) {
    logger.error('Incomplete Book Fields')
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Book Title or Auther are empty'
      })
    }
  }

  logger.info('Creating New Book Item')
  const updatedBook = await createBook(event, newBook)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ 
      item: {...updatedBook} 
    })
  }

}


