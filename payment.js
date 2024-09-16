const { pool, executeQuery } = require("./db");

async function addPayment(orderId, amount, paymentMethod) {
  let connection;

  try {
    connection = await pool.getConnection();

    const [orderExists] = await connection.execute(
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

    const [result] = await connection.execute(
      "INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, ?)",
      [orderId, amount, paymentMethod]
    );

    console.log("Paiement ajouté avec succès, ID :", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du paiement :", error.message);
  } finally {
    if (connection) connection.release();
  }
}

async function getPayments() {
  let connection;

  try {
    connection = await pool.getConnection();
    const [payments] = await connection.execute("SELECT * FROM payments");
    return payments;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paiements :",
      error.message
    );
  } finally {
    if (connection) connection.release();
  }
}

async function updatePayment(id, newOrderId, newAmount, newPaymentMethod) {
  let connection;

  try {
    connection = await pool.getConnection();

    const [orderExists] = await connection.execute(
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

    const [result] = await connection.execute(
      "UPDATE payments SET order_id = ?, amount = ?, payment_method = ? WHERE id = ?",
      [newOrderId, newAmount, newPaymentMethod, id]
    );

    if (result.affectedRows > 0) {
      console.log("Paiement mis à jour avec succès !");
    } else {
      console.log("Aucun paiement trouvé avec cet ID.");
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement :", error.message);
  } finally {
    if (connection) connection.release();
  }
}

async function deletePayment(id) {
  let connection;

  try {
    connection = await pool.getConnection();

    const [paymentExists] = await connection.execute(
      "SELECT COUNT(*) AS count FROM payments WHERE id = ?",
      [id]
    );

    if (paymentExists[0].count === 0) {
      console.error(`Erreur : Le paiement avec l'ID ${id} n'existe pas.`);
      return;
    }

    const [result] = await connection.execute(
      "DELETE FROM payments WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      console.log("Paiement supprimé avec succès !");
    } else {
      console.log("Aucun paiement trouvé avec cet ID.");
    }

    return result;
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      console.error("Erreur : Le paiement est référencé dans d'autres tables.");
    } else {
      console.error(
        "Erreur lors de la suppression du paiement :",
        error.message
      );
    }
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  addPayment,
  getPayments,
  updatePayment,
  deletePayment,
};
