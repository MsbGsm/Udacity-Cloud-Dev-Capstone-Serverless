import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { createBook, deleteBook, getBooks, patchBook } from '../api/books-api'
import Auth from '../auth/Auth'
import { Book } from '../types/Book'

interface BooksProps {
  auth: Auth
  history: History
}

interface BooksState {
  books: Book[]
  newBookTitle: string
  newBookAuthor: string
  loadingBooks: boolean
}

export class Books extends React.PureComponent<BooksProps, BooksState> {
  state: BooksState = {
    books: [],
    newBookTitle: '',
    newBookAuthor: '',
    loadingBooks: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookTitle: event.target.value })
  }

  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookAuthor: event.target.value })
  }

  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/edit`)
  }

  onBookCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newBook = await createBook(this.props.auth.getIdToken(), {
        title: this.state.newBookTitle,
        author: this.state.newBookAuthor,
        dueDate
      })

      this.setState({
        books: [...this.state.books, newBook],
        newBookTitle: '',
        newBookAuthor: ''
      })
    } catch {
      alert('Book creation failed')
    }
  }

  onBookDelete = async (bookId: string) => {
    try {
      await deleteBook(this.props.auth.getIdToken(), bookId)
      this.setState({
        books: this.state.books.filter(book => book.bookId != bookId)
      })
    } catch {
      alert('Book deletion failed')
    }
  }

  onBookCheck = async (pos: number) => {
    try {
      const book = this.state.books[pos]
      await patchBook(this.props.auth.getIdToken(), book.bookId, {
        title: book.title,
        author: book.author,
        dueDate: book.dueDate,
        completed: !book.completed
      })
      this.setState({
        books: update(this.state.books, {
          [pos]: { completed: { $set: !book.completed } }
        })
      })
    } catch {
      alert('Book update failed')
    }
  }


  async componentDidMount() {
    try {
      const books = await getBooks(this.props.auth.getIdToken())
      this.setState({
        books,
        loadingBooks: false
      })
    } catch (e) {
      alert(`Failed to fetch books: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Books To Read</Header>

        {this.renderCreateBookInput()}

        {this.renderBooks()}
      </div>
    )
  }

  renderCreateBookInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            placeholder="Title..."
            onChange={this.handleTitleChange}
          /> {' '}
          <Input
            placeholder="Author..."
            onChange={this.handleAuthorChange}
          /> {' '}

          <Button
            content="Add Book"
            color='teal'
            icon='add'
            onClick={this.onBookCreate}
          />
        </Grid.Column>


        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBooks() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    }

    return this.renderBooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading BOOKs
        </Loader>
      </Grid.Row>
    )
  }

  renderBooksList() {
    return (
      <Grid padded>
        {this.state.books.map((book, pos) => {
          return (
            <Grid.Row key={book.bookId} style={{background: book.completed ? '#75eca7' :  'none'}}>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onBookCheck(pos)}
                  checked={book.completed}
                />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {book.title}
              </Grid.Column>
              <Grid.Column width={5} floated="right">
                {book.author}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {book.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(book.bookId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBookDelete(book.bookId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {book.attachmentUrl && (
                <Image src={book.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
