import os
import pytest
from sqlalchemy import text

import main


RUN_INTEGRATION_ENV = os.getenv('RUN_INTEGRATION_TESTS')
RUN_INTEGRATION_EXPLICIT = RUN_INTEGRATION_ENV is not None and RUN_INTEGRATION_ENV.lower() in ('1', 'true', 'yes')

# Auto-enable integration tests only when a non-pooler POSTGRES_CONNECTION
# exists, or when a POSTGRES_TEST_TENANT is provided for Supabase poolers.
pg_conn = os.getenv('POSTGRES_CONNECTION', '')
is_supabase_pooler = 'pooler.supabase.com' in pg_conn
has_tenant_hint = bool(os.getenv('POSTGRES_TEST_TENANT'))

if RUN_INTEGRATION_EXPLICIT:
    RUN_INTEGRATION = True
else:
    # Only auto-enable when connection is present and either it's not a pooler
    # or we have a tenant hint available.
    RUN_INTEGRATION = bool(pg_conn) and (not is_supabase_pooler or has_tenant_hint)

pytestmark = pytest.mark.skipif(
    not RUN_INTEGRATION,
    reason='Integration tests disabled. Set RUN_INTEGRATION_TESTS=1 or provide POSTGRES_CONNECTION and POSTGRES_TEST_TENANT to enable.'
)


def test_db_connection_basic():
    """Basic DB connectivity check using SQLAlchemy engine from `main`."""
    with main.engine.connect() as conn:
        res = conn.execute(text('SELECT 1')).scalar()
        assert int(res) == 1


def test_query_table_runs():
    """Run a sample `query_table` call to ensure SQL path works. This expects the `branches` table to exist.

    The test is intentionally forgiving: it asserts that the function returns a list (possibly empty).
    """
    table = os.getenv('DB_TEST_TABLE', 'branches')
    # Allow the integration test to be pointed at a different table name via env var `DB_TEST_TABLE`.
    rows = main.query_table(table, select='branch_id', limit=1)
    assert isinstance(rows, list)
