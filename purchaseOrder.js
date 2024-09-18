const readline = require("readline-sync");
const { executeQuery } = require("./db");
const { addOrderDetail } = require("./orderDetail");

function validateDate(date) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

function validateTrackNumber(trackNumber) {
  const trackNumberRegex = /^[a-zA-Z0-9]+$/;
  return trackNumberRegex.test(trackNumber);
}

function validateStatus(status) {
  const validStatuses = ["En attente", "En cours", "Livrer", "Annuler"];
  return validStatuses.includes(status);
}

function getOrderDetailsFromUser() {
  const details = [];
  let addMore = true;

  console.log("Saisie des détails de la commande :");

  while (addMore) {
    const productId = readline.questionInt("ID du produit : ");
    const quantity = readline.questionInt("Quantité : ");
    const price = readline.questionFloat("Prix : ");

    if (quantity <= 0) {
      console.error("Erreur : La quantité doit être supérieure à 0.");
      return null;
    }
    if (price <= 0) {
      console.error("Erreur : Le prix doit être supérieur à 0.");
      return null;
    }

    details.push({ productId, quantity, price });

    addMore = readline.keyInYNStrict(
      "Voulez-vous ajouter un autre détail de commande ?"
    );
  }

  return details;
}

async function addPurchaseOrder() {
  try {
    console.log("Début de la saisie de la commande.");

    const date = readline.question("Date (YYYY-MM-DD) : ");
    const customerId = readline.questionInt("ID du client : ");
    const deliveryAddress = readline.question("Adresse de livraison : ");
    const trackNumber = readline.question("Numéro de suivi : ");
    const status = readline.question(
      "Statut (En attente, En cours, Livrer, Annuler) : "
    );

    if (!validateDate(date)) {
      console.error("Date invalide. Format attendu : YYYY-MM-DD.");
      return false;
    }
    if (!validateTrackNumber(trackNumber)) {
      console.error("Numéro de suivi invalide.");
      return false;
    }
    if (!validateStatus(status)) {
      console.error(
        "Statut invalide. Les statuts acceptés sont : En attente, En cours, Livrer, Annuler."
      );
      return false;
    }

    const clientExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM customers WHERE id = ?",
      [customerId]
    );
    if (clientExists[0].count === 0) {
      console.error("Erreur : Le client avec l'ID spécifié n'existe pas.");
      return false;
    }

    const orderDetails = getOrderDetailsFromUser();
    if (!orderDetails) {
      return false;
    }

    for (const detail of orderDetails) {
      const productExists = await executeQuery(
        "SELECT COUNT(*) AS count FROM products WHERE id = ?",
        [detail.productId]
      );
      if (productExists[0].count === 0) {
        console.error(
          `Erreur : Le produit avec l'ID ${detail.productId} n'existe pas. Annulation de la commande.`
        );
        return false;
      }
    }

    const result = await executeQuery(
      "INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)",
      [date, customerId, deliveryAddress, trackNumber, status]
    );

    if (result.affectedRows === 0) {
      throw new Error("Erreur lors de l'ajout de la commande.");
    }

    const orderId = result.insertId;
    console.log("Commande ajoutée avec l'ID :", orderId);

    let totalAmount = 0;
    for (const detail of orderDetails) {
      totalAmount += detail.quantity * detail.price;

      await addOrderDetail(
        orderId,
        detail.productId,
        detail.quantity,
        detail.price
      );
    }

    console.log("Tous les détails de commande ont été ajoutés.");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande :", error.message);
    return false;
  }
}

async function getAllPurchaseOrders() {
  const query = `
    SELECT po.id AS order_id, po.date, po.customer_id, po.delivery_address, po.track_number, po.status,
           c.name AS customer_name
    FROM purchase_orders po
    JOIN customers c ON po.customer_id = c.id
    ORDER BY po.date DESC
  `;

  const rows = await executeQuery(query);
  return rows;
}

async function getPurchaseOrderById(orderId) {
  try {
    const query = `
      SELECT po.id AS order_id, po.date, po.customer_id, po.delivery_address, po.track_number, po.status,
             od.product_id, od.quantity, od.price
      FROM purchase_orders po
      LEFT JOIN order_details od ON po.id = od.order_id
      WHERE po.id = ?
    `;

    const rows = await executeQuery(query, [orderId]);

    if (rows.length === 0) {
      console.log(`Aucune commande trouvée avec l'ID : ${orderId}`);
      return null;
    }

    const order = {
      order_id: rows[0].order_id,
      date: rows[0].date,
      customer_id: rows[0].customer_id,
      delivery_address: rows[0].delivery_address,
      track_number: rows[0].track_number,
      status: rows[0].status,
      details: [],
    };

    rows.forEach((row) => {
      if (row.product_id) {
        order.details.push({
          product_id: row.product_id,
          quantity: row.quantity,
          price: row.price,
        });
      }
    });

    return order;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la commande :",
      error.message
    );
    return null;
  }
}

