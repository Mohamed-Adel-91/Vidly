# Vidly

Back-End of Vidly Demo Movies Application using Node.js, Express.js, MongoDB and unit testing by jest and deployed by heroku .

steps :
1- create admin user
2- login
3- add customers
4- add genres
5- add a movie (with specific genreId)
6- rent the movie (using customerId and movieId)

## ---------- EndPoint -------------

## first you can find home page at this page

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/>

### API Documentation:-  

----------------- Users and Admins -----------------------------

**Post /api/users :** Register new user

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/users>

json{
        "name" : "Mohamed Adel" ,
        "email" : "<Mohamed@gmail.com>",
        "password" : "12345678"
    }

**Post /api/users/login :** login user

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/users/login>

json{
        "email" : "<Mohamed@gmail.com>",
        "password" : "12345678"
    }

and don't forget to add x-auth-token  in header with the token that return from server  after logged in .

**Get /api/users/me :** get user info

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/users/me>

just don't forget to add x-auth-token  in header with the token that return from server  after logged in .

----------------- Customers -----------------------------

**GET /api/customers :** Retrieve list of customers.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/customers/>

**Post /api/customers :** Add one customer.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/customers/>

json{
        "isGold" : "true",
        "name": "Mohamed Adel",
        "phone": "01067000662"
    }

**Put /api/customers/:id :** update one customer.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/customers/> + :id

don't forget to add id  at end of url for the customer who you want to update and add  x-auth-token  in header with the token that return from server  after logged in .

**Delete /api/customers/:id :** delete one customer.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/customers/> + :id

don't forget to add id  at end of url for the customer who you want to update and add  x-auth-token  in header with the token that return from server  after logged in and user must be admin to access this page.

------------------ Genre ----------------

**GET /api/genres :** Get a list of all genres.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/genres>

**POST /api/genres :** Create a new genre.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/genres>

json{
        "name" : "Comedy"
    }

and don't forget to add x-auth-token  in header with the token that return from server  after logged in.

**PUT /api/genres/:id :** Update genre.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/genres> + :id

json{
        "name" : "Horror"
    }

don't forget to add id  at end of url for the genre who you want to update and add  x-auth-token  in header with the token that return from server  after logged in .

**Delete /api/genres/:id :** delete one genre.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/genres/> + :id

don't forget to add id  at end of url for the genre who you want to update and
add  x-auth-token  in header with the token that return from server  after logged in and user must be admin to access this page.

------------------ Movie ----------------------------

**GET /api/movies:** Get a list of movies.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/movies>

**GET /api/movies/:id :** Get a movie by its ID.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/movies>

**POST /api/movies :** Create a new movie. Requires admin auth.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/movies>

json{
        "title": "G-I-Jo",
        "genreId": "65d1899db9c5d64039e95e3b",
        "numberInStock": 56,
        "dailyRentalRate": 7
    }

`x-auth-token` should be added to headers with admin user token.

**PUT /api/movies/:id :** Update movies.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/movies> + :id

json{
        "title" : "BatMan",
        "genreId": "65d1899db9c5d64039e95e3b",
        "numberInStock": 87,
        "dailyRentalRate": 9
    }

don't forget to add id  at end of url for the movies who you want to update and add  x-auth-token  in header with the token that return from server  after logged in .

**Delete /api/movies/:id :** delete one movies.

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/movies/> + :id

don't forget to add id  at end of url for the movies who you want to update and
add  x-auth-token  in header with the token that return from server  after logged in and user must be admin to access this page.

---------------------------------------------------

------------------- Rental ------------------------

---------------------------------------------------

**GET /api/rentals/ :** Get all rentals

- <https://vidly-app-24-3649c00ccbe9.herokuapp.com/api/rentals/>

`x-auth-token` should be added to headers with admin user token.

**GET /api/rentals/ :** Get rentals by Movie Id and Customer ID.

json{
        "customerId" : "65d214aec356916ae6182b5f",
        "movieId": "65d22021c356916ae6182b72"
    }
