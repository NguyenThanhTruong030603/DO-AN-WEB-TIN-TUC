const request = require("supertest");
const { app, server } = require("../app"); // export từ app.js
const mongoose = require("mongoose");

describe("Test trang chủ", () => {
  it("GET / trả về mã 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  // ✅ Đóng kết nối MongoDB
  await mongoose.connection.close();

  // ✅ Đóng server Express đúng cách
  await new Promise((resolve) => server.close(resolve));
});
