const request = require("supertest");
const { Genre } = require("../../models/genre.schema");
const { User } = require("../../models/user.schema");

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

    describe("POST  /api/genres", () => {
        it("should return 401 if client not logged in", async () => {
            const res = await request(server)
                .post("/api/genres")
                .send({ name: "test" });
            expect(res.status).toBe(401);
        });

        it("should return 400 if genre less than 5  characters", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "test" });
            expect(res.status).toBe(400);
        });

        it("should return 400 if genre more than 50  characters", async () => {
            const token = new User().generateAuthToken();
            const longString = Array(52).join("a");
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: `${longString}` });
            expect(res.status).toBe(400);
        });

        it("should save the genre if it is valid", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "genre1" });
            const genre = await Genre.findById(res.body._id);
            expect(genre).not.toBeNull();
            expect(res.body.name).toBe(genre.name);
            expect(res.status).toEqual(200);
        });

        it("should return the genre if it is valid", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "genre1" });
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name");
        });
    });
});
