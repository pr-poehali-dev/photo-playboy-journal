import os
import json
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список всех фотографий из БД."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"""SELECT id, title, category, year, month, date_label, tags, aspect, cdn_url, created_at
            FROM {schema}.photos ORDER BY created_at DESC"""
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    photos = [
        {
            'id': r[0],
            'title': r[1],
            'category': r[2],
            'year': r[3],
            'month': r[4],
            'date': r[5],
            'tags': r[6] if r[6] else [],
            'aspect': r[7],
            'src': r[8],
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'photos': photos}),
    }
