// const readline = require("readline-sync");
// const {
//   addCustomer,
//   getCustomers,
//   updateCustomer,
//   deleteCustomer,
// } = require("./customer");
// const {
//   addProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct,
// } = require("./product");
// const {
//   addPurchaseOrder,
//   getPurchaseOrderById,
//   updatePurchaseOrder,
//   deletePurchaseOrder,
// } = require("./purchaseOrder");
// const {
//   addPayment,
//   getPayments,
//   updatePayment,
//   deletePayment,
// } = require("./payment");

// async function mainMenu() {
//   let exit = false;

//   while (!exit) {
//     console.log("\nMenu Principal:");
//     console.log("1. Gestion des Clients");
//     console.log("2. Gestion des Produits");
//     console.log("3. Gestion des Commandes");
//     console.log("4. Gestion des Paiements");
//     console.log("5. Quitter");

//     const choice = readline.questionInt("Choisissez une option : ");

//     switch (choice) {
//       case 1:
//         await manageCustomers();
//         break;
//       case 2:
//         await manageProducts();
//         break;
//       case 3:
//         await manageOrders();
//         break;
//       case 4:
//         await managePayments();
//         break;
//       case 5:
//         exit = true;
//         console.log("Au revoir !");
//         break;
//       default:
//         console.log("Option invalide. Essayez à nouveau.");
//     }
//   }
// }

// async function manageCustomers() {
//   let exit = false;

//   while (!exit) {
//     console.log("\nGestion des Clients :");
//     console.log("1. Ajouter un client");
//     console.log("2. Lire les clients");
//     console.log("3. Mettre à jour un client");
//     console.log("4. Supprimer un client");
//     console.log("5. Retourner au menu principal");

//     const choice = readline.questionInt("Choisissez une option : ");

//     switch (choice) {
//       case 1:
//         await addCustomerFromUser();
//         break;
//       case 2:
//         await displayCustomers();
//         break;
//       case 3:
//         await updateCustomerFromUser();
//         break;
//       case 4:
//         await deleteCustomerFromUser();
//         break;
//       case 5:
//         exit = true;
//         break;
//       default:
//         console.log("Option invalide. Essayez à nouveau.");
//     }
//   }
// }

// async function addCustomerFromUser() {
//   const name = readline.question("Nom : ");
//   const address = readline.question("Adresse : ");
//   const email = readline.question("Email : ");
//   const phone = readline.question("Téléphone : ");

//   await addCustomer(name, address, email, phone);
// }

// async function displayCustomers() {
//   const customers = await getCustomers();
//   console.table(customers);
// }

// async function updateCustomerFromUser() {
//   const id = readline.questionInt("ID du client à mettre à jour : ");
//   const name = readline.question("Nouveau nom : ");
//   const address = readline.question("Nouvelle adresse : ");
//   const email = readline.question("Nouveau email : ");
//   const phone = readline.question("Nouveau téléphone : ");

//   await updateCustomer(id, name, address, email, phone);
// }

// async function deleteCustomerFromUser() {
//   const id = readline.questionInt("ID du client à supprimer : ");
//   await deleteCustomer(id);
// }

// async function manageProducts() {
//   let exit = false;

//   while (!exit) {
//     console.log("\nGestion des Produits :");
//     console.log("1. Ajouter un produit");
//     console.log("2. Lire les produits");
//     console.log("3. Mettre à jour un produit");
//     console.log("4. Supprimer un produit");
//     console.log("5. Retourner au menu principal");

//     const choice = readline.questionInt("Choisissez une option : ");

//     switch (choice) {
//       case 1:
//         await addProductFromUser();
//         break;
//       case 2:
//         await displayProducts();
//         break;
//       case 3:
//         await updateProductFromUser();
//         break;
//       case 4:
//         await deleteProductFromUser();
//         break;
//       case 5:
//         exit = true;
//         break;
//       default:
//         console.log("Option invalide. Essayez à nouveau.");
//     }
//   }
// }

