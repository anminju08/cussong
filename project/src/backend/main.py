from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymysql
from typing import List, Optional

app = FastAPI()

def get_conn():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="q1w2e3",
        db="musicdb",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

class Song(BaseModel):
    id: Optional[int]
    title: str
    artist: str
    album: Optional[str] = None
    duration: Optional[int] = None
    file_url: str

@app.get("/songs", response_model=List[Song])
def get_songs():
    conn = get_conn()
    with conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM song ORDER BY id DESC")
            return cur.fetchall()

@app.get("/songs/{song_id}", response_model=Song)
def get_song(song_id: int):
    conn = get_conn()
    with conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM song WHERE id=%s", (song_id,))
            song = cur.fetchone()
            if not song:
                raise HTTPException(status_code=404, detail="Song not found")
            return song

@app.post("/songs", response_model=Song)
def create_song(song: Song):
    conn = get_conn()
    with conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO song (title, artist, album, duration, file_url) VALUES (%s, %s, %s, %s, %s)",
                (song.title, song.artist, song.album, song.duration, song.file_url)
            )
            conn.commit()
            song_id = cur.lastrowid
            cur.execute("SELECT * FROM song WHERE id=%s", (song_id,))
            return cur.fetchone()

@app.put("/songs/{song_id}", response_model=Song)
def update_song(song_id: int, song: Song):
    conn = get_conn()
    with conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE song SET title=%s, artist=%s, album=%s, duration=%s, file_url=%s WHERE id=%s",
                (song.title, song.artist, song.album, song.duration, song.file_url, song_id)
            )
            conn.commit()
            cur.execute("SELECT * FROM song WHERE id=%s", (song_id,))
            updated = cur.fetchone()
            if not updated:
                raise HTTPException(status_code=404, detail="Song not found")
            return updated

@app.delete("/songs/{song_id}")
def delete_song(song_id: int):
    conn = get_conn()
    with conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM song WHERE id=%s", (song_id,))
            conn.commit()
            return {"ok": True}
