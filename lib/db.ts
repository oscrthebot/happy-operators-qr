import { sql } from '@vercel/postgres';

export async function initDatabase() {
  // Create qr_codes table
  await sql`
    CREATE TABLE IF NOT EXISTS qr_codes (
      id SERIAL PRIMARY KEY,
      short_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      target_url TEXT NOT NULL,
      qr_data_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create qr_clicks table
  await sql`
    CREATE TABLE IF NOT EXISTS qr_clicks (
      id SERIAL PRIMARY KEY,
      qr_id INTEGER REFERENCES qr_codes(id) ON DELETE CASCADE,
      clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_agent TEXT,
      ip_hash TEXT
    )
  `;

  // Create index for faster analytics queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_qr_clicks_qr_id ON qr_clicks(qr_id);
    CREATE INDEX IF NOT EXISTS idx_qr_clicks_clicked_at ON qr_clicks(clicked_at);
  `;
}

export async function createQRCode(
  shortId: string,
  name: string,
  targetUrl: string,
  qrDataUrl: string
) {
  const result = await sql`
    INSERT INTO qr_codes (short_id, name, target_url, qr_data_url)
    VALUES (${shortId}, ${name}, ${targetUrl}, ${qrDataUrl})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getAllQRCodes() {
  const result = await sql`
    SELECT 
      qc.*,
      COUNT(qcl.id) as click_count
    FROM qr_codes qc
    LEFT JOIN qr_clicks qcl ON qc.id = qcl.qr_id
    GROUP BY qc.id
    ORDER BY qc.created_at DESC
  `;
  return result.rows;
}

export async function getQRCodeByShortId(shortId: string) {
  const result = await sql`
    SELECT * FROM qr_codes WHERE short_id = ${shortId}
  `;
  return result.rows[0];
}

export async function trackClick(qrId: number, userAgent: string, ipHash: string) {
  await sql`
    INSERT INTO qr_clicks (qr_id, user_agent, ip_hash)
    VALUES (${qrId}, ${userAgent}, ${ipHash})
  `;
}

export async function getQRAnalytics(qrId: number, days: number = 30) {
  const result = await sql`
    SELECT 
      DATE(clicked_at) as date,
      COUNT(*) as clicks
    FROM qr_clicks
    WHERE qr_id = ${qrId}
      AND clicked_at >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(clicked_at)
    ORDER BY date DESC
  `;
  return result.rows;
}
