const request = require("supertest");
const { Genre } = require("../../models/genre.schema");

let server;

describe("/api/genres", () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });

    describe("GET /api/genres - Get all genres", () => {
        it("should return a list of genres", async () => {
            await Genre.collection.insertMany([
                { name: "Action" },
                { name: "Drama" },
            ]);
            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === "Action")).toBeTruthy();
            expect(res.body.some((g) => g.name === "Drama")).toBeTruthy();
        });
    });

    describe("GET  /api/genres/:id", () => {
        it("should return a single genre by id if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server).get("/api/genres/" + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
        it("should return 404 if id is not found in database or invalid", async () => {
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });
    });
});
