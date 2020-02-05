function Book(book){
    this.title = book.title || 'Title does not exist';
    this.author = book.authors || 'Author does not exist';
    this.ISBN = book.industryIdentifiers[0].identifier || 'ISBN does not exist';
    this.image_url = book.imageLinks.thumbnail || 'Image does not exist';
    this.description = book.description || 'Description does not exist';
    this.bookshelf = 'Enter a bookshelf name';
}

module.exports = Book;