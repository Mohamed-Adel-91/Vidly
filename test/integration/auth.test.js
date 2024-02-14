const { User } = require("../../models/user.schema");
const request = require("supertest");
const winston = require("winston");

let server;
describe("auth middleware", () => {
    beforeEach(() => {
        server = require("../../index");
        // Clear Winston transports before tests
        winston.clear();
    });
    afterEach(() => {
        server.close();
        // Clear Winston transports after tests
        winston.clear();
    });
    let token;

    const exec = () => {
        return request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({ name: "genre1" });
    };
    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it("should return 401 if no token is provided", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });
});