// async function addProductFromUser() {
//   const name = readline.question("Nom : ");
//   const description = readline.question("Description : ");
//   const price = readline.questionFloat("Prix : ");
//   const stock = readline.questionInt("Stock : ");
//   const category = readline.question("Catégorie : ");
//   const barcode = readline.question("Code-barres : ");
//   const status = readline.question(
//     "Statut (available, unavailable, discontinued) : "
//   );

//   await addProduct(name, description, price, stock, category, barcode, status);
// }

// async function displayProducts() {
//   const products = await getProducts();
//   console.table(products);
// }

// async function updateProductFromUser() {
//   const id = readline.questionInt("ID du produit à mettre à jour : ");
//   const name = readline.question("Nouveau nom : ");
//   const description = readline.question("Nouvelle description : ");
//   const price = readline.questionFloat("Nouveau prix : ");
//   const stock = readline.questionInt("Nouveau stock : ");
//   const category = readline.question("Nouvelle catégorie : ");
//   const barcode = readline.question("Nouveau code-barres : ");
//   const status = readline.question(
//     "Nouveau statut (available, unavailable, discontinued) : "
//   );

//   await updateProduct(
//     id,
//     name,
//     description,
//     price,
//     stock,
//     category,
//     barcode,
//     status
//   );
// }

// async function deleteProductFromUser() {
//   const id = readline.questionInt("ID du produit à supprimer : ");
//   await deleteProduct(id);
// }

// async function manageOrders() {
//   let exit = false;

//   while (!exit) {
//     console.log("\nMenu Principal :");
//     console.log("1. Ajouter une commande");
//     console.log("2. Lire une commande spécifique");
//     console.log("3. Mettre à jour une commande");
//     console.log("4. Supprimer une commande");
//     console.log("5. Quitter");

//     const choice = readline.questionInt("Choisissez une option : ");

//     switch (choice) {
//       case 1:
//         await addPurchaseOrder();
//         break;
//       case 2:
//         await displayPurchaseOrderById();
//         break;
//       case 3:
//         const orderIdToUpdate = readline.questionInt(
//           "Entrez l'ID de la commande à mettre à jour : "
//         );
//         const dateToUpdate = readline.question("Nouvelle date (YYYY-MM-DD) : ");
//         const customerIdToUpdate = readline.questionInt("ID du client : ");
//         const deliveryAddressToUpdate = readline.question(
//           "Nouvelle adresse de livraison : "
//         );
//         const trackNumberToUpdate = readline.question(
//           "Nouveau numéro de suivi : "
//         );
//         const statusToUpdate = readline.question(
//           "Nouveau statut (En attente, En cours, Livrer, Annuler) : "
//         );
//         await updatePurchaseOrder(
//           orderIdToUpdate,
//           dateToUpdate,
//           customerIdToUpdate,
//           deliveryAddressToUpdate,
//           trackNumberToUpdate,
//           statusToUpdate
//         );
//         break;
//       case 4:
//         const orderIdToDelete = readline.questionInt(
//           "Entrez l'ID de la commande à supprimer : "
//         );
//         await deletePurchaseOrder(orderIdToDelete);
//         break;
//       case 5:
//         exit = true;
//         console.log("Au revoir.");
//         break;
//       default:
//         console.log("Option invalide.");
//     }
//   }
// }

// async function displayPurchaseOrderById() {
//   const orderId = readline.questionInt(
//     "Entrez l'ID de la commande à afficher : "
//   );

//   const order = await getPurchaseOrderById(orderId);

//   if (order) {
//     console.log(`\nCommande ID: ${order.order_id}`);
//     console.log(`Date: ${order.date}`);
//     console.log(`Client ID: ${order.customer_id}`);
//     console.log(`Adresse de Livraison: ${order.delivery_address}`);
//     console.log(`Numéro de Suivi: ${order.track_number}`);
//     console.log(`Statut: ${order.status}`);

//     if (order.details.length > 0) {
//       console.log("\nDétails de la commande :");
//       order.details.forEach((detail, index) => {
//         console.log(`  Produit ${index + 1}:`);
//         console.log(`    Produit ID: ${detail.product_id}`);
//         console.log(`    Quantité: ${detail.quantity}`);
//         console.log(`    Prix: ${detail.price}`);
//       });
//     } else {
//       console.log("Aucun détail pour cette commande.");
//     }
//   }
// }

