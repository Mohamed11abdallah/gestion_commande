const readline = require("readline-sync");
const { executeQuery } = require("./db");

function validateOrderDetails(order_id, product_id, quantity, price) {
  return (
    Number.isInteger(order_id) &&
    Number.isInteger(product_id) &&
    quantity > 0 &&
    price > 0
  );
}

function validateId(id) {
  return Number.isInteger(id) && id > 0;
}

async function productExists(product_id) {
  const result = await executeQuery(
    "SELECT COUNT(*) AS count FROM products WHERE id = ?",
    [product_id]
  );
  return result[0].count > 0;
}

async function addOrderDetail(order_id, product_id, quantity, price) {
  try {
    if (!validateOrderDetails(order_id, product_id, quantity, price)) {
      console.log("Erreur : Les données du détail de commande sont invalides.");
      return;
    }

    const productExist = await productExists(product_id);

    if (!productExist) {
      console.log(`Erreur : Le produit avec l'ID ${product_id} n'existe pas.`);
      return;
    }

    const result = await executeQuery(
      "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [order_id, product_id, quantity, price]
    );
    console.log("Détail de commande ajouté avec succès, ID :", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout du détail de commande :",
      error.message
    );
  }
}

async function getOrderDetail() {
  try {
    const rows = await executeQuery("SELECT * FROM order_details");
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de commandes :",
      error.message
    );
  }
}

async function updateOrderDetail(id, order_id, product_id, quantity, price) {
  try {
    if (!validateOrderDetails(order_id, product_id, quantity, price)) {
      console.log("Erreur : Les données du détail de commande sont invalides.");
      return;
    }

    const productExist = await productExists(product_id);

    if (!productExist) {
      console.log(`Erreur : Le produit avec l'ID ${product_id} n'existe pas.`);
      return;
    }

    const result = await executeQuery(
      "UPDATE order_details SET order_id = ?, product_id = ?, quantity = ?, price = ? WHERE id = ?",
      [order_id, product_id, quantity, price, id]
    );

    if (result.affectedRows > 0) {
      console.log("Détail de commande mis à jour avec succès.");
    } else {
      console.log("Aucun détail de commande trouvé avec cet ID.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du détail de commande :",
      error.message
    );
  }
}

async function deleteOrderDetail(id) {
  try {
    if (!validateId(id)) {
      console.log("Erreur : ID de détail de commande invalide.");
      return;
    }

    const result = await executeQuery(
      "DELETE FROM order_details WHERE id = ?",
      [id]
    );
    console.log("Détail de commande supprimé :", result.affectedRows > 0);
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du détail de commande :",
      error.message
    );
  }
}

module.exports = {
  addOrderDetail,
  getOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
