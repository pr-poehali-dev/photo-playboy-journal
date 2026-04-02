import os
import json
import uuid
import base64
import boto3
import psycopg2


def handler(event: dict, context) -> dict:
    """Загружает фотографию в S3 и сохраняет метаданные в БД."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    file_b64 = body.get('file')
    filename = body.get('filename', 'photo.jpg')
    title = body.get('title', '')
    category = body.get('category', 'Портрет')
    tags = body.get('tags', [])
    aspect = body.get('aspect', 'square')
    year = body.get('year', 2025)
    month = body.get('month', 1)
    date_label = body.get('date_label', '')

    if not file_b64:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'file required'})}

    if ',' in file_b64:
        file_b64 = file_b64.split(',')[1]
    file_data = base64.b64decode(file_b64)

    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'jpg'
    content_type = 'image/jpeg'
    if ext == 'png':
        content_type = 'image/png'
    elif ext == 'webp':
        content_type = 'image/webp'

    key = f'photos/{uuid.uuid4()}.{ext}'
    access_key = os.environ['AWS_ACCESS_KEY_ID']

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=access_key,
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=file_data, ContentType=content_type)
    cdn_url = f'https://cdn.poehali.dev/projects/{access_key}/files/{key}'

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {schema}.photos
            (title, category, year, month, date_label, tags, aspect, s3_key, cdn_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (title, category, year, month, date_label, tags, aspect, key, cdn_url)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'id': new_id, 'cdn_url': cdn_url, 'key': key}),
    }
