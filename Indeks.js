const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const port = 4444;
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem"), // putanja do tvog private key fajla
  cert: fs.readFileSync("cert.pem"), // putanja do tvog certifikata
};

app.use(express.json());

const allowedOrigins = ["http://localhost:9000", "https://localhost:9000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // za curl/postman ili isti origin
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = "tajnikljuc21";

const connection = mysql.createConnection({
  host: "student.veleri.hr",
  user: "isvalina",
  password: "11",
  database: "isvalina",
});

connection.connect(function (err) {
  if (err) {
    console.error("Failed to connect to the database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Middleware za provjeru JWT tokena
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token za provjeru:", token);

  if (!token) {
    console.log("Token nije poslan!");
    return res.status(401).json({ message: "Token nije poslan" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("Token nevaljan:", err.message);
      return res
        .status(401)
        .json({ message: "Token nije validan ili je istekao" });
    }

    console.log("Token validan za korisnika:", user);
    req.user = {
      username: user.username,
      uloga: user.uloga,
    };
    next();
  });
}

function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ message: "Niste autorizirani." });
  }

  if (req.user.uloga !== "Trener") {
    return res.status(403).send({ message: "Nemaš prava pristupa." });
  }

  next();
}

// Registracija korisnika
app.post("/register", (req, res) => {
  const { username, lozinka, ime, prezime, email, uloga } = req.body;
  console.log("Registracija pokrenuta za:", username);

  if (!username || !lozinka || !uloga) {
    return res
      .status(400)
      .json({ message: "Korisničko ime, lozinka i uloga su obavezni" });
  }

  const allowedRoles = ["Korisnik", "Trener"];
  if (!allowedRoles.includes(uloga)) {
    return res.status(400).json({ message: "Nevažeća uloga" });
  }

  connection.query(
    "SELECT Username FROM KorisnikTA WHERE Username = ?",
    [username],
    async (err, rows) => {
      if (err) {
        console.error("SQL greška pri proveri korisnika:", err);
        return res.status(500).json({ message: "Greška na serveru" });
      }
      if (rows.length > 0) {
        console.log("Korisnik već postoji:", username);
        return res.status(409).json({ message: "Korisnik već postoji" });
      }

      const hashedPassword = await bcrypt.hash(lozinka, 10);

      connection.query(
        "INSERT INTO KorisnikTA (Username, Ime, Prezime, Email, Lozinka, Uloga) VALUES (?, ?, ?, ?, ?, ?)",
        [
          username,
          ime || null,
          prezime || null,
          email || null,
          hashedPassword,
          uloga,
        ],
        (err) => {
          if (err) {
            console.error("SQL greška pri ubacivanju korisnika:", err);
            return res.status(500).json({ message: "Greška na serveru" });
          }
          console.log("Korisnik uspešno registriran:", username);
          res.status(201).json({
            message: `Korisnik uspešno registriran sa ulogom ${uloga}`,
          });
        }
      );
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, lozinka } = req.body;
  if (!username || !lozinka)
    return res.status(400).json({ message: "Nedostaju podaci" });

  connection.query(
    "SELECT * FROM KorisnikTA WHERE Username = ?",
    [username],
    async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Greška na serveru" });
      }
      if (rows.length === 0) {
        return res.status(401).json({ message: "Korisnik nije pronađen" });
      }

      const korisnik = rows[0];
      const passwordIsValid = await bcrypt.compare(lozinka, korisnik.Lozinka);
      if (!passwordIsValid) {
        return res.status(401).json({ message: "Pogrešna lozinka" });
      }

      const token = jwt.sign(
        { username: korisnik.Username, uloga: korisnik.Uloga },
        secretKey,
        { expiresIn: "1h" }
      );
      res.json({ token });
    }
  );
});

// Dodavanje recenzije
app.post("/api/recenzije", verifyToken, (req, res) => {
  const { autor, tekst } = req.body;

  const query = `INSERT INTO RecenzijeTA (Tekst_recenzije, Autor_recenzije) VALUES (?, ?)`;

  connection.query(query, [tekst, autor], (err) => {
    if (err)
      return res.status(500).json({ message: "Greška pri unosu recenzije." });
    res.status(200).json({ message: "Recenzija dodana!" });
  });
});

// Dohvati korisnike
app.get("/api/users", verifyToken, verifyAdmin, (req, res) => {
  const query = "SELECT Username, Ime, Prezime, Email FROM KorisnikTA";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Greška prilikom dohvaćanja korisnika:", err);
      return res
        .status(500)
        .json({ message: "Greška prilikom dohvaćanja korisnika" });
    }
    res.status(200).json(results);
  });
});

