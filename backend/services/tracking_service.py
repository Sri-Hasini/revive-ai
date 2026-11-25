"""Local demonstration transaction store. No authentication or multi-user authorization."""
import os
import sqlite3
from pathlib import Path
from datetime import datetime, timezone

DEFAULT_DB = Path(__file__).resolve().parents[1] / 'data' / 'tracking.sqlite3'

def connection():
    filename = Path(os.environ.get('REVIVE_TRACKING_DB', str(DEFAULT_DB)))
    filename.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(filename), timeout=10)
    con.row_factory = sqlite3.Row
    con.execute("""CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        action TEXT NOT NULL,
        weight_kg REAL NOT NULL,
        organization_name TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        verified INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    )""")
    return con

def create_transaction(item_name, action, weight_kg, organization_name=None):
    if action not in ('DONATE', 'REPAIR', 'REUSE', 'RECYCLE'):
        raise ValueError('Unsupported action')
    if weight_kg <= 0 or weight_kg > 100000:
        raise ValueError('Weight must be between 0 and 100000 kg')
    with connection() as con:
        cur = con.execute("""INSERT INTO transactions (
            item_name, action, weight_kg, organization_name, created_at
        ) VALUES (?, ?, ?, ?, ?)""",
        (item_name.strip(), action, weight_kg, organization_name,
         datetime.now(timezone.utc).isoformat()))
        row = con.execute('SELECT * FROM transactions WHERE id=?', (cur.lastrowid,)).fetchone()
        return dict(row)

def update_transaction(transaction_id, status=None, verified=None):
    with connection() as con:
        old = con.execute('SELECT * FROM transactions WHERE id=?', (transaction_id,)).fetchone()
        if old is None:
            return None
        updates=[];args=[]
        if status is not None:
            updates.append('status=?'); args.append(status)
        if verified is not None:
            updates.append('verified=?');args.append(int(verified))
        if not updates:
            raise ValueError('No values to update')
        con.execute('UPDATE transactions SET ' + ', '.join(updates) + ' WHERE id=?', (*args,transaction_id))
        return dict(con.execute('SELECT * FROM transactions WHERE id=?', (transaction_id,)).fetchone())

def get_impact_statistics():
    with connection() as con:
        r = con.execute("""SELECT COUNT(*) AS total_transactions,
            COALESCE(SUM(weight_kg),0) AS recorded_weight_kg,
            COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END),0) AS pending_transactions,
            COALESCE(SUM(CASE WHEN status='completed' AND verified=1 THEN 1 ELSE 0 END),0) AS verified_completed_transactions,
            COALESCE(SUM(CASE WHEN status='completed' AND verified=1 THEN weight_kg ELSE 0 END),0) AS verified_recovered_weight_kg
          FROM transactions""").fetchone()
        return dict(r)
