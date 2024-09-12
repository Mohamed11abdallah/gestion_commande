const readline = require("readline-sync");
const { executeQuery } = require("./db");

function validateId(id) {
  return Number.isInteger(id) && id > 0;
}

function validateQuantity(quantity) {
  return Number.isInteger(quantity) && quantity > 0;
}

function validatePrice(price) {
  return typeof price === "number" && price > 0;
}

async function addOrderDetail(orderId, productId, quantity, price) {
  try {
    if (
      !validateId(orderId) ||
      !validateId(productId) ||
      !validateQuantity(quantity) ||
      !validatePrice(price)
    ) {
      console.log("Erreur : Les données fournies sont invalides.");
      return;
    }

    const result = await executeQuery(
      "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, productId, quantity, price]
    );
    console.log("Détail de commande ajouté avec l'ID :", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout du détail de commande :",
      error.message
    );
  }
}

async function getOrderDetails() {
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

async function updateOrderDetail(id, orderId, productId, quantity, price) {
  try {
    if (
      !validateId(id) ||
      !validateId(orderId) ||
      !validateId(productId) ||
      !validateQuantity(quantity) ||
      !validatePrice(price)
    ) {
      console.log("Erreur : Les données fournies sont invalides.");
      return;
    }

    const result = await executeQuery(
      "UPDATE order_details SET order_id = ?, product_id = ?, quantity = ?, price = ? WHERE id = ?",
      [orderId, productId, quantity, price, id]
    );
    console.log("Détail de commande mis à jour :", result.affectedRows > 0);
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
  getOrderDetails,
  updateOrderDetail,
  deleteOrderDetail,
};
