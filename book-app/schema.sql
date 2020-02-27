DROP TABLE IF EXISTS books, people;

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    image_url VARCHAR(255),
    ISBN VARCHAR(255),
    description VARCHAR(255),
    bookshelf VARCHAR(255)
);

CREATE TABLE people(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    book_id INT,
    full_name JSON
);

INSERT INTO books (title, author, image_url, ISBN, description, bookshelf) VALUES ('1Q84', 'Murakami', 'http://books.google.com/books/content?id=kB65Rva1XM0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', '9780307430014', 'Good book', 'Fantasy');
INSERT INTO people (name, book_id, full_name) VALUES ('Jim', 1, '{"first":"tim", "last":"ferris"}');