const request = require("supertest");
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
        token = new User().generateAuthToken();
        customerId = new mongoose.Types.ObjectId().toHexString();
        movieId = new mongoose.Types.ObjectId().toHexString();
        rental = new Rental({
            customer: new Customer({
                _id: customerId,
                name: "TestCustomer",
                phone: "01234567890",
            }),
            movie: new Movie({
                _id: movieId,
                title: "TestMovie",
                dailyRentRate: 1.5,
            }),
        });
        await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
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
});
