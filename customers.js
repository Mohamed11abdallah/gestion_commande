const { pool } = require("./db");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d+$/;
  return phoneRegex.test(phone);
}

async function updateCustomer(id, name, address, email, phone) {
  let connection;

  try {
    connection = await pool.getConnection();

    // Vérification de l'existence du client
    const [rows] = await connection.execute(
      "SELECT * FROM customers WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      console.error(`Le client avec l'ID ${id} n'existe pas.`);
      return;
    }

    // Validation des données
    if (!validateEmail(email)) {
      console.error("Email invalide.");
      return;
    }
    if (!validatePhone(phone)) {
      console.error(
        "Téléphone invalide. Il doit contenir uniquement des chiffres."
      );
      return;
    }

    // Mise à jour du client
    const [result] = await connection.execute(
      "UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?",
      [name, address, email, phone, id]
    );

    if (result.affectedRows > 0) {
      console.log("Client mis à jour avec succès.");
    } else {
      console.log("Aucun changement apporté.");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client :", error.message);
  } finally {
    if (connection) connection.release();
  }
}

async function addCustomer(name, address, email, phone) {
  try {
    // Validation des données
    if (!validateEmail(email)) {
      console.error("Email invalide.");
      return;
    }
    if (!validatePhone(phone)) {
      console.error(
        "Téléphone invalide. Il doit contenir uniquement des chiffres."
      );
      return;
    }

    // Ajout du client
    const [result] = await pool.execute(
      "INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)",
      [name, address, email, phone]
    );
    console.log("Client ajouté avec l'ID :", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", error.message);
  }
}

async function getCustomers() {
  try {
    const [rows] = await pool.execute("SELECT * FROM customers");
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des clients :",
      error.message
    );
  }
}

async function deleteCustomer(id) {
  let connection;

  try {
    connection = await pool.getConnection();

    // Commence une transaction pour garantir la suppression cohérente
    await connection.beginTransaction();

    // Supprimer les détails des commandes
    const [orderIds] = await connection.execute(
      "SELECT id FROM purchase_orders WHERE customer_id = ?",
      [id]
    );
    if (orderIds.length > 0) {
      const orderIdList = orderIds.map((order) => order.id);
      await connection.execute(
        `DELETE FROM order_details WHERE order_id IN (${orderIdList.join(",")})`
      );
    }

    // Supprimer les commandes liées
    await connection.execute(
      "DELETE FROM purchase_orders WHERE customer_id = ?",
      [id]
    );

    // Supprimer le client
    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      console.log(`Client supprimé avec succès (ID: ${id}).`);
    } else {
      console.log("Aucun client trouvé avec cet ID.");
    }

    // Confirmer la transaction
    await connection.commit();
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error.message);
    // Si une erreur se produit, annule la transaction
    if (connection) await connection.rollback();
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { addCustomer, getCustomers, updateCustomer, deleteCustomer };
