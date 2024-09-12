const mysql = require("mysql2/promise");

let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "rELAX2024",
      database: "gestion_commande",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Connexion à la base de données réussie.");
  } catch (error) {
    console.error(
      "Erreur lors de la connexion à la base de données :",
      error.message
    );
    process.exit(1);
  }
}

initializeDatabase();

async function executeQuery(query, params = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de l'exécution de la requête SQL :",
      error.message
    );
    throw error;
  }
}

module.exports = {
  pool,
  executeQuery,
};
