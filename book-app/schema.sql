DROP TABLE IF EXISTS books;

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    image_url VARCHAR(255),
    ISBN VARCHAR(255),
    description VARCHAR(255),
    bookshelf VARCHAR(255)
);

INSERT INTO books (title, author, image_url, ISBN, description, bookshelf) VALUES ('1Q84', 'Murakami', 'http://books.google.com/books/content?id=kB65Rva1XM0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '9780307430014', 'Good book', 'Fantasy');