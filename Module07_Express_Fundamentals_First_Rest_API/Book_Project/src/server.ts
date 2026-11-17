import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is a route",
    author: "Abdur Rahim",
  });
});

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_snIlMtZ2jwK7@ep-damp-darkness-az53i6yu.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
});

// console.log(pool);

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT,
            is_Active BOOLEAN DEFAULT true,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            );
            `);

    console.log("Database Connected!!");
  } catch (error) {
    console.log(error);
  }
};

initDB();

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *`,
      [name, email, password, age],
    );
    console.log(result);
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    console.log(result);
    res.status(200).json({
      success: true,
      message: "Users Get Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error?.message,
      error: error,
    });
  }
});

// single user get;
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    console.log(result);
    res.status(200).json({
      success: true,
      message: "User Received successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

// Update user

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_Active } = req.body;
    const result = await pool.query(
      `UPDATE users
            SET
            name = COALESCE($1, name),
            password = COALESCE($2, password),
            age = COALESCE($3, age),
            is_Active = COALESCE($4, is_Active)
            update_at = NOW()
            WHERE id=$5 RETURNING *
            `,
      [name ?? null, password ?? null, age ?? null, is_Active ?? null, id],
    );

    if (result.rowCount === 0) {
      res.status(400).json({
        success: false,
        message: "User Update UnSuccessfully",
      });
    }

    res.status(201).json({
      success: true,
      message: "User Update successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM user WHERE id=$1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully!!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.listen(3000, () => {
  console.log("Book App is running");
});
