const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rental.schema");
const { User } = require("../../models/user.schema");
const { Customer } = require("../../models/customer.schema");
const { Movie } = require("../../models/movie.schema");

describe("/api/returns", () => {
    let server;
    let token;
    let customerId;
    let movieId;
    let movie;
    let rental;
    const executeCode = async () => {
        return await request(server)
            .post("/api/returns")
            .set("x-auth-token", token)
            .send({
                customerId: customerId,
                movieId: movieId,
            });
    };
    beforeEach(async () => {
        server = require("../../index");
        customerId = new mongoose.Types.ObjectId().toHexString();
        movieId = new mongoose.Types.ObjectId().toHexString();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: "TestMovie",
            dailyRentalRate: 2,
            genre: { name: "Action" },
            numberInStock: 10,
        });
        await movie.save();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: "TestCustomer",
                phone: "01234567890",
            },
            movie: {
                _id: movieId,
                title: "TestMovie",
                dailyRentalRate: 2,
            },
        });
        await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    it("should return rental not to be null", async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });
    it("Return 401 if client is not logged in", async () => {
        token = "";
        const res = await executeCode();
        expect(res.status).toEqual(401);
    });
    it("Return 400 if customerId is not provided", async () => {
        customerId = "";
        const res = await executeCode();
        expect(res.status).toEqual(400);
    });
    it("Return 400 if movieId is not provided", async () => {
        movieId = "";
        const res = await executeCode();
        expect(res.status).toEqual(400);
    });
    it("Return 400 if no parameters in the body req", async () => {
        movieId = null;
        customerId = null;
        const res = await executeCode();
        expect(res.status).toEqual(400);
    });
    it("Return 404 if no rental found for this customer/movie", async () => {
        await Rental.deleteMany({});
        const res = await executeCode();
        expect(res.status).toEqual(404);
    });
    it("Return 400 if already renting this movie", async () => {
        rental.dateReturned = new Date(); // set date returned as today so that the book can be rented again
        await rental.save();
        const res = await executeCode();
        expect(res.status).toEqual(400);
    });
    it("If all checks pass, return 200 with the rental object if valid request", async () => {
        const res = await executeCode();
        expect(res.status).toEqual(200);
    });
    it("set the return date if input is valid", async () => {
        const res = await executeCode();
        const rentalFromDB = await Rental.findById(rental._id);
        const diffTime = new Date() - rentalFromDB.dateReturned;
        expect(diffTime).not.toBeNaN();
        expect(diffTime).toBeLessThan(10 * 1000);
        expect(rentalFromDB.dateReturned).not.toBeNull();
        expect(rentalFromDB.dateReturned).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("set the return rentalFees if input is valid", async () => {
        rental.dateOut = moment().add(-7, "days").toDate(); // set date out to be seven days ago
        await rental.save();
        const res = await executeCode();
        const rentalFromDB = await Rental.findById(rental._id);
        // Calculate expected rentalFee based on the daily rental rate and number of days
        const rentalDays = moment().diff(rental.dateOut, "days");
        const expectedRentalFee = rental.movie.dailyRentalRate * rentalDays;
        expect(rentalFromDB.rentalFee).toBe(expectedRentalFee);
        expect(rentalFromDB.rentalFee).toEqual(14);
        expect(res.status).toEqual(200);
    });
    it("Increase the stock of movie after rent it", async () => {
        const res = await executeCode();
        const movieFromDB = await Movie.findById(movieId);
        expect(movieFromDB.numberInStock).toBe(movie.numberInStock + 1);
        expect(res.status).toEqual(200);
    });
    it("Return the rental if valid", async () => {
        const res = await executeCode();
        const rentalFromDB = await Rental.findById(rental._id);
        // expect(res.body).toMatchObject(rentalFromDB.$getAllSubdocs());
        // expect(res.body).toMatchObject(rentalFromDB.toJSON());
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining([
                "_id",
                "customer",
                "movie",
                "dateOut",
                "dateReturned",
                "rentalFee",
            ])
        );

        expect(res.status).toEqual(200);
    });
});
