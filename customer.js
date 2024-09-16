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

    const [rows] = await connection.execute(
      "SELECT * FROM customers WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      console.error(`Le client avec l'ID ${id} n'existe pas.`);
      return;
    }

    if (!name) {
      console.error("Le nom est obligatoire.");
      return;
    }

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
    if (!name) {
      console.error("Le nom est obligatoire.");
      return;
    }
    if (!address) {
      console.error("L'adresse est obligatoire.");
      return;
    }

    if (!email || !validateEmail(email)) {
      console.error("L'email est obligatoire et doit être valide.");
      return;
    }
    if (!phone || !validatePhone(phone)) {
      console.error(
        "Le téléphone est obligatoire et doit contenir uniquement des chiffres."
      );
      return;
    }

    const [result] = await pool.execute(
      "INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)",
      [name, address || null, email, phone]
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

    await connection.beginTransaction();

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

    await connection.execute(
      "DELETE FROM purchase_orders WHERE customer_id = ?",
      [id]
    );
    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      console.log(`Client supprimé avec succès (ID: ${id}).`);
    } else {
      console.log("Aucun client trouvé avec cet ID.");
    }

    await connection.commit();
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error.message);

    if (connection) await connection.rollback();
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { addCustomer, getCustomers, updateCustomer, deleteCustomer };
