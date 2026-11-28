import { pool } from "../../config/db";
import type { Event } from "./event.interface";

const createEventIntroDB = async (payload: Event, organizerId: number) => {
  const { title, description, category, date, location, total_seats, price } =
    payload;

  const organizer = await pool.query(
    ` SELECT * FROM users WHERE id=$1
      `,
    [organizerId],
  );
  if (organizer.rowCount === 0) {
    throw new Error("organizer not exist in the database");
  }

  const result = await pool.query(
    `
    INSERT INTO events (title,description,category,date,location,total_seats, available_seats,price,organizer_id) VALUES($1,$2,$3,$4,$5,$6,$6,$7,$8) RETURNING *
    `,
    [
      title,
      description,
      category,
      date,
      location,
      total_seats,
      price,
      organizerId,
    ],
  );
  const event = result.rows[0];
  return { ...event, price: parseFloat(event.price) };
};

const getAllEventsFromDB = async (search?: string) => {
  let sql = `SELECT * FROM events`;
  const params: string[] = [];

  if (search && search.trim()) {
    sql += ` WHERE title ILIKE $1 OR description ILIKE $1`;
    params.push(`%${search.trim()}%`);
  }

  sql += ` ORDER BY created_at DESC`;

  const result = await pool.query(sql, params);
  return result.rows;
};

const getSingleEventFromDB = async (id: string) => {
  const eventId = Number(id);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new Error("Invalid event id");
  }
  //   Search Event
  const eventResult = await pool.query(
    ` SELECT * FROM events WHERE id=$1
      `,
    [eventId],
  );

  if (eventResult.rowCount === 0) {
    throw new Error("Event not found");
  }

  const organizerResult = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
    `,
    [eventResult.rows[0].organizer_id],
  );
  const event = eventResult.rows[0];
  const organizer = {
    id: organizerResult.rows[0].id,
    name: organizerResult.rows[0].name,
    email: organizerResult.rows[0].email,
  };

  return { ...event, organizer };
};

type UpdatePayload = Partial<{
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  total_seats: number;
  price: number;
}>;

// const updateEventFromDB = async (
//   id: string,
//   body: UpdatePayload,
//   user: { id: number; role: string },
// ) => {
//   const eventId = Number(id);
//   if (!Number.isInteger(eventId) || eventId <= 0) {
//     throw new Error("Invalid event id");
//   }
//   const { title, description, category, date, location, total_seats, price } =
//     body;
//   const hasAny = [
//     title,
//     description,
//     category,
//     date,
//     location,
//     total_seats,
//     price,
//   ].some((v) => v !== undefined);
//   if (!hasAny) {
//     throw new Error("At least one updatable field is required");
//   }

//   //   Search Event
//   const eventResult = await pool.query(
//     ` SELECT * FROM events WHERE id=$1
//       `,
//     [id],
//   );
//   if (eventResult.rowCount === 0) {
//     throw new Error("Event not found");
//   }
//   //   Event owner search;
//   if (eventResult.rows[0].organizer_id !== user.id) {
//     throw new Error("You are not allowed to update this even");
//   }
// //

//   const result = await pool.query(
//     `UPDATE events SET
//     title = COALESCE($1, title),
//     description = COALESCE($2, description),
//     category = COALESCE($3, category),
//     date = COALESCE($4, date),
//     location = COALESCE($5, location),
//     total_seats = COALESCE($6, total_seats),
//     price = COALESCE($7, price),
//     updated_at = NOW()
//     WHERE id=$5 RETURNING *
//     `,

//     [
//       title ?? null,
//       description ?? null,
//       category ?? null,
//       date ?? null,
//       location ?? null,
//       total_seats ?? null,
//       price ?? null,
//       id,
//     ],
//   );
// };

const updateEventFromDB = async (
  id: string,
  body: UpdatePayload,
  user: { id: number; role: string },
) => {
  const eventId = Number(id);

  // Step 1: Validate Event ID
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new Error("Invalid event id");
  }

  // Step 2: Check empty body
  const allowedFields = [
    "title",
    "description",
    "category",
    "date",
    "location",
    "total_seats",
    "price",
  ] as const;

  const entries = Object.entries(body).filter(
    ([key, value]) =>
      allowedFields.includes(key as (typeof allowedFields)[number]) &&
      value !== undefined,
  );
  console.log(entries);

  if (entries.length === 0) {
    throw new Error("At least one updatable field is required");
  }

  // Step 3: Start Transaction
  //   const client = await pool.connect();

  try {
    await pool.query("BEGIN");
    // Step 4: Find Event and Lock Row
    const eventResult = await pool.query(
      `SELECT * FROM events WHERE id = $1 FOR UPDATE`,
      [eventId],
    );

    if (eventResult.rowCount === 0) {
      throw new Error("Event not found");
    }

    const event = eventResult.rows[0];

    // Step 5: Check Owner
    if (Number(event.organizer_id) !== user.id) {
      throw new Error("You are not allowed to update this event");
    }

    // Step 6: Dynamic UPDATE
    const setParts: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of entries) {
      values.push(value);
      setParts.push(`${key} = $${values.length}`);
    }

    // Step 7: Seat Adjustment
    if (body.total_seats !== undefined) {
      const soldResult = await pool.query(
        `SELECT COALESCE(SUM(tickets_booked), 0) AS sold
         FROM bookings
         WHERE event_id = $1
         AND status = 'confirmed'`,
        [eventId],
      );

      const sold = Number(soldResult.rows[0].sold);

      const newAvailableSeats = body.total_seats - sold;

      if (newAvailableSeats < 0) {
        throw new Error("Total seats cannot be less than already sold tickets");
      }

      values.push(newAvailableSeats);

      setParts.push(`available_seats = $${values.length}`);
    }

    // Step 8: Update timestamp
    setParts.push("updated_at = NOW()");

    // Step 9: Execute UPDATE
    values.push(eventId);

    const updateQuery = `
      UPDATE events
      SET ${setParts.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    await pool.query("COMMIT");

    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

const deleteEventFromDB = async (
  id: string,
  user: { id: number; role: string },
) => {
  // Step 1: Validate Event ID
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new Error("Invalid event id");
  }

  // Step 2: Search Event
  const eventResult = await pool.query(`SELECT * FROM events WHERE id = $1`, [
    eventId,
  ]);

  if (eventResult.rowCount === 0) {
    throw new Error("Event not found");
  }

  const event = eventResult.rows[0];

  // Step 3: Check Event Owner
  if (Number(event.organizer_id) !== user.id) {
    throw new Error("You are not allowed to delete this event");
  }

  // Step 4: Check Confirmed Bookings
  const bookingResult = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM bookings
       WHERE event_id = $1
       AND status = 'confirmed'
     ) AS has_confirmed_bookings`,
    [eventId],
  );

  if (bookingResult.rows[0].has_confirmed_bookings) {
    throw new Error("Cannot delete event because confirmed bookings exist");
  }

  // Step 5: Delete Event
  const result = await pool.query(
    `DELETE FROM events
     WHERE id = $1
     RETURNING id`,
    [eventId],
  );

  return result.rows[0];
};

export const eventService = {
  createEventIntroDB,
  getAllEventsFromDB,
  getSingleEventFromDB,
  updateEventFromDB,
  deleteEventFromDB,
};
