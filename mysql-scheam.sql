-- Users table:
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('super_admin','sub_admin','customer'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aluminum Items table:
CREATE TABLE aluminum_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sub_admin_id INT,
    shape VARCHAR(100),
    given_quantity INT,
    sold_quantity INT DEFAULT 0,
    price_per_item DECIMAL(10,2),
    image_url VARCHAR(255),  -- added column to store image filename or URL
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sub_admin_id) REFERENCES users(id)
);

-- Orders table:
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Order Items table:
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  aluminum_item_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (aluminum_item_id) REFERENCES aluminum_items(id)
);

-- Sales table:
CREATE TABLE `sales` (
  id int(11) NOT NULL,
  item_id int(11) DEFAULT NULL,
  quantity_sold int(11) NOT NULL,
  sale_date datetime DEFAULT current_timestamp(),
  sold_by int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Stock Requests table
CREATE TABLE stock_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    super_admin_id INT NOT NULL,
    sub_admin_id INT NOT NULL,
    status ENUM('pending', 'quotations_collected', 'price_selected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (super_admin_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stock Request Items table
CREATE TABLE stock_request_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    shape VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    chosen_price DECIMAL(12,2),
    description VARCHAR(255),
    FOREIGN KEY (request_id) REFERENCES stock_requests(id) ON DELETE CASCADE
);

-- Quotations table
CREATE TABLE quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_item_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    status ENUM('pending','approved') DEFAULT 'pending',
    FOREIGN KEY (request_item_id) REFERENCES stock_request_items(id) ON DELETE CASCADE
);

-- Project Stock table (stock available for engineers)
CREATE TABLE project_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_item_id INT NOT NULL,
    shape VARCHAR(100) NOT NULL,
    total_quantity INT NOT NULL,
    used_quantity INT DEFAULT 0,
    chosen_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (request_item_id) REFERENCES stock_request_items(id) ON DELETE CASCADE
);
