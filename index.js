const express = require("express");
const shortid = require("shortid");

const server = express();

// teaches express how to read JSON form req.body
server.use(express.json());

let users = [
  {
    id: shortid.generate(), // hint: use the shortid npm package to generate it
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane", // String, required
  },
];

// build endpoints

server.get("/api/users", (req, res) => {
    if(users){ // does this work to see 'if there's an error in retrieving the _users_ from the database'?
    res.json(users); 
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
})


// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_.

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ errorMessage: "There was an error while saving the user to the database" }`

server.post("/api/users", (req, res) => {
    if(!req.body.name || !req.body.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
    } 
    if(req.body.name !== undefined || req.body.bio !== undefined){
        const newUser = req.body; 
        newUser.id = shortid.generate(); 
        users.push(newUser); 
        res.status(201).json(newUser); 
        if(!res){ // what condition would show an error while saving the user? simple way to do this? 
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database"})
        }
    }
   
})

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in retrieving the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user information could not be retrieved." }`.

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id; 
    const selected = users.find(user => user.id === id);
    
    if(!selected){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
        res.status(201).json(selected)
    }

    if(!res){ // ? 
        res.status(500).json({ errorMessage: "The user information could not be retrieved."})
    }
})

// <!-- When the client makes a `DELETE` request to `/api/users/:id`: -->

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user could not be removed" }`.

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id; 
    const deleted = users.find(user => user.id === id); 

    if(!deleted){
        res.status(404).json({message: "The user with the specified ID does not exist."})
    } else {
        users = users.filter(user => user.id !== id)
        res.status(201).json(deleted);
    }

    if(!res){ //?
        res.status(500).json({ errorMessage: "The user could not be removed"  })
    }
});

// <!-- When the client makes a `PUT` request to `/api/users/:id`: -->

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide name and bio for the user." }`.

// - If there's an error when updating the _user_:

//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user information could not be modified." }`.

// - If the user is found and the new information is valid:

//   - update the user document in the database using the new information sent in the `request body`.
//   - respond with HTTP status code `200` (OK).
//   - return the newly updated _user document_.

server.put("/api/users/:id", (req, res) => {
    const id = req.body.id; 
    const changes = req.body; 
    const updated = users.find(user => user.id === id)

    if (!updated){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else if( req.body.name === undefined || req.body.bio === undefined) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." }) 
    } else {
        Object.assign(updated, changes);
        res.status(200).json(updated);
    }

})

//

const PORT = 7000; // we visit http://localhost:7000/ to see the api
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
