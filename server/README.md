# Secure Chain - Vehicle Registration System (Backend)

This is the backend for the Vehicle Registration System, built using Node.js, Express, and SQL Server.

## Installation

1. Clone the repository:
   
   cd server
   

2. Install dependencies:

   npm install


3. Set up a `.env` file in server dir with the following variables:

   USER=<your_db_username>
   PASSWORD=<your_db_password>
   SERVER=<your_db_server>
   DATABASE=<your_db_name>
   PORT=8089
   HOST=localhost

   Ensure to set up Database with provided Script


## Running the Server

Start the server:

npm start


The server will run at `http://localhost:8089`.

## API Endpoints (Check Routes in Routes directory)

### Users
    createUser
    getAllUsers
    getUserByName
    getUserById
    updateUser
    deleteUser
    
    

### Vehicles
    getAllVehicles
    getVehicleById
    getVehiclesByOwner
    createVehicle
    updateVehicle
    deleteVehicle

### Ownership Transfers
    getAllTransactions
    getAllOwnershipTransfers
    transferOwnership

