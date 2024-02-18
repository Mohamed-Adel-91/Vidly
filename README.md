# Vidly

Back-End of Vidly Demo Movies Application using Node.js, Express.js, MongoDB and unit testing

## ---------- EndPoint -------------

## first you can find home page at this page

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/>

### API Documentation:-  

----------------- Users and Admins -----------------------------

**Post /api/users :** Register new user

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/users>

{
    "name" : "Mohamed Adel" ,
    "email" : "Mohamed@gmail.com",
    "password" : "12345678"
}

**Post /api/users/login :** login user

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/users/login>
{
    "email" : "Mohamed@gmail.com",
    "password" : "12345678"
}
and don't forget to add x-auth-token  in header with the token that return from server  after logged in .

**Get /api/users/me :** get user info

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/users/me>

just don't forget to add x-auth-token  in header with the token that return from server  after logged in .


----------------- Customers -----------------------------

**GET /api/movies :** Retrieve list of movies.

- <http://localhost:3000/api/customers/>
{
    "isGold" : "true",
    "name": "Mohamed Adel",
    "phone": "01067000662"
}

- <http://localhost:3000/api/genres>
{
    "name" : "Comedy"
}

- <http://localhost:3000/api/movies/>
{
    "title": "x-man",
    "genreId": "65a56370b4960a028854d10b",
    "numberInStock": 3,
    "dailyRentalRate": 5
}

- <http://localhost:3000/api/rentals/>
{
    "customerId" : "65b9265fcc0b20f1b14565a8",
    "movieId": "65b927fd4759e259b830d63e"
}
