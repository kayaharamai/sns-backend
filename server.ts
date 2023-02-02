const { PrismaClient } = require("@prisma/client");
import { Request, Response } from "express";

const express = require("express");
const app = express();
const PORT = 8000;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const prisma = new PrismaClient();

//json形式で扱うという宣言
app.use(express.json());

//Register
//ユーザー情報の登録
app.post("/register", async (req: Request, res: Response) => {
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

//Login
//ログイン
app.post("/login", async (req: Request, res: Response) => {
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

//データ取得
//全ての投稿データの取得
app.get("/post", async (req: Request, res: Response) => {
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

//条件に一致したユーザーの取得
app.post("/user", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = await prisma.user.findMany({
    where: {
      OR: [{ userId: userId }],
    },
  });
  return res.status(200).json(user);
});

//全てのユーザーの取得
app.get("/users/all", async (req: Request, res: Response) => {
  const userAll = await prisma.user.findMany();
  return res.status(200).json(userAll);
});

//特定のユーザーを取得（投稿も含む）
app.get("/profile/:id", async (req: Request, res: Response) => {
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
app.get("/post/:id", async (req: Request, res: Response) => {
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

//投稿のコメントを取得
app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });
  return res.status(200).json(users);
});

//更新
//ユーザー情報の更新
app.put("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { desc } = req.body;
  const updateData = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      desc: desc,
    },
  });
  return res.status(200).json(updateData);
});

//削除
//特定の投稿データの削除
app.delete("/post/:id", async (req: Request, res: Response) => {
  const post = await prisma.post.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("投稿が削除されました");
});

//ユーザーの削除
app.delete("/user/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("ユーザーが削除されました");
});

//データ送信
//特定の投稿にコメントをする
app.post("/post/:id/comment", async (req: Request, res: Response) => {
  const { comment, postId, userId, username } = req.body;
  const newComment = await prisma.comment.create({
    data: {
      comment: comment,
      postId: Number(postId),
      userId: userId,
      username: username,
      // createdAt: req.createdAt,
    },
  });
  return res.status(200).json("投稿にコメントしました");
});

//特定のユーザーとして投稿
app.post("/post", async (req: Request, res: Response) => {
  const { desc, img, authorId, userId, username } = req.body;
  const newPost = await prisma.post.create({
    data: {
      desc: desc,
      img: img,
      authorId: Number(authorId), //authorIdをuserIdにできるか？（する必要はあるか）、投稿者のuserと紐づくid
      userId: userId,
      username: username,
      // createdAt: req.createdAt,
    },
  });
  return res.status(200).json("投稿できました");
});

//いいねをする
app.post("/post/:id/like", async (req: Request, res: Response) => {
  const { likeId, userId, authorId } = req.body;
  const likePost = await prisma.likes.create({
    data: {
      likeId: Number(likeId), //投稿と紐づくId
      likes: userId, //いいねをしたuser
      authorId: Number(authorId), //いいねをしたuser
    },
  });
  return res.status(200).json(likePost);
});

//いいねを解除する
app.post("/post/like/search", async (req: Request, res: Response) => {
  const { likeId, userId } = req.body;
  const likePost = await prisma.likes.findMany({
    where: {
      AND: [
        {
          likeId: Number(likeId),
        },
        {
          likes: userId,
        },
      ],
    },
  });
  return res.status(200).json(likePost);
});

app.delete("/post/:id/like", async (req: Request, res: Response) => {
  const likePost = await prisma.likes.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("いいねを外しました");
});

//フォローする
app.post("/following", async (req: Request, res: Response) => {
  const { followId, userId,followerId } = req.body;
  const follow = await prisma.followings.create({
    data: {
      followId: Number(followId), //フォローした自分のuserと紐づくid
      userId: userId, //フォローする相手
      followerId: followerId //フォローする相手のid

    },
  });
  return res.status(200).json("フォローしました");
});

//フォローされる
app.post("/follower", async (req: Request, res: Response) => {
  const { followerId, userId,followId } = req.body;
  const follower = await prisma.followers.create({
    data: {
      followerId: Number(followerId), //フォローされた人のuserと紐づくid
      userId: userId, //フォローしてきた人
      followId: followId //フォローする人のid
    },
  });
  return res.status(200).json("フォローされました");
});

//フォロー解除する
app.post("/following/search", async (req: Request, res: Response) => {
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

app.delete("/followings/:id", async (req: Request, res: Response) => {
  // const { id, userId } = req.body;
  const followDelete = await prisma.followings.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("フォローを外しました");
});

//フォロー解除される
app.post("/follower/search", async (req: Request, res: Response) => {
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

app.delete("/follower/:id", async (req: Request, res: Response) => {
  const followerDelete = await prisma.followers.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.status(200).json("フォローが外されました");
});

//ユーザーを探す
app.post("/user/find", async (req: Request, res: Response) => {
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

// //自分がいいねをした投稿を探す
// app.post("/post/find", async (req: Request, res: Response) => {
//   const { userId } = req.body;
//   const result = await prisma.post.findMany({
//     where: {
//       likes: {
//         some: {
//           likes: {
//             contains: userId,
//           }
//         }
//       }
//     },
//     include: {
//           likes: true,
//           comment: true,
//         },
//   });
//   return res.status(200).json(result);
// });

//自分がいいねした投稿を探す
app.post("/post/find", async (req: Request, res: Response) => {
  const { authorId } = req.body;
  const result = await prisma.post.findMany({
    where : {
      likes: {
        some: {authorId: Number(authorId)}
      }
    },
    include: {
      likes: true,
      comment: true
    }
  });
  return res.json(result)
});

// //ミドルウェア
// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/posts", postRoute);

app.listen(PORT, () => {
  console.log("サーバーが起動中です...");
});
