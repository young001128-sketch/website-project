const express = require("express");
const db = require("./database");

const app = express();
const missingTrip = { error: "여행을 찾을 수 없습니다." };
const invalidTrip = { error: "여행지와 올바른 시작일·종료일을 입력하세요." };

const listTrips = db.prepare("SELECT id, destination, startDate, endDate FROM trips ORDER BY id");
const findTrip = db.prepare("SELECT id, destination, startDate, endDate FROM trips WHERE id = ?");
const createTrip = db.prepare(`
  INSERT INTO trips (destination, startDate, endDate) VALUES (?, ?, ?)
  RETURNING id, destination, startDate, endDate
`);
const updateTrip = db.prepare(`
  UPDATE trips SET destination = ?, startDate = ?, endDate = ? WHERE id = ?
  RETURNING id, destination, startDate, endDate
`);
const deleteTrip = db.prepare("DELETE FROM trips WHERE id = ?");

function isCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function tripValues({ destination, startDate, endDate }) {
  if (
    typeof destination !== "string" ||
    !destination.trim() ||
    !isCalendarDate(startDate) ||
    !isCalendarDate(endDate) ||
    startDate > endDate
  ) {
    return null;
  }
  return [destination.trim(), startDate, endDate];
}

app.get("/hello", (req, res) => {
  res.json({ message: "나의 첫 번째 API 성공!" });
});

app.use(express.json());

app.post("/api/trips/budget", (req, res) => {
  const { hotel, food, transport, people } = req.body ?? {};

  if (
    ![hotel, food, transport].every(cost => Number.isFinite(cost) && cost >= 0) ||
    !Number.isInteger(people) ||
    people < 1
  ) {
    return res.status(400).json({ error: "올바른 경비와 인원수를 입력하세요." });
  }

  const total = hotel + food + transport;
  res.json({ total, perPerson: total / people });
});

app.post("/api/trips", (req, res) => {
  const values = tripValues(req.body ?? {});
  if (!values) {
    return res.status(400).json(invalidTrip);
  }

  const trip = createTrip.get(...values);
  res.location(`/api/trips/${trip.id}`).status(201).json(trip);
});

app.get("/api/trips", (req, res) => {
  res.json(listTrips.all());
});

app.param("id", (req, res, next, value) => {
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "여행 ID는 양의 정수여야 합니다." });
  }

  res.locals.tripId = id;
  next();
});

app.get("/api/trips/:id", (req, res) => {
  const trip = findTrip.get(res.locals.tripId);
  if (!trip) {
    return res.status(404).json(missingTrip);
  }
  res.json(trip);
});

app.put("/api/trips/:id", (req, res) => {
  const values = tripValues(req.body ?? {});
  if (!values) {
    return res.status(400).json(invalidTrip);
  }

  const trip = updateTrip.get(...values, res.locals.tripId);
  if (!trip) {
    return res.status(404).json(missingTrip);
  }
  res.json(trip);
});

app.delete("/api/trips/:id", (req, res) => {
  const result = deleteTrip.run(res.locals.tripId);
  if (result.changes === 0) {
    return res.status(404).json(missingTrip);
  }
  res.json({ message: "여행 삭제 완료" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ error: "요청 형식이 올바르지 않습니다." });
  }

  console.error(error);
  res.status(500).json({ error: "요청을 처리하지 못했습니다." });
});

const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, error => {
  if (error) {
    console.error("서버 시작 실패", error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`서버 실행 중! 포트: ${server.address().port}`);
});