// async function managePayments() {
//   console.log("\nGestion des Paiements :");
//   console.log("1. Ajouter un paiement");
//   console.log("2. Lire les paiements");
//   console.log("3. Mettre à jour un paiement");
//   console.log("4. Supprimer un paiement");
//   console.log("5. Retourner au menu principal");

//   const choice = readline.questionInt("Choisissez une option : ");

//   switch (choice) {
//     case 1:
//       const orderId = readline.questionInt("ID de la commande : ");
//       const amount = readline.questionFloat("Montant : ");

//       console.log("Méthodes de paiement disponibles :");
//       console.log("1. Carte de crédit");
//       console.log("2. Virement bancaire");
//       console.log("3. Chèque");
//       console.log("4. PayPal");

//       const paymentChoice = readline.questionInt(
//         "Choisissez une méthode de paiement : "
//       );
//       let paymentMethod;
//       switch (paymentChoice) {
//         case 1:
//           paymentMethod = "carte de crédit";
//           break;
//         case 2:
//           paymentMethod = "virement bancaire";
//           break;
//         case 3:
//           paymentMethod = "chèque";
//           break;
//         case 4:
//           paymentMethod = "paypal";
//           break;
//         default:
//           console.log("Méthode de paiement invalide.");
//           return;
//       }

//       await addPayment(orderId, amount, paymentMethod);
//       break;

//     case 2:
//       const payments = await getPayments();
//       console.table(payments);
//       break;

//     case 3:
//       const idToUpdate = readline.questionInt(
//         "ID du paiement à mettre à jour : "
//       );
//       const newOrderId = readline.questionInt("Nouvel ID de la commande : ");
//       const newAmount = readline.questionFloat("Nouveau montant : ");

//       console.log("Méthodes de paiement disponibles :");
//       console.log("1. Carte de crédit");
//       console.log("2. Virement bancaire");
//       console.log("3. Chèque");
//       console.log("4. PayPal");

//       const newPaymentChoice = readline.questionInt(
//         "Choisissez une nouvelle méthode de paiement : "
//       );
//       let newPaymentMethod;
//       switch (newPaymentChoice) {
//         case 1:
//           newPaymentMethod = "carte de crédit";
//           break;
//         case 2:
//           newPaymentMethod = "virement bancaire";
//           break;
//         case 3:
//           newPaymentMethod = "chèque";
//           break;
//         case 4:
//           newPaymentMethod = "paypal";
//           break;
//         default:
//           console.log("Méthode de paiement invalide.");
//           return;
//       }

//       await updatePayment(idToUpdate, newOrderId, newAmount, newPaymentMethod);
//       break;

//     case 4:
//       const idToDelete = readline.questionInt("ID du paiement à supprimer : ");
//       await deletePayment(idToDelete);
//       break;

//     case 5:
//       return;

//     default:
//       console.log("Option invalide. Essayez encore.");
//   }
// }

// mainMenu();

