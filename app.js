const readline = require("readline-sync");
const {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("./customers");

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

mainMenu();
