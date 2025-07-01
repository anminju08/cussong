import pymysql

def init_db():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="q1w2e3", 
        db="musicdb",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )
    
    with conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS song (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    artist VARCHAR(255) NOT NULL,
                    album VARCHAR(255),
                    duration INT,
                    file_url VARCHAR(1024) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print("테이블 생성 완료")
        conn.commit()

if __name__ == "__main__":
    init_db()