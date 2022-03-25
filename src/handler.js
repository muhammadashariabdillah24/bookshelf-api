const { nanoid } = require("nanoid");
const books = require("./bookshelf");

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === "" || name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books.push(newBook);

  const isSuccess = books.filter((n) => n.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // If name not empty and name is'nt null
  // will return all books
  if (name !== undefined) {
    return h.response({
      status: 'success',
      data: {
        books: books
        .filter(n => n.name.toLowerCase().includes(name.toLowerCase()))
        .map(n => ({
          id: n.id,
          name: n.name,
          publisher: n.publisher,
        })),
      },
    }).code(200);
  }

  // If reading is value true
  if (reading === "1") {
    return h.response({
      status: 'success',
      data: {
        books: books
        .filter(({ reading }) => reading)
        .map(data => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        }))
  ,
      },
    }).code(200);
  }

  // If reading is value false
  if (reading === "0") {
    return h.response({
      status: 'success',
      data: {
        books: books
        .filter(({ reading }) => reading)
        .map(data => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    }).code(200);
  }

  // If finished is value true
  if (finished === "1") {
    return h.response({
      status: 'success',
      data: {
        books: books
        .filter(({ finished }) => finished)
        .map(data => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    }).code(200);
  }

  // If Finished is value false
  if (finished === "0") {
    return h.response({
      status: 'success',
      data: {
        books: books
        .filter(({ finished }) => finished)
        .map(data => ({
          id: data.id,
          name: data.name,
          publisher: data.publisher,
        })),
      },
    }).code(200);
  }

  return h.response({
    status: 'success',
    data: {
      books: books.map(n => ({
        id: n.id,
        name: n.name,
        publisher: n.publisher,
      })),
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((n) => n.id === bookId);

  if (name == undefined || name == "") {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((n) => n.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  };

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};



module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
