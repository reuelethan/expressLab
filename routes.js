const express = require("express");

const cartRoutes = express.Router();
const pool = require("./pg-connection-pool");

cartRoutes.get("/", (req, res) => {
  res.send("itlives");
});
const cartItems = [{
    id: 0,
    product: "Shirt",
    price: 34,
    quantity: 3
  },
  {
    id: 1,
    product: "Pants",
    price: 12,
    quantity: 1
  },
  {
    id: 2,
    product: "Jacket",
    price: 5,
    quantity: 1
  }
];
let nextId = 3;

cartRoutes.get("/cartItems", (req, res) => {
  res.json(cartItems);
});

cartRoutes.get("/cart-items", (req, res) => {
  // If the request has a ?name= parameter, only respond w/ matching items
  if (req.query.name) {
    const sql = "SELECT * FROM api_item WHERE name LIKE $1::TEXT";
    const params = ["%" + req.query.name + "%"];
    pool.query(sql, params).then(result => {
      // .json sends response as JSON
      res.json(result.rows);
    });
  } else {
    // else respond with ALL items.
    const sql = "SELECT * FROM api_item";
    pool.query(sql).then(result => {
      // .json sends response as JSON
      res.json(result.rows);
    });
  }
});
cartRoutes.get("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const sql = "SELECT * FROM api_item WHERE id = $1::int";
  const params = [id];
  pool.query(sql, params).then(result => {
    if (result.rows.length === 0) {
      // Set response code to 404
      res.status(404);
      res.json({
        error: `ID ${id} Not Found`
      });
    } else {
      res.json(result.rows[0]);
    }
  });
});

cartRoutes.post("/cart-items", (req, res) => {
  const item = req.body;

  const sql = `INSERT INTO shopping_cart (product, price, quantity)
               VALUES ($1::TEXT, $2::INT, $3::INT) RETURNING *`
  const params = [item.product, item.price, item.quantity];
  pool.query(sql, params).then(result => {
    // Set response code to 201
    res.status(201);
    res.json(result.rows[0]);
  });
});
cartRoutes.put("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = req.body;

  const sql = `UPDATE shopping_cart
               SET product=$1::TEXT, price=$2::INT, quantity=$3::INT
               WHERE id = $4::INT RETURNING *`;
  const params = [item.price, item.price, item.quantity, id];
  pool.query(sql, params).then(result => {
    res.json(result.rows[0]);
  });
});

cartRoutes.delete("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const sql = `DELETE FROM shopping_cart
               WHERE id = $1::INT`
  const params = [id];
  pool.query(sql, params).then(result => {
    // Set response code to 204. Send no content.
    res.sendStatus(204);
  });
});

module.exports = cartRoutes;