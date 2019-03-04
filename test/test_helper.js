const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

before(done => {
  mongoose.connect("mongodb://localhost/iitbazaar_test");
  mongoose.connection
    .once("open", () => {
      done();
    })
    .on("error", error => {
      console.warn("Warning", error);
    });
});

beforeEach(done => {
  const { products, users } = mongoose.connection.collections;
  products.drop(() => {
    users.drop(() => {
      done();
    });
  });
});