async function updatePurchaseOrder(
  id,
  date,
  customerId,
  deliveryAddress,
  trackNumber,
  status
) {
  let transactionSuccessful = true;
  let newDetails = [];

  try {
    if (!validateDate(date)) {
      console.error("Date invalide. Format attendu : YYYY-MM-DD.");
      return false;
    }
    if (!validateTrackNumber(trackNumber)) {
      console.error("Numéro de suivi invalide.");
      return false;
    }
    if (!validateStatus(status)) {
      console.error(
        "Statut invalide. Les statuts acceptés sont : En attente, En cours, Livrer, Annuler."
      );
      return false;
    }

    const orderExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?",
      [id]
    );
    if (orderExists[0].count === 0) {
      console.log("Commande introuvable.");
      return false;
    }

    const clientExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM customers WHERE id = ?",
      [customerId]
    );
    if (clientExists[0].count === 0) {
      console.error("Erreur : Le client avec l'ID spécifié n'existe pas.");
      return false;
    }

    const modifyDetails = readline.keyInYNStrict(
      "Voulez-vous modifier les détails de la commande ?"
    );

    if (modifyDetails) {
      const orderDetails = await executeQuery(
        "SELECT * FROM order_details WHERE order_id = ?",
        [id]
      );

      if (orderDetails.length === 0) {
        console.log("Aucun détail de commande trouvé.");
      } else {
        console.log("Détails actuels de la commande :");
        orderDetails.forEach((detail) => {
          console.log(
            `Produit ID : ${detail.product_id}, Quantité : ${detail.quantity}, Prix : ${detail.price}`
          );
        });
      }

      newDetails = getOrderDetailsFromUser();

      if (!newDetails) {
        return false;
      }

      for (const detail of newDetails) {
        const productExists = await executeQuery(
          "SELECT COUNT(*) AS count FROM products WHERE id = ?",
          [detail.productId]
        );
        if (productExists[0].count === 0) {
          console.error(
            `Erreur : Le produit avec l'ID ${detail.productId} n'existe pas. Annulation de la commande..`
          );
          transactionSuccessful = false;
          break;
        }
      }

      if (transactionSuccessful) {
        await executeQuery("DELETE FROM order_details WHERE order_id = ?", [
          id,
        ]);

        for (const detail of newDetails) {
          if (detail.quantity <= 0 || detail.price <= 0) {
            console.error(
              "Erreur : La quantité et le prix doivent être positifs."
            );
            transactionSuccessful = false;
            break;
          }
          await addOrderDetail(
            id,
            detail.productId,
            detail.quantity,
            detail.price
          );
        }

        if (transactionSuccessful) {
          const updateResult = await executeQuery(
            "UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
            [date, customerId, deliveryAddress, trackNumber, status, id]
          );

          if (updateResult.affectedRows === 0) {
            console.log("Aucune modification détectée.");
            transactionSuccessful = false;
          } else {
            console.log("Informations de la commande mises à jour.");
          }
        }
      }
    } else {
      console.log("Aucune modification des détails de la commande.");

      const updateResult = await executeQuery(
        "UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
        [date, customerId, deliveryAddress, trackNumber, status, id]
      );

      if (updateResult.affectedRows === 0) {
        console.log("Aucune modification détectée.");
        transactionSuccessful = false;
      } else {
        console.log("Informations de la commande mises à jour.");
      }
    }

    return transactionSuccessful;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la commande :",
      error.message
    );
    return false;
  }
}

async function deletePurchaseOrder(orderId) {
  try {
    const orderExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?",
      [orderId]
    );

    if (orderExists[0].count === 0) {
      console.log("Aucune commande trouvée avec l'ID :", orderId);
      return false;
    }

    const paymentsExist = await executeQuery(
      "SELECT COUNT(*) AS count FROM payments WHERE order_id = ?",
      [orderId]
    );

    if (paymentsExist[0].count > 0) {
      console.log(
        "Erreur : La commande ne peut pas être supprimée car elle est liée à un paiement."
      );
      return false;
    }

    await executeQuery("DELETE FROM order_details WHERE order_id = ?", [
      orderId,
    ]);

    const deleteResult = await executeQuery(
      "DELETE FROM purchase_orders WHERE id = ?",
      [orderId]
    );

    if (deleteResult.affectedRows > 0) {
      console.log("Commande supprimée avec succès.");
      return true;
    } else {
      console.log("Aucune commande trouvée avec cet ID.");
      return false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la commande :",
      error.message
    );
    return false;
  }
}

module.exports = {
  addPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
