const { nanoid } = require("nanoid");
const fs = require("fs");
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

  if (name === "" || name === null) {
    const response = h.response({
      status: "fail",
      message: "Name is required",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((n) => n.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // If name not empty and name is'nt null
  // will return all books
  if (name !== undefined) {
    const thisBook = books
      .filter((n) => n.name.toLowerCase().includes(name.toLowerCase()))
      .map((n) => ({
        id: n.id,
        name: n.name,
        publisher: n.publisher,
      }));

    const response = h.response({
      status: "success",
      data: {
        books: thisBook,
      },
    });
    response.code(200);
    return response;
  }

  // If reading is value true
  if (reading === "1") {
    const thisBook = books
      .filter(({ reading }) => reading)
      .map((data) => ({
        id: data.id,
        name: data.name,
        publisher: data.publisher,
      }));

    const response = h.response({
      status: "success",
      data: {
        books: thisBook,
      },
    });
    response.code(200);
    return response;
  }

  // If reading is value false
  if (reading === "0") {
    const thisBook = books
      .filter(({ reading }) => reading)
      .map((data) => ({
        id: data.id,
        name: data.name,
        publisher: data.publisher,
      }));

    const response = h.response({
      status: "success",
      data: {
        books: thisBook,
      },
    });
    response.code(200);
    return response;
  }

  // If finished is value true
  if (finished === "1") {
    const thisBook = books
      .filter(({ finished }) => finished)
      .map((data) => ({
        id: data.id,
        name: data.name,
        publisher: data.publisher,
      }));

    const response = h.response({
      status: "success",
      data: {
        books: thisBook,
      },
    });
    response.code(200);
    return response;
  }

  // If Finished is value false
  if (finished === "0") {
    const thisBook = books
      .filter(({ finished }) => finished)
      .map((data) => ({
        id: data.id,
        name: data.name,
        publisher: data.publisher,
      }));

    const response = h.response({
      status: "success",
      data: {
        books: thisBook,
      },
    });
    response.code(200);
    return response;
  }

  const thisBook = books.map((n) => ({
    id: n.id,
    name: n.name,
    publisher: n.publisher,
  }));

  const response = h.response({
    status: "success",
    data: {
      books: thisBook,
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
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
    finished,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((n) => n.id === bookId);

  if (name == undefined || name == "") {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku, Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku, readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name: name,
      year: year,
      author: author,
      summary: summary,
      publisher: publisher,
      pageCount: pageCount,
      readPage: readPage,
      finished: finished,
      reading: reading,
      updatedAt: updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal diperbarui",
  });
  response.code(500);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((n) => n.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus, Id tidak ditemukan",
  });
  response.code(500);
  return response;
};

const uploadImageHandler = (request, h) => {
  const payload = request.payload;
  const { image: { hapi: { filename }, }, } = payload;

  if (filename === "") {
    const response = h.response({
      status: "fail",
      message: "Gagal mengunggah gambar, Mohon isi gambar",
    });
    response.code(400);
    return response;
  }

  const path = `${__dirname}/assets/img/${filename}`;
  const img = fs.createWriteStream(path);
  const image = payload.image.pipe(img)["path"];

  const response = h.response({
    status: "success",
    message: "Image berhasil diupload",
    image,
  });
  response.code(201);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  uploadImageHandler,
};
