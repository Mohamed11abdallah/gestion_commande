CREATE DATABASE gestion_commande;
use gestion_commande;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  address VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(300),
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL
);

CREATE TABLE purchase_orders (
  id INTEGER PRIMARY KEY,
  date DATE NOT NULL,
  customer_id INTEGER NOT NULL,
  delivery_address VARCHAR(100),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_details (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES purchase_orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

ALTER TABLE purchase_orders DROP FOREIGN KEY purchase_orders_ibfk_1;
ALTER TABLE order_details DROP FOREIGN KEY order_details_ibfk_1;
ALTER TABLE order_details DROP FOREIGN KEY order_details_ibfk_2;

ALTER TABLE customers
  MODIFY COLUMN id INTEGER AUTO_INCREMENT,
  MODIFY COLUMN name VARCHAR(255) NOT NULL,
  MODIFY COLUMN address TEXT,
  MODIFY COLUMN email VARCHAR(255) UNIQUE NOT NULL,
  MODIFY COLUMN phone VARCHAR(20) UNIQUE NOT NULL;

ALTER TABLE products
  MODIFY COLUMN id INTEGER AUTO_INCREMENT,
  MODIFY COLUMN name VARCHAR(255) NOT NULL,
  MODIFY COLUMN description TEXT NOT NULL,
  ADD COLUMN category VARCHAR(100) NULL,
  ADD COLUMN barcode VARCHAR(50) UNIQUE NOT NULL,
  ADD COLUMN status VARCHAR(50) NULL;

ALTER TABLE purchase_orders
  MODIFY COLUMN id INTEGER AUTO_INCREMENT,
  MODIFY COLUMN delivery_address TEXT NOT NULL,
  ADD COLUMN track_number VARCHAR(100) NULL,
  ADD COLUMN status VARCHAR(50) DEFAULT 'pending';

ALTER TABLE order_details
  MODIFY COLUMN id INTEGER AUTO_INCREMENT,
  MODIFY COLUMN quantity INTEGER NOT NULL,
  MODIFY COLUMN price DECIMAL(10, 2) NOT NULL;

CREATE TABLE payments (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  order_id INTEGER NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES purchase_orders(id)
);

ALTER TABLE order_details
  ADD CONSTRAINT order_details_ibfk_1
  FOREIGN KEY (order_id) REFERENCES purchase_orders(id),
  ADD CONSTRAINT order_details_ibfk_2
  FOREIGN KEY (product_id) REFERENCES products(id);