const readline = require("readline-sync");
const {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("./customer");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("./product");
const {
  addPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getAllPurchaseOrders, // Import de la nouvelle fonction
} = require("./purchaseOrder");
const {
  addPayment,
  getPayments,
  updatePayment,
  deletePayment,
} = require("./payment");

async function mainMenu() {
  let exit = false;

  while (!exit) {
    console.log("\nMenu Principal:");
    console.log("1. Gestion des Clients");
    console.log("2. Gestion des Produits");
    console.log("3. Gestion des Commandes");
    console.log("4. Gestion des Paiements");
    console.log("5. Quitter");

    const choice = readline.questionInt("Choisissez une option : ");

    switch (choice) {
      case 1:
        await manageCustomers();
        break;
      case 2:
        await manageProducts();
        break;
      case 3:
        await manageOrders();
        break;
      case 4:
        await managePayments();
        break;
      case 5:
        exit = true;
        console.log("Au revoir !");
        break;
      default:
        console.log("Option invalide. Essayez à nouveau.");
    }
  }
}

async function manageCustomers() {
  let exit = false;

  while (!exit) {
    console.log("\nGestion des Clients :");
    console.log("1. Ajouter un client");
    console.log("2. Lire les clients");
    console.log("3. Mettre à jour un client");
    console.log("4. Supprimer un client");
    console.log("5. Retourner au menu principal");

    const choice = readline.questionInt("Choisissez une option : ");

    switch (choice) {
      case 1:
        await addCustomerFromUser();
        break;
      case 2:
        await displayCustomers();
        break;
      case 3:
        await updateCustomerFromUser();
        break;
      case 4:
        await deleteCustomerFromUser();
        break;
      case 5:
        exit = true;
        break;
      default:
        console.log("Option invalide. Essayez à nouveau.");
    }
  }
}

async function addCustomerFromUser() {
  const name = readline.question("Nom : ");
  const address = readline.question("Adresse : ");
  const email = readline.question("Email : ");
  const phone = readline.question("Téléphone : ");

  await addCustomer(name, address, email, phone);
}

async function displayCustomers() {
  const customers = await getCustomers();
  console.table(customers);
}

async function updateCustomerFromUser() {
  const id = readline.questionInt("ID du client à mettre à jour : ");
  const name = readline.question("Nouveau nom : ");
  const address = readline.question("Nouvelle adresse : ");
  const email = readline.question("Nouveau email : ");
  const phone = readline.question("Nouveau téléphone : ");

  await updateCustomer(id, name, address, email, phone);
}

async function deleteCustomerFromUser() {
  const id = readline.questionInt("ID du client à supprimer : ");
  await deleteCustomer(id);
}

async function manageProducts() {
  let exit = false;

  while (!exit) {
    console.log("\nGestion des Produits :");
    console.log("1. Ajouter un produit");
    console.log("2. Lire les produits");
    console.log("3. Mettre à jour un produit");
    console.log("4. Supprimer un produit");
    console.log("5. Retourner au menu principal");

    const choice = readline.questionInt("Choisissez une option : ");

    switch (choice) {
      case 1:
        await addProductFromUser();
        break;
      case 2:
        await displayProducts();
        break;
      case 3:
        await updateProductFromUser();
        break;
      case 4:
        await deleteProductFromUser();
        break;
      case 5:
        exit = true;
        break;
      default:
        console.log("Option invalide. Essayez à nouveau.");
    }
  }
}

async function addProductFromUser() {
  const name = readline.question("Nom : ");
  const description = readline.question("Description : ");
  const price = readline.questionFloat("Prix : ");
  const stock = readline.questionInt("Stock : ");
  const category = readline.question("Catégorie : ");
  const barcode = readline.question("Code-barres : ");
  const status = readline.question(
    "Statut (available, unavailable, discontinued) : "
  );

  await addProduct(name, description, price, stock, category, barcode, status);
}

async function displayProducts() {
  const products = await getProducts();
  console.table(products);
}

async function updateProductFromUser() {
  const id = readline.questionInt("ID du produit à mettre à jour : ");
  const name = readline.question("Nouveau nom : ");
  const description = readline.question("Nouvelle description : ");
  const price = readline.questionFloat("Nouveau prix : ");
  const stock = readline.questionInt("Nouveau stock : ");
  const category = readline.question("Nouvelle catégorie : ");
  const barcode = readline.question("Nouveau code-barres : ");
  const status = readline.question(
    "Nouveau statut (available, unavailable, discontinued) : "
  );

  await updateProduct(
    id,
    name,
    description,
    price,
    stock,
    category,
    barcode,
    status
  );
}

async function deleteProductFromUser() {
  const id = readline.questionInt("ID du produit à supprimer : ");
  await deleteProduct(id);
}

async function manageOrders() {
  let exit = false;

  while (!exit) {
    console.log("\nGestion des Commandes :");
    console.log("1. Ajouter une commande");
    console.log("2. Lire une commande spécifique");
    console.log("3. Lire toutes les commandes"); // Ajout de l'option pour lire toutes les commandes
    console.log("4. Mettre à jour une commande");
    console.log("5. Supprimer une commande");
    console.log("6. Quitter");

    const choice = readline.questionInt("Choisissez une option : ");

    switch (choice) {
      case 1:
        await addPurchaseOrder();
        break;
      case 2:
        await displayPurchaseOrderById();
        break;
      case 3: // Nouvelle option pour afficher toutes les commandes
        await displayAllPurchaseOrders();
        break;
      case 4:
        const orderIdToUpdate = readline.questionInt(
          "Entrez l'ID de la commande à mettre à jour : "
        );
        const dateToUpdate = readline.question("Nouvelle date (YYYY-MM-DD) : ");
        const customerIdToUpdate = readline.questionInt("ID du client : ");
        const deliveryAddressToUpdate = readline.question(
          "Nouvelle adresse de livraison : "
        );
        const trackNumberToUpdate = readline.question(
          "Nouveau numéro de suivi : "
        );
        const statusToUpdate = readline.question(
          "Nouveau statut (En attente, En cours, Livré, Annulé) : "
        );
        await updatePurchaseOrder(
          orderIdToUpdate,
          dateToUpdate,
          customerIdToUpdate,
          deliveryAddressToUpdate,
          trackNumberToUpdate,
          statusToUpdate
        );
        break;
      case 5:
        const orderIdToDelete = readline.questionInt(
          "Entrez l'ID de la commande à supprimer : "
        );
        await deletePurchaseOrder(orderIdToDelete);
        break;
      case 6:
        exit = true;
        console.log("Au revoir.");
        break;
      default:
        console.log("Option invalide.");
    }
  }
}

async function displayPurchaseOrderById() {
  const orderId = readline.questionInt(
    "Entrez l'ID de la commande à afficher : "
  );

  const order = await getPurchaseOrderById(orderId);

  if (order) {
    console.log(`\nCommande ID: ${order.order_id}`);
    console.log(`Date: ${order.date}`);
    console.log(`Client ID: ${order.customer_id}`);
    console.log(`Adresse de Livraison: ${order.delivery_address}`);
    console.log(`Numéro de Suivi: ${order.track_number}`);
    console.log(`Statut: ${order.status}`);

    if (order.details.length > 0) {
      console.log("\nDétails de la commande :");
      order.details.forEach((detail, index) => {
        console.log(`  Produit ${index + 1}:`);
        console.log(`    Produit ID: ${detail.product_id}`);
        console.log(`    Quantité: ${detail.quantity}`);
        console.log(`    Prix: ${detail.price}`);
      });
    } else {
      console.log("Aucun détail pour cette commande.");
    }
  }
}

async function displayAllPurchaseOrders() {
  const orders = await getAllPurchaseOrders(); // Appel de la nouvelle fonction
  console.table(orders);
}

async function managePayments() {
  console.log("\nGestion des Paiements :");
  console.log("1. Ajouter un paiement");
  console.log("2. Lire les paiements");
  console.log("3. Mettre à jour un paiement");
  console.log("4. Supprimer un paiement");
  console.log("5. Retourner au menu principal");

  const choice = readline.questionInt("Choisissez une option : ");

  switch (choice) {
    case 1:
      await addPayment();
      break;
    case 2:
      await displayPayments();
      break;
    case 3:
      const paymentIdToUpdate = readline.questionInt(
        "Entrez l'ID du paiement à mettre à jour : "
      );
      const newDate = readline.question("Nouvelle date (YYYY-MM-DD) : ");
      const newAmount = readline.questionFloat("Nouveau montant : ");
      const newPaymentMethod = readline.question("Nouveau mode de paiement : ");
      const newStatus = readline.question("Nouveau statut : ");

      await updatePayment(
        paymentIdToUpdate,
        newDate,
        newAmount,
        newPaymentMethod,
        newStatus
      );
      break;
    case 4:
      const paymentIdToDelete = readline.questionInt(
        "Entrez l'ID du paiement à supprimer : "
      );
      await deletePayment(paymentIdToDelete);
      break;
    case 5:
      return;
    default:
      console.log("Option invalide.");
  }
}

mainMenu();
