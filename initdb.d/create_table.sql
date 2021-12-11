USE recipeDB;

CREATE TABLE users (
	uid INT NOT NULL AUTO_INCREMENT,
	id CHAR(70) NOT NULL,
    pw CHAR(70) NOT NULL,
	signupDate DATETIME NOT NULL,
    isQuit INT NOT NULL DEFAULT 0,
    PRIMARY KEY (uid)
);

CREATE TABLE ingredients (
	id INT AUTO_INCREMENT NOT NULL,
    kind CHAR(50) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE recipes (
	id INT NOT NULL AUTO_INCREMENT,
	name CHAR(100) NOT NULL,
    recipe MEDIUMTEXT NOT NULL,
    uploadDate DATETIME NOT NULL,
    modifyDate DATETIME,
    authorID INT NOT NULL,
	FOREIGN KEY (authorID) REFERENCES users (uid)
	ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE upvotes (
	userID INT NOT NULL,
    recipeID INT NOT NULL,
    upvoteDate DATETIME NOT NULL,
	FOREIGN KEY (userID) REFERENCES users (uid) ON DELETE CASCADE,
	FOREIGN KEY (recipeID) REFERENCES recipes (id) ON DELETE CASCADE,
    PRIMARY KEY (userID, recipeID)
);

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
    name CHAR(70) NOT NULL,
    amount INT NOT NULL,
    price INT NOT NULL,
    kind_id INT NOT NULL,
    seller_id INT NOT NULL,
	FOREIGN KEY (seller_id) REFERENCES users (uid) ON DELETE CASCADE,
	FOREIGN KEY (kind_id) REFERENCES ingredients (id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE orders (
	order_id INT NOT NULL AUTO_INCREMENT,
	buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    food_id INT NOT NULL,
    orderDate DATETIME NOT NULL,
    orderAmount INT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users (uid) ON DELETE CASCADE,
	FOREIGN KEY (seller_id) REFERENCES products (seller_id) ON DELETE CASCADE,
	FOREIGN KEY (food_id) REFERENCES products (id) ON DELETE CASCADE,
    PRIMARY KEY (order_id)
);

CREATE TABLE ingred_recipe (
	recipe_id INT NOT NULL,
    ingred_id INT NOT NULL,
	FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
	FOREIGN KEY (ingred_id) REFERENCES ingredients (id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, ingred_id)
);