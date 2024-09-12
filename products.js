const { executeQuery } = require("./db");

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

  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof description === "string" &&
    description.trim().length > 0 &&
    typeof price === "number" &&
    price > 0 &&
    Number.isInteger(stock) &&
    stock >= 0 &&
    typeof category === "string" &&
    category.trim().length > 0 &&
    typeof barcode === "string" &&
    barcode.trim().length > 0 &&
    validStatuses.includes(status)
  );
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
    if (
      !validateProduct(
        name,
        description,
        price,
        stock,
        category,
        barcode,
        status
      )
    ) {
      console.log("Erreur : Les données du produit sont invalides.");
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
    if (
      !validateProduct(
        name,
        description,
        price,
        stock,
        category,
        barcode,
        status
      )
    ) {
      console.log("Erreur : Les données du produit sont invalides.");
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
  try {
    if (!Number.isInteger(id) || id <= 0) {
      console.log("Erreur : ID du produit invalide.");
      return;
    }

    const result = await executeQuery("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows > 0) {
      console.log("Produit supprimé avec succès.");
    } else {
      console.log("Aucun produit trouvé avec cet ID.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error.message);
  }
}

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
