const readline = require("readline-sync");
const {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("./customers");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("./products");

const {
  addPayment,
  getPayments,
  updatePayment,
  deletePayment,
} = require("./payments");

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
      const orderId = readline.questionInt("ID de la commande : ");
      const amount = readline.questionFloat("Montant : ");

      console.log("Méthodes de paiement disponibles :");
      console.log("1. Carte de crédit");
      console.log("2. Virement bancaire");
      console.log("3. Chèque");
      console.log("4. PayPal");

      const paymentChoice = readline.questionInt(
        "Choisissez une méthode de paiement : "
      );
      let paymentMethod;
      switch (paymentChoice) {
        case 1:
          paymentMethod = "carte de crédit";
          break;
        case 2:
          paymentMethod = "virement bancaire";
          break;
        case 3:
          paymentMethod = "chèque";
          break;
        case 4:
          paymentMethod = "paypal";
          break;
        default:
          console.log("Méthode de paiement invalide.");
          return;
      }

      await addPayment(orderId, amount, paymentMethod);
      break;

    case 2:
      const payments = await getPayments();
      console.table(payments);
      break;

    case 3:
      const idToUpdate = readline.questionInt(
        "ID du paiement à mettre à jour : "
      );
      const newOrderId = readline.questionInt("Nouvel ID de la commande : ");
      const newAmount = readline.questionFloat("Nouveau montant : ");

      console.log("Méthodes de paiement disponibles :");
      console.log("1. Carte de crédit");
      console.log("2. Virement bancaire");
      console.log("3. Chèque");
      console.log("4. PayPal");

      const newPaymentChoice = readline.questionInt(
        "Choisissez une nouvelle méthode de paiement : "
      );
      let newPaymentMethod;
      switch (newPaymentChoice) {
        case 1:
          newPaymentMethod = "carte de crédit";
          break;
        case 2:
          newPaymentMethod = "virement bancaire";
          break;
        case 3:
          newPaymentMethod = "chèque";
          break;
        case 4:
          newPaymentMethod = "paypal";
          break;
        default:
          console.log("Méthode de paiement invalide.");
          return;
      }

      await updatePayment(idToUpdate, newOrderId, newAmount, newPaymentMethod);
      break;

    case 4:
      const idToDelete = readline.questionInt("ID du paiement à supprimer : ");
      await deletePayment(idToDelete);
      break;

    case 5:
      return;

    default:
      console.log("Option invalide. Essayez encore.");
  }
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
      const orderId = readline.questionInt("ID de la commande : ");
      const amount = readline.questionFloat("Montant : ");

      console.log("Méthodes de paiement disponibles :");
      console.log("1. Carte de crédit");
      console.log("2. Virement bancaire");
      console.log("3. Chèque");
      console.log("4. PayPal");

      const paymentChoice = readline.questionInt(
        "Choisissez une méthode de paiement : "
      );
      let paymentMethod;
      switch (paymentChoice) {
        case 1:
          paymentMethod = "carte de crédit";
          break;
        case 2:
          paymentMethod = "virement bancaire";
          break;
        case 3:
          paymentMethod = "chèque";
          break;
        case 4:
          paymentMethod = "paypal";
          break;
        default:
          console.log("Méthode de paiement invalide.");
          return;
      }

      await addPayment(orderId, amount, paymentMethod);
      break;

    case 2:
      const payments = await getPayments();
      console.table(payments);
      break;

    case 3:
      const idToUpdate = readline.questionInt(
        "ID du paiement à mettre à jour : "
      );
      const newOrderId = readline.questionInt("Nouvel ID de la commande : ");
      const newAmount = readline.questionFloat("Nouveau montant : ");

      console.log("Méthodes de paiement disponibles :");
      console.log("1. Carte de crédit");
      console.log("2. Virement bancaire");
      console.log("3. Chèque");
      console.log("4. PayPal");

      const newPaymentChoice = readline.questionInt(
        "Choisissez une nouvelle méthode de paiement : "
      );
      let newPaymentMethod;
      switch (newPaymentChoice) {
        case 1:
          newPaymentMethod = "carte de crédit";
          break;
        case 2:
          newPaymentMethod = "virement bancaire";
          break;
        case 3:
          newPaymentMethod = "chèque";
          break;
        case 4:
          newPaymentMethod = "paypal";
          break;
        default:
          console.log("Méthode de paiement invalide.");
          return;
      }

      await updatePayment(idToUpdate, newOrderId, newAmount, newPaymentMethod);
      break;

    case 4:
      const idToDelete = readline.questionInt("ID du paiement à supprimer : ");
      await deletePayment(idToDelete);
      break;

    case 5:
      return;

    default:
      console.log("Option invalide. Essayez encore.");
  }
}

mainMenu();
