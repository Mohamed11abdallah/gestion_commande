const readline = require("readline-sync");
const { executeQuery } = require("./db");
const { addOrderDetail } = require("./orderDetails");

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

    // Valider les données avant de continuer
    if (!validateDate(date)) {
      console.error("Date invalide. Format attendu : YYYY-MM-DD.");
      return;
    }
    if (!validateTrackNumber(trackNumber)) {
      console.error("Numéro de suivi invalide.");
      return;
    }
    if (!validateStatus(status)) {
      console.error(
        "Statut invalide. Les statuts acceptés sont : En attente, En cours, Livrer, Annuler."
      );
      return;
    }

    // Saisir les détails de la commande avant d'insérer la commande
    const orderDetails = getOrderDetailsFromUser();

    // Vérification de l'existence du client
    const clientExists = await executeQuery(
      "SELECT COUNT(*) AS count FROM customers WHERE id = ?",
      [customerId]
    );
    if (clientExists[0].count === 0) {
      console.error("Erreur : Le client n'existe pas.");
      return;
    }

    // Insertion de la commande dans la base de données
    const result = await executeQuery(
      "INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)",
      [date, customerId, deliveryAddress, trackNumber, status]
    );
    const orderId = result.insertId;

    console.log("Commande ajoutée avec l'ID :", orderId);

    // Maintenant, traiter les détails de commande
    let totalAmount = 0;
    for (const detail of orderDetails) {
      if (detail.quantity <= 0 || detail.price <= 0) {
        console.error("Erreur : La quantité et le prix doivent être positifs.");
        return;
      }

      totalAmount += detail.quantity * detail.price;

      // Vérification de l'existence du produit
      const productExists = await executeQuery(
        "SELECT COUNT(*) AS count FROM products WHERE id = ?",
        [detail.productId]
      );
      if (productExists[0].count === 0) {
        console.error(
          `Erreur : Le produit avec l'ID ${detail.productId} n'existe pas.`
        );
        return;
      }

      // Ajouter les détails de la commande
      await addOrderDetail(
        orderId,
        detail.productId,
        detail.quantity,
        detail.price
      );
    }

    console.log("Tous les détails de commande ont été ajoutés.");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande :", error.message);
  }
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
  try {
    if (!validateDate(date)) {
      console.error("Date invalide. Format attendu : YYYY-MM-DD.");
      return;
    }
    if (!validateTrackNumber(trackNumber)) {
      console.error("Numéro de suivi invalide.");
      return;
    }
    if (!validateStatus(status)) {
      console.error("Statut invalide.");
      return;
    }

    const result = await executeQuery(
      "UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
      [date, customerId, deliveryAddress, trackNumber, status, id]
    );
    if (result.affectedRows > 0) {
      console.log("Informations de la commande mises à jour.");
    } else {
      console.log("Aucune modification détectée.");
      return;
    }

    const modifyDetails = readline.keyInYNStrict(
      "Voulez-vous modifier les détails de la commande ?"
    );

    if (modifyDetails) {
      const order = await getPurchaseOrderById(id);
      if (!order) {
        console.log("Commande introuvable.");
        return;
      }

      console.log("Détails actuels de la commande :");
      order.details.forEach((detail, index) => {
        console.log(
          `Produit ID : ${detail.product_id}, Quantité : ${detail.quantity}, Prix : ${detail.price}`
        );
      });

      const newDetails = getOrderDetailsFromUser();

      const confirm = readline.keyInYNStrict(
        "Voulez-vous enregistrer les nouveaux détails ?"
      );
      if (!confirm) {
        console.log("Modification des détails annulée.");
        return;
      }

      await executeQuery("DELETE FROM order_details WHERE order_id = ?", [id]);

      for (const detail of newDetails) {
        if (detail.quantity <= 0 || detail.price <= 0) {
          console.error(
            "Erreur : La quantité et le prix doivent être positifs."
          );
          return;
        }
        await addOrderDetail(
          id,
          detail.productId,
          detail.quantity,
          detail.price
        );
      }

      console.log("Détails de commande mis à jour.");
    } else {
      console.log("Aucune modification des détails de la commande.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la commande :",
      error.message
    );
  }
}

async function deletePurchaseOrder(orderId) {
  try {
    const deleteOrderDetails = await executeQuery(
      "DELETE FROM order_details WHERE order_id = ?",
      [orderId]
    );

    if (deleteOrderDetails.affectedRows > 0) {
      console.log("Détails de la commande supprimés avec succès.");
      // } else {
      //   console.log("Aucun détail trouvé pour cette commande.");
    }

    const deletePurchaseOrder = await executeQuery(
      "DELETE FROM purchase_orders WHERE id = ?",
      [orderId]
    );

    if (deletePurchaseOrder.affectedRows > 0) {
      console.log("Commande supprimée avec succès.");
    } else {
      console.log("Aucune commande trouvée avec cet ID.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la commande :",
      error.message
    );
  }
}

module.exports = {
  addPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
