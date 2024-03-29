const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre.schema");
const { User } = require("../../models/user.schema");

describe("/api/genres", () => {
    let server;
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await server.close();
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
        it("should return 404 if id invalid", async () => {
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });
        it("should return 404 if no genre with givin id", async () => {
            const id = new mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get("/api/genres/" + id);
            expect(res.status).toBe(404);
        });
    });

    describe("POST  /api/genres", () => {
        let token;
        let name;
        const executeCode = async () => {
            return await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name });
        };
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "genre1";
        });

        it("should return 401 if client not logged in", async () => {
            token = "";
            const res = await executeCode();
            expect(res.status).toBe(401);
        });

        it("should return 400 if genre less than 5  characters", async () => {
            name = "abcd";
            const res = await executeCode();
            expect(res.status).toBe(400);
        });

        it("should return 400 if genre more than 50  characters", async () => {
            name = Array(52).join("a");
            const res = await executeCode();
            expect(res.status).toBe(400);
        });

        it("should save the genre if it is valid", async () => {
            const res = await executeCode();
            const genre = await Genre.findById(res.body._id);
            expect(genre).not.toBeNull();
            expect(res.body.name).toBe(genre.name);
            expect(res.status).toEqual(200);
        });

        it("should return the genre if it is valid", async () => {
            const res = await executeCode();
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name");
        });
    });

    describe("PUT /:id", () => {
        let token;
        let newName;
        let genre;
        let id;

        const executedCode = async () => {
            return await request(server)
                .put("/api/genres/" + id)
                .set("x-auth-token", token)
                .send({ name: newName });
        };

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({ name: "genre1" });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = "updatedName";
        });

        it("should return 401 if client is not logged in", async () => {
            token = "";

            const res = await executedCode();

            expect(res.status).toBe(401);
        });

        it("should return 400 if genre is less than 5 characters", async () => {
            newName = "1234";

            const res = await executedCode();

            expect(res.status).toBe(400);
        });

        it("should return 400 if genre is more than 50 characters", async () => {
            newName = new Array(52).join("a");

            const res = await executedCode();

            expect(res.status).toBe(400);
        });

        it("should return 404 if id is invalid", async () => {
            id = 1;

            const res = await executedCode();

            expect(res.status).toBe(404);
        });

        it("should return 404 if genre with the given id was not found", async () => {
            id = new mongoose.Types.ObjectId();

            const res = await executedCode();

            expect(res.status).toBe(404);
        });

        it("should update the genre if input is valid", async () => {
            await executedCode();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(newName);
        });

        it("should return the updated genre if it is valid", async () => {
            const res = await executedCode();

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", newName);
        });
    });

    describe("DELETE /:id", () => {
        let token;
        let genre;
        let id;

        const executedCode = async () => {
            return await request(server)
                .delete("/api/genres/" + id)
                .set("x-auth-token", token)
                .send();
        };

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({ name: "genre1" });
            await genre.save();

            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        });

        it("should return 401 if client is not logged in", async () => {
            token = "";

            const res = await executedCode();

            expect(res.status).toBe(401);
        });

        it("should return 403 if the user is not an admin", async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await executedCode();

            expect(res.status).toBe(403);
        });

        it("should return 404 if id is invalid", async () => {
            id = 1;

            const res = await executedCode();

            expect(res.status).toBe(404);
        });

        it("should return 404 if no genre with the given id was found", async () => {
            id = new mongoose.Types.ObjectId();

            const res = await executedCode();

            expect(res.status).toBe(404);
        });

        it("should delete the genre if input is valid", async () => {
            await executedCode();

            const genreInDb = await Genre.findById(id);

            expect(genreInDb).toBeNull();
        });

        it("should return the removed genre", async () => {
            const res = await executedCode();
            expect(res.body.genre).not.toBeDefined();
        });
    });
});
