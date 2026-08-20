import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/process-photo")
async def process_photo(file: UploadFile = File(...), event_id: Optional[str] = Form(None), slug: Optional[str] = Form(None)):
    print("--- MULA PROSES (SUPABASE STORAGE) ---")
    
    try:
        file_bytes = await file.read()
        file_name = file.filename
        
        # Muat naik terus ke Supabase Storage Bucket 'photos'
        bucket_name = "photos" 
        
        storage_response = supabase.storage.from_(bucket_name).upload(
            path=file_name,
            file=file_bytes,
            file_options={"content-type": file.content_type, "upsert": "true"}
        )
        print("Upload ke Supabase Storage BERJAYA!")

        # Ambil Public URL gambar dari Supabase
        image_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        target = event_id or slug
        real_event_id = None
        if target:
            res = supabase.table("events").select("id").or_(f"slug.eq.{target},id.eq.{target}").execute()
            if res.data: 
                real_event_id = res.data[0]["id"]
        
        if not real_event_id:
            fallback = supabase.table("events").select("id").limit(1).execute()
            if fallback.data: 
                real_event_id = fallback.data[0]["id"]
        
        print(f"Event ID: {real_event_id}")

        data = {
            "event_id": real_event_id,
            "watermark_url": image_url,
            "original_url": image_url,
            "bib_numbers": ["W0222"] # Anda boleh ubah cara baca nombor bib sebenar nanti
        }
        
        response = supabase.table("photos").insert(data).execute()
        print("RESPONS SUPABASE MENTAH:", response)
        
        return {"success": True, "image_url": image_url}
        
    except Exception as e:
        print("RALAT KRITIKAL:", str(e))
        return {"success": False, "error": str(e)}

# --- ENDPOINT BARU UNTUK CARIAN NOMBOR BIB ---
@app.get("/search-bib")
async def search_bib(bib: str):
    print(f"--- MENCARI BIB: {bib} ---")
    try:
        # Mencari rekod dalam table 'photos' di mana kolum bib_numbers mengandungi nombor bib yang dicari
        response = supabase.table("photos").select("*").contains("bib_numbers", [bib]).execute()
        
        return {"success": True, "data": response.data}
    except Exception as e:
        print("RALAT CARIAN:", str(e))
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)