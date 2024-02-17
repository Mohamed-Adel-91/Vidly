const request = require("supertest");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rental.schema");
const { Customer } = require("../../models/customer.schema");
const { Movie } = require("../../models/movie.schema");

describe("/api/returns", () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    beforeEach(async () => {
        server = require("../../index");
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

    describe("GET /api/rentals - Get all rentals", () => {
        it("should return rental not to be null", async () => {
            const result = await Rental.findById(rental._id);
            expect(result).not.toBeNull();
        });
        it("Return 401 if client is not logged in", async () => {
            const res = await request(server).post("/api/returns").send({
                customerId: customerId,
                movieId: movieId,
            });
            expect(res.status).toEqual(401);
        });
    });
});
