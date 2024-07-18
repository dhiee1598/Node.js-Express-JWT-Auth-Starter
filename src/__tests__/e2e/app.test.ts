import request from "supertest";
import ExpressConfig from "../../app";
import env from "../../utilities/env";

const app = ExpressConfig();

describe("App", () => {
  describe("GET /main/healthcheck", () => {
    it("should response with a status code of 200", async () => {
      const { status, body, headers } = await request(app).get("/main/healthcheck");

      expect(headers["access-control-allow-origin"]).toBe(env.FRONTEND_URL);
      expect(headers["access-control-allow-credentials"]).toBe("true");
      expect(headers["content-type"]).toBe("application/json; charset=utf-8");
      expect(status).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body.message).toBe("HAPPY CODING - 👋✨🌍");
    });
  });

  describe("GET /random/routes", () => {
    it("should response with a status code of 404 Route not found", async () => {
      const { status, body, notFound } = await request(app).get("/random/routes");

      expect(status).toBe(404);
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("stacks");
      expect(body.message).toBe("Route not found: /random/routes");
      expect(notFound).toBe(true);
    });
  });
});
