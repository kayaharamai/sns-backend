const { PrismaClient } = require("@prisma/client");

const express = require("express");
const app = express();
const PORT = 8000;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const prisma = new PrismaClient();

//json形式で扱うという宣言
app.use(express.json());

//ユーザー情報の登録
app.post("/register", async (req, res) => {
  const { username, userId, email, password } = req.body;
  const user = await prisma.user.create({
    data: {
      username: username,
      userId: userId,
      email: email,
      password: password,
    },
  });
  return res.json(user);
});

//ログイン
app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).send("ユーザーが見つかりません");
  const vaildPassword = req.body.password === user.password;
  if (!vaildPassword) return res.status(400).json("入力情報に誤りがあります");
  return res.status(200).json(user);
});

//全ての投稿データの取得
app.get("/post", async (req, res) => {
  const user = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comment: true,
      likes: true,
    },
  });
  return res.json(user);
});

//フォローしているユーザーの取得

//条件に一致したユーザーの取得
app.post("/user", async (req, res) => {
  const { userId } = req.body;
  const user = await prisma.user.findMany({
    where: {
      OR: [{ userId: userId }],
    },
  });
  return res.status(200).json(user);
});

//全てのユーザーの取得
app.get("/users/all", async (req, res) => {
  const userAll = await prisma.user.findMany();
  return res.status(200).json(userAll);
});

// //特定の投稿データの取得
// app.get("/post/:id", async (req, res) => {
//   const singlePost = await prisma.post.findUnique({
//     where: {
//       id: Number(req.params.id),
//     },
//   });
//   if (!singlePost) {
//     return res.status(404).send("投稿が見つかりません");
//   } else {
//     return res.status(200).json(singlePost);
//   }
//   // const vaildPassword = req.body.password === user.password;
//   // if (!vaildPassword) return res.status(400).json("パスワードが違います");
// });

//特定のユーザーを取得（投稿も含む）
app.get("/profile/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      followings: true,
      followers: true,
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          likes: true,
          comment: true,
        },
      },
    },
  });
  return res.status(200).json(user);
});

//特定の投稿のコメント、いいねを含む投稿を取得
app.get("/post/:id", async (req, res) => {
  const post = await prisma.post.findMany({
    where: {
      id: Number(req.params.id),
    },
    include: {
      comment: true,
      likes: true,
    },
  });
  return res.status(200).json(post);
});

//ユーザー情報の更新
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { userId, username, email, password } = req.body;
  const updateData = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      userId: userId,
      username: username,
      email: email,
      password: password,
    },
  });
  return res.status(200).json(updateData);
});

//特定の投稿データの取得（フォローしている）

//特定の投稿データの削除
app.delete("/post/:id", async (req, res) => {
  const post = await prisma.post.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("投稿が削除されました");
});

//ユーザーの削除
app.delete("/user/:id", async (req, res) => {
  const user = await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("ユーザーが削除されました");
});

// //特定の投稿にいいねを押す
// app.post("/post/:id/like", async (req, res) => {
//   // const post = await prisma.post.findUnique({ id: req.params.id });
//   const id = req.params.id;
//   const { authorId,likeId } = req.body;
//   const likePost = await prisma.likes.create({
//     data: {
//       authorId: Number(authorId),
//       likeId: Number(likeId),
//     },
//   });
//   return res.status(200).json(likePost);
//   // if(!post.likes.includes(req.body.userId)) {
//   //   await prisma.like.update({})
//   // }
// });

//いいね
app.post("/post/like", async (req, res) => {
  const id = req.params.id;
  const { authorId, likes } = req.body;
  const likePost = await prisma.post.findMany({
    where: {
      likes: {
        contains: "tanaka_sns",
      },
    },
  });
  return res.status(200).json(likePost);
});

// app.post("/post/:id/like", async (req, res) => {
//   const { likes, likeId } = req.body;
//   const id = req.params.id;
//   const likePost = await prisma.likes.upsert({
//     where: { likes: "user_sns" },
//     create: {
//       likes: "user_sns",
//       likeId: Number(2),
//     },
//     update: {
//       likes: "",
//       likeId: Number(""),
//     },
//   });
//   return res.status(200).json("投稿にいいねを押しました!");
// });

//特定の投稿にコメントをする
app.post("/post/:id/comment", async (req, res) => {
  const { comment, postId, userId, username } = req.body;
  const newComment = await prisma.comment.create({
    data: {
      comment: comment,
      postId: Number(postId),
      userId: userId,
      username: username,
      createdAt: req.createdAt,
    },
  });
  return res.status(200).json("投稿にコメントしました");
});

//特定のユーザーとして投稿
app.post("/post", async (req, res) => {
  const { desc, img, authorId, userId, username } = req.body;
  const newPost = await prisma.post.create({
    data: {
      desc: desc,
      img: img,
      authorId: Number(authorId), //authorIdをuserIdにできるか？（する必要はあるか）、投稿者のuserと紐づくid
      userId: userId,
      username: username,
      createdAt: req.createdAt,
    },
  });
  return res.status(200).json("投稿できました");
});

//フォローする
app.post("/following", async (req, res) => {
  const { followId, userId } = req.body;
  const follow = await prisma.followings.create({
    data: {
      followId: Number(followId), //フォローした自分のuserと紐づくid
      userId: userId, //フォローする相手
    },
  });
  return res.status(200).json("フォローしました");
});

//フォローされる
app.post("/follower", async (req, res) => {
  const { followerId, userId } = req.body;
  const follower = await prisma.followers.create({
    data: {
      followerId: Number(followerId), //フォローされた人のuserと紐づくid
      userId: userId, //フォローしてきた人
    },
  });
  return res.status(200).json("フォローされました");
});

//フォロー解除する
app.post("/following/search", async (req, res) => {
  const { userId, id } = req.body;
  const followUser = await prisma.followings.findMany({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          followId: Number(id),
        },
      ],
    },
  });
  return res.status(200).json(followUser);
});

app.delete("/followings/:id", async (req, res) => {
  // const { id, userId } = req.body;
  const followDelete = await prisma.followings.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("フォローを外しました");
});

//フォロー解除される
app.post("/follower/search", async (req, res) => {
  const { userId, id } = req.body;
  const followerUser = await prisma.followers.findMany({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          followerId: Number(id),
        },
      ],
    },
  });
  return res.status(200).json(followerUser);
});

app.delete("/follower/:id", async (req, res) => {
  const followerDelete = await prisma.followers.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("フォローが外されました")
});

//投稿のコメントを取得
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });
  return res.status(200).json(users);
});

//自分がいいねを押した投稿を取得
app.get("/like/all", async (req, res) => {
  const { userId } = req.body;
  const likeAll = await prisma.post.findMany({
    include: {
      likes: {
        where: {
          likes: userId,
        },
      },
    },
  });
  return res.status(200).json(likeAll);
});

//ユーザーを探す
app.post("/user/find", async (req, res) => {
  const { userId } = req.body;
  const result = await prisma.user.findMany({
    where: {
      userId: {
        contains: userId,
      },
    },
  });
  return res.status(200).json(result);
});

// //ミドルウェア
// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/posts", postRoute);

app.listen(PORT, () => {
  console.log("サーバーが起動中です...");
});
