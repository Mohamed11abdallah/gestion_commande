const { executeQuery } = require("./db");

async function addPayment(orderId, amount, paymentMethod) {
  try {
    const orderExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?",
      [orderId]
    );

    if (orderExists[0].count === 0) {
      console.error(`Erreur : La commande avec l'ID ${orderId} n'existe pas.`);
      return;
    }

    if (amount <= 0) {
      console.error("Erreur : Le montant doit être positif.");
      return;
    }

    const result = await executeQuery(
      "INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, ?)",
      [orderId, amount, paymentMethod]
    );
    console.log("Paiement ajouté avec succès !");
    return result;
  } catch (error) {
    console.error("Erreur lors de l'ajout du paiement :", error.message);
  }
}

async function getPayments() {
  try {
    const payments = await executeQuery("SELECT * FROM payments");
    return payments;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paiements :",
      error.message
    );
  }
}

async function updatePayment(id, newOrderId, newAmount, newPaymentMethod) {
  try {
    const orderExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?",
      [newOrderId]
    );

    if (orderExists[0].count === 0) {
      console.error(
        `Erreur : La commande avec l'ID ${newOrderId} n'existe pas.`
      );
      return;
    }

    if (newAmount <= 0) {
      console.error("Erreur : Le montant doit être positif.");
      return;
    }

    const result = await executeQuery(
      "UPDATE payments SET order_id = ?, amount = ?, payment_method = ? WHERE id = ?",
      [newOrderId, newAmount, newPaymentMethod, id]
    );
    console.log("Paiement mis à jour avec succès !");
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement :", error.message);
  }
}

async function deletePayment(id) {
  try {
    const result = await executeQuery("DELETE FROM payments WHERE id = ?", [
      id,
    ]);
    console.log("Paiement supprimé avec succès !");
    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement :", error.message);
  }
}

module.exports = {
  addPayment,
  getPayments,
  updatePayment,
  deletePayment,
};