// Dodavanje vježbe
app.post("/api/dodajVjezbu", verifyToken, verifyAdmin, (req, res) => {
  const { naziv, opis, kategorija, autor } = req.body;
  const query = `
    INSERT INTO VježbaTA (Naziv_vježbe, Opis_vježbe, Kategorija_vježbe, Autor_vježbe)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [naziv, opis, kategorija, autor], (err) => {
    if (err) return res.status(500).json({ message: "Greška pri unosu." });
    res.status(201).json({ message: "Vježba dodana!" });
  });
});

// Dodavanje plana (zaštićena ruta - samo treneri)
app.post("/api/planovi", verifyToken, verifyAdmin, (req, res) => {
  // Dohvati username prijavljenog korisnika iz tokena (koji je u req.user)
  const autor = req.user.username;

  const { nazivPlana, opisPlana, vjezbe } = req.body;

  if (!nazivPlana || !opisPlana) {
    return res.status(400).json({ message: "Naziv i opis su obavezni." });
  }

  const insertPlanQuery = `
    INSERT INTO Plan_TreningaTA (Naziv_plana, Opis_plana, Autor_plana)
    VALUES (?, ?, ?)
  `;

  connection.query(insertPlanQuery, [nazivPlana, opisPlana, autor], (err) => {
    if (err) {
      console.error("Greška kod dodavanja plana:", err);
      return res.status(500).json({ message: "Greška kod plana" });
    }

    const insertVjezbePromises = vjezbe.map((v, index) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `
          INSERT INTO Vježba_u_planu (Naziv_plana, Naziv_vježbe, Redni_broj)
          VALUES (?, ?, ?)
          `,
          [nazivPlana, v, index + 1],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    Promise.all(insertVjezbePromises)
      .then(() => {
        res.status(201).json({ message: "Plan uspješno kreiran!" });
      })
      .catch((err) => {
        console.error("Greška kod vježbi:", err);
        res.status(500).json({ message: "Greška kod vježbi u planu" });
      });
  });
});

// Dohvati sve vježbe, opcionalno filtrirane po kategoriji
app.get("/api/vjezbe", verifyToken, (req, res) => {
  const kategorija = req.query.kategorija;
  let sql = "SELECT Naziv_vježbe, Opis_vježbe, Kategorija_vježbe FROM VježbaTA";
  let params = [];

  if (kategorija && kategorija !== "Sve") {
    sql += " WHERE Kategorija_vježbe = ?";
    params.push(kategorija);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Greška u dohvatu vježbi:", err);
      return res.status(500).json({ message: "Greška na serveru." });
    }

    // Mapiranje rezultata u frontend-friendly oblik
    const vjezbe = results.map((v) => ({
      naziv: v.Naziv_vježbe,
      opis: v.Opis_vježbe,
      kategorija: v.Kategorija_vježbe,
    }));

    res.json(vjezbe);
  });
});

// Dohvati sve jedinstvene kategorije iz tablice VježbaTA
app.get("/api/kategorije", verifyToken, (req, res) => {
  const sql =
    "SELECT DISTINCT Kategorija_vježbe FROM VježbaTA WHERE Kategorija_vježbe IS NOT NULL AND Kategorija_vježbe != ''";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Greška u dohvatu kategorija:", err);
      return res.status(500).json({ message: "Greška na serveru." });
    }

    const kategorije = results.map((r) => r.Kategorija_vježbe);
    res.json(kategorije);
  });
});

app.get("/api/trening-planovi", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      p.Naziv_plana,
      p.Opis_plana,
      p.Autor_plana,
      v.Naziv_vježbe,
      v.Opis_vježbe,
      v.Kategorija_vježbe,
      vp.Redni_broj
    FROM Plan_TreningaTA p
    LEFT JOIN Vježba_u_planu vp ON p.Naziv_plana = vp.Naziv_plana
    LEFT JOIN VježbaTA v ON vp.Naziv_vježbe = v.Naziv_vježbe
    ORDER BY p.Naziv_plana, vp.Redni_broj
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Greška pri dohvatu planova:", err);
      return res.status(500).json({ message: "Greška na serveru" });
    }

    const planoviMap = new Map();

    results.forEach((row) => {
      if (!planoviMap.has(row.Naziv_plana)) {
        planoviMap.set(row.Naziv_plana, {
          naziv: row.Naziv_plana,
          opis: row.Opis_plana,
          autor: row.Autor_plana || "Nepoznat", // fallback ako je NULL
          vjezbe: [],
        });
      }
      if (row.Naziv_vježbe) {
        planoviMap.get(row.Naziv_plana).vjezbe.push({
          naziv: row.Naziv_vježbe,
          opis: row.Opis_vježbe,
          kategorija: row.Kategorija_vježbe,
        });
      }
    });

    const planoviArray = Array.from(planoviMap.values());
    console.log("Poslani planovi:", planoviArray); // debug
    res.json(planoviArray);
  });
});

app.get("/api/statistika", verifyToken, verifyAdmin, (req, res) => {
  const sqlKorisnici = "SELECT COUNT(*) AS count FROM KorisnikTA";
  const sqlVjezbe = "SELECT COUNT(*) AS count FROM VježbaTA";
  const sqlPlanovi = "SELECT COUNT(*) AS count FROM Plan_TreningaTA";

  connection.query(sqlKorisnici, (err1, resKorisnici) => {
    if (err1) {
      console.error(err1);
      return res.status(500).json({ message: "Greška na serveru" });
    }

    connection.query(sqlVjezbe, (err2, resVjezbe) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Greška na serveru" });
      }

      connection.query(sqlPlanovi, (err3, resPlanovi) => {
        if (err3) {
          console.error(err3);
          return res.status(500).json({ message: "Greška na serveru" });
        }

        res.json({
          korisnici: resKorisnici[0].count,
          vjezbe: resVjezbe[0].count,
          planovi: resPlanovi[0].count,
        });
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Backend radi - HTTPS server je aktivan!");
});

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on port ${port}`);
});
