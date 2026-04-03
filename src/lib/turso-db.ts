// Turso HTTP client for serverless database operations
const TURSO_URL = process.env.TURSO_DATABASE_URL || "";
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || "";

interface TursoResult {
  results: Array<{
    columns: string[];
    rows: Array<Array<{ type: string; value: any }>>;
  }>;
}

export async function tursoQuery(sql: string, params: any[] = []): Promise<any[]> {
  // Replace ? placeholders with actual values
  let finalSql = sql;
  params.forEach((param, index) => {
    let value = param;
    if (typeof value === 'string') {
      value = `'${value.replace(/'/g, "''")}'`;
    } else if (value === null || value === undefined) {
      value = 'NULL';
    } else if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }
    finalSql = finalSql.replace('?', value);
  });

  const response = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ type: 'execute', stmt: { sql: finalSql } }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Turso error: ${error}`);
  }

  const data = await response.json() as TursoResult;

  if (!data.results?.[0]?.rows) {
    return [];
  }

  const columns = data.results[0].columns || [];
  const rows = data.results[0].rows || [];

  return rows.map((row) => {
    const obj: Record<string, any> = {};
    row.forEach((cell, index) => {
      obj[columns[index]] = cell.value;
    });
    return obj;
  });
}

export async function tursoExecute(sql: string, params: any[] = []): Promise<{ lastInsertRowid?: string; changes: number }> {
  // Replace ? placeholders
  let finalSql = sql;
  params.forEach((param, index) => {
    let value = param;
    if (typeof value === 'string') {
      value = `'${value.replace(/'/g, "''")}'`;
    } else if (value === null || value === undefined) {
      value = 'NULL';
    } else if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }
    finalSql = finalSql.replace('?', value);
  });

  const response = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ type: 'execute', stmt: { sql: finalSql } }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Turso error: ${error}`);
  }

  const data = await response.json();

  return {
    lastInsertRowid: data.results?.[0]?.response?.result?.last_insert_rowid,
    changes: data.results?.[0]?.response?.result?.affected_row_count || 0,
  };
}
