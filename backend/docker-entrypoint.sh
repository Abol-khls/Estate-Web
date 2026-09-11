#!/bin/sh
set -e

python << 'PYEOF'
import os
import time
import sys

if os.environ.get("DB_ENGINE") == "postgresql":

    import psycopg2

    for attempt in range(30):

        try:
            conn = psycopg2.connect(
                dbname=os.environ["DB_NAME"],
                user=os.environ["DB_USER"],
                password=os.environ["DB_PASSWORD"],
                host=os.environ.get("DB_HOST", "db"),
                port=os.environ.get("DB_PORT", "5432"),
            )
            conn.close()
            break

        except psycopg2.OperationalError:
            time.sleep(1)

    else:
        sys.exit("Database never became available")

PYEOF

python manage.py migrate --noinput

python manage.py collectstatic --noinput

exec "$@"