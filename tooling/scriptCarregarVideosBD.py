import os
import json
import psycopg2

# Configura la conexión a PostgreSQL
def connect_to_db():
    conn = psycopg2.connect(
        dbname="protube-dev",
        user="postgres",
        password="admin1234",
        host="localhost",
        port="5432"
    )
    return conn

def insert_video(conn, video_data):
    with conn.cursor() as cur:
        # Inserta los datos del video
        cur.execute("""
            INSERT INTO videos (id, width, height, duration, title, username)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (video_data['id'], video_data['width'], video_data['height'], video_data['duration'], video_data['title'], video_data['user']))
        
        video_id = cur.fetchone()[0]

        # Inserta la metadata
        cur.execute("""
            INSERT INTO video_meta (video_id, description)
            VALUES (%s, %s)
        """, (video_id, video_data['meta']['description']))
        
        # Inserta las categorías
        for category in video_data['meta']['categories']:
            cur.execute("""
                INSERT INTO video_categories (video_id, category)
                VALUES (%s, %s)
            """, (video_id, category))
        
        # Inserta los tags
        for tag in video_data['meta']['tags']:
            cur.execute("""
                INSERT INTO video_tags (video_id, tag)
                VALUES (%s, %s)
            """, (video_id, tag))

        # Inserta los comentarios
        for comment in video_data['meta']['comments']:
            cur.execute("""
                INSERT INTO video_comments (video_id, comment_text, comment_author)
                VALUES (%s, %s, %s)
            """, (video_id, comment['text'], comment['author']))

        conn.commit()

def process_json_files(directory_path):
    conn = connect_to_db()

    try:
        for filename in os.listdir(directory_path):
            if filename.endswith(".json"):
                file_path = os.path.join(directory_path, filename)

                # Lee el archivo JSON
                with open(file_path, 'r', encoding='utf-8') as json_file:
                    video_data = json.load(json_file)

                    insert_video(conn, video_data)
                print(f"Procesado archivo: {filename}")
    except Exception as e:
        print(f"Ocurrió un error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    directory_path = "../store"
    process_json_files(directory_path)
