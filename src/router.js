const {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  uploadImageHandler,
} = require("./handler");

const router = [
  {
    method: "POST",
    path: "/books",
    handler: addBooksHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: editBookByIdHandler,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookByIdHandler,
  },
  {
    method: "POST",
    path: "/uploads",
    config: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 3 * 1024 * 1024,
      },
    },
    handler: uploadImageHandler,
  },
];

module.exports = router;
