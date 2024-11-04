import os
import json
import uuid
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

def insert_user(conn, author, created_users):
    # Check if user already exists in the list
    for user in created_users:
        if user['name'] == author:
            return user['id']


    email = f"{author}@gmail.com"
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cur.fetchone()

        if existing_user:
            # Si el usuario ya existe, devuelve su ID
            user_id = existing_user[0]
            created_users.append({'id': user_id, 'name': author})
            return user_id

    # If user does not exist, create a new one
    user_id = str(uuid.uuid4())
    password = "$2a$10$fVKfcc47q6lrNbeXangjYeY000dmjdjkdBxEOilqhapuTO5ZH0co2"

    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO users (id, name, email)
            VALUES (%s, %s, %s)
        """, (user_id, author, email))

        cur.execute("""
            INSERT INTO user_security (username, email, password, role)
            VALUES (%s, %s, %s, %s)
        """, (author, email, password, "USER"))

    # Add the new user to the list
    created_users.append({'id': user_id, 'name': author})
    return user_id

def insert_video(conn, video_data, directory_path):
    created_users = []
    user_id = insert_user(conn, video_data['user'], created_users)
    with conn.cursor() as cur:
        # Inserta los datos del video
        cur.execute("""
            INSERT INTO videos (id, width, height, duration, title, owner_id, image_path, video_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (video_data['id'], video_data['width'], video_data['height'], video_data['duration'], video_data['title'],
              user_id, f"{video_data['id']}.webp", f"{video_data['id']}.mp4"))
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
            user_id = insert_user(conn, comment['author'], created_users)
            cur.execute("""
                INSERT INTO video_comments (video_id, comment_text, comment_author)
                VALUES (%s, %s, %s)
            """, (video_id, comment['text'], user_id))

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

                    insert_video(conn, video_data, directory_path)
                print(f"Procesado archivo: {filename}")
    except Exception as e:
        print(f"Ocurrió un error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    directory_path = '/Users/giselabusquetsluengo/Desktop/LabSoftwareII/store'
    process_json_files(directory_path)
