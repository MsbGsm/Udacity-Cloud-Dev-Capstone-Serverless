import * as uuid from 'uuid'

import { BookItem } from '../models/BookItem'
import { BookService } from '../dataLayer/booksService'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { BookStorageService } from '../dataLayer/bookStorageService'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import { SignedUrlRequest } from '../requests/signedUrlRequest'
import { createLogger } from '../utils/logger'


const logger = createLogger('Books Business Logic')


const bookService = new BookService()
const bookStorageService = new BookStorageService()


export const getAllBooks = async (event: APIGatewayProxyEvent): Promise<BookItem[]> => {
  const userId = getUserId(event)
  logger.info(`Getting books for user with ID: ${userId}`)
  return await bookService.getAllBooks(userId)
}


export const getBookById = async (event: APIGatewayProxyEvent) => {
  const bookId = event.pathParameters.bookId
  const userId = getUserId(event)

  logger.info(`Getting Book with ID ${bookId} for the user with ID: ${userId}`)
  return bookService.getBook(bookId, userId)
}



export const createBook = async (
  event: APIGatewayProxyEvent,
  createBookRequest: CreateBookRequest
) => {

  logger.info('Generating ID for new item')
  const bookId = uuid.v4()
  logger.info('Getting user ID for the new item')
  const userId = getUserId(event)

  const item: BookItem = {
    bookId,
    userId,
    createdAt: new Date().toISOString(),
    completed: false,
    ...createBookRequest
  }

  logger.info(`Creating new book item: ${item}`)

  await bookService.createBook(item)

  return item
}


export const updateBook = async (event: APIGatewayProxyEvent, bookId, updateBookRequest: UpdateBookRequest) => {

  const userId = getUserId(event)

  const bookExist = await bookService.getBook(bookId, userId)

  logger.info(`Updating book item with ID ${bookId} for user ${userId}`)
  if (!bookExist) {
    logger.error(`Book item does not exist`)
    throw new Error('Item does not exist!')
  }

  await bookService.updateBook(bookId, userId, updateBookRequest)
  logger.info(`Success: book item with id ${bookId} for user ${userId} updated`)
}


export const deleteBook = async (event:APIGatewayProxyEvent, bookId) => {
  const userId = getUserId(event)
  const bookExist = await bookService.getBook(bookId, userId)

  logger.info(`Deleting book itm with id ${bookId} for user ${userId}`)
  
  if (!bookExist) {
    logger.error('Book item does not exist')
    throw new Error('Item does not exsit!')
  }

  await bookService.deleteBook(bookId, userId)
  logger.info(`Success: book item with id ${bookId} for user ${userId} deleted`)
}


export const generateUploadUrl = async (event: APIGatewayProxyEvent, bookId) => {
  
  const userId = getUserId(event)
  const attachmentUrl = `https://${bookStorageService.getBookBucketName()}.s3.amazonaws.com/${bookId}`
  const Bucket = bookStorageService.getBookBucketName()
  const Expires = bookStorageService.getBookUrlExpiryTime()
  const Key = bookId


  logger.info(`Generating Upload URL and updating attachment URL for book ID ${bookId}`)
  await bookService.updateAttachmentUrl(bookId, userId, attachmentUrl)

  const signedUrlRequest: SignedUrlRequest = {
    Bucket,
    Key,
    Expires
  }

  return await bookStorageService.getUploadURL(signedUrlRequest)
}

