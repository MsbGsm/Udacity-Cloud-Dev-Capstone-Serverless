import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BookItem } from '../models/BookItem'
import { createLogger } from '../utils/logger'


const logger = createLogger('DynamoDB')

const XAWS = AWSXRay.captureAWS(AWS)

export class BookService {
  
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly booksTable = process.env.BOOKS_TABLE,
    private readonly booksIndex = process.env.BOOKS_INDEX
  ) {}


  // Get All Books for a user using user ID
  async getAllBooks(userId): Promise<BookItem[]> {

    logger.info(`QUERY: Getting all books items for user ${userId} from ${this.booksTable}`)
    const result = await this.docClient.query({
      TableName: this.booksTable,
      IndexName: this.booksIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return result.Items as BookItem[];
  }


  // Put a new Book Item to dynamoDB Table
  async createBook(bookItem: BookItem): Promise<BookItem> {

    logger.info(`PUT: creating new book item in ${this.booksTable}`)
    await this.docClient.put({
      TableName: this.booksTable,
      Item: bookItem
    }).promise()

    return bookItem as BookItem
  }


  // Deleting a book with a given id for the user ID
  async deleteBook(bookId, userId) {
    
    logger.info(`DELETE: Deleting book item ${bookId} for user ${userId} from table ${this.booksTable}`)
    await this.docClient.delete({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      }
    }).promise()
  }


  // Get a book using a given ID for a specific user ID
  async getBook(bookId, userId) {

    logger.info(`GET: Getting book item ${bookId} for user ${userId} from ${this.booksTable}`)
    const result = await this.docClient.get({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      }
    }).promise()

    return result.Item as BookItem
  }


  // Update a Book item
  async updateBook(bookId, userId, updatedBook) {
    
    logger.info(`UPDATE: updating title|author|dueDate|completed of book item ${bookId} for user ${userId} in ${this.booksTable}`)
    await this.docClient.update({
        TableName: this.booksTable,
        Key: {
            bookId,
            userId
        },
        UpdateExpression: 'set #title = :title, #author = :author, #dueDate = :dueDate, #completed = :completed',
        ExpressionAttributeValues: {
            ':title': updatedBook.title,
            ':author': updatedBook.author,
            ':dueDate': updatedBook.dueDate,
            ':completed': updatedBook.completed
        },
        ExpressionAttributeNames: {
            '#title': 'title',
            '#author': 'author',
            '#dueDate': 'dueDate',
            '#completed': 'completed'
        }
    }).promise()
  }


  // Update Book's attachment
  async updateAttachmentUrl(bookId, userId, attachmentUrl) {
    logger.info(`UPDATE: Updating attachmentURL of book item ${bookId} for user ${userId} in ${this.booksTable}`)
    await this.docClient.update({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }
  
}