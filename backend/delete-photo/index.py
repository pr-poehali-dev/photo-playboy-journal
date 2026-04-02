import os
import json
import boto3
import psycopg2


def handler(event: dict, context) -> dict:
    """Удаляет фотографию из S3 и БД по id."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    photo_id = body.get('id')

    if not photo_id:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'id required'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"SELECT s3_key FROM {schema}.photos WHERE id = %s", (photo_id,))
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'not found'})}

    s3_key = row[0]

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.delete_object(Bucket='files', Key=s3_key)

    cur.execute(f"DELETE FROM {schema}.photos WHERE id = %s", (photo_id,))
    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}
