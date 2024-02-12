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
});
