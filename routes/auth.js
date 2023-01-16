// const { PrismaClient } = require("@prisma/client");

// const router = require("express").Router();

// // router.get("/", (req, res) => {
// //   res.send("auth Router");
// // });

// const prisma = new PrismaClient();

// //ユーザー情報の登録
// router.post("/register", async (req, res) => {
//     const { username, userId, email, password } = req.body;
//     const posts = await prisma.auth.create({
//       data: {
//         username: username,
//         userId: userId,
//         email: email,
//         password: password,
//       },
//     });
//     return res.json(posts);
// });

// module.exports = router;
