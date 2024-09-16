// const { executeQuery } = require("./db");
const { pool, executeQuery } = require("./db");

function validateProduct(
  name,
  description,
  price,
  stock,
  category,
  barcode,
  status
) {
  const validStatuses = ["available", "unavailable", "discontinued"];
  const errors = [];

  if (typeof name !== "string" || name.trim().length === 0) {
    errors.push("Nom du produit invalide. Il doit être une chaîne non vide.");
  }
  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push(
      "Description du produit invalide. Elle doit être une chaîne non vide."
    );
  }
  if (typeof price !== "number" || price <= 0) {
    errors.push(
      "Prix du produit invalide. Il doit être un nombre supérieur à 0."
    );
  }
  if (!Number.isInteger(stock) || stock < 0) {
    errors.push(
      "Stock du produit invalide. Il doit être un nombre entier supérieur ou égal à 0."
    );
  }
  if (typeof category !== "string" || category.trim().length === 0) {
    errors.push(
      "Catégorie du produit invalide. Elle doit être une chaîne non vide."
    );
  }
  if (typeof barcode !== "string" || barcode.trim().length === 0) {
    errors.push(
      "Code-barres du produit invalide. Il doit être une chaîne non vide."
    );
  }
  if (!validStatuses.includes(status)) {
    errors.push(
      "Statut du produit invalide. Les statuts acceptés sont : available, unavailable, discontinued."
    );
  }

  return errors;
}

async function addProduct(
  name,
  description,
  price,
  stock,
  category,
  barcode,
  status
) {
  try {
    const errors = validateProduct(
      name,
      description,
      price,
      stock,
      category,
      barcode,
      status
    );

    if (errors.length > 0) {
      errors.forEach((error) => console.log("Erreur :", error));
      return;
    }

    const result = await executeQuery(
      "INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, barcode, status]
    );
    console.log("Produit ajouté avec succès, ID :", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error.message);
  }
}

async function getProducts() {
  try {
    const rows = await executeQuery("SELECT * FROM products");
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits :",
      error.message
    );
  }
}

async function updateProduct(
  id,
  name,
  description,
  price,
  stock,
  category,
  barcode,
  status
) {
  try {
    const errors = validateProduct(
      name,
      description,
      price,
      stock,
      category,
      barcode,
      status
    );

    if (errors.length > 0) {
      errors.forEach((error) => console.log("Erreur :", error));
      return;
    }

    const result = await executeQuery(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?",
      [name, description, price, stock, category, barcode, status, id]
    );

    if (result.affectedRows > 0) {
      console.log("Produit mis à jour avec succès.");
    } else {
      console.log("Aucun produit trouvé avec cet ID.");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error.message);
  }
}

async function deleteProduct(id) {
  let connection;

  try {
    connection = await pool.getConnection();

    const [idExist] = await connection.execute(
      "SELECT COUNT(*) AS count FROM products WHERE id = ?",
      [id]
    );

    if (idExist[0].count > 0) {
      await connection.execute(
        "DELETE FROM order_details WHERE product_id = ?",
        [id]
      );

      await connection.execute("DELETE FROM products WHERE id = ?", [id]);

      console.log(`Produit avec l'ID ${id} supprimé avec succès.`);
    } else {
      console.log("Le produit avec cet ID n'existe pas.");
    }
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      console.log(
        "\nImpossible de supprimer le produit : des références existent dans d'autres tables."
      );
    } else {
      console.error(
        "Erreur lors de la suppression du produit :",
        error.message
      );
    }
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
