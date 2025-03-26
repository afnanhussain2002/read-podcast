import sys
import yt_dlp
import json
import os

video_url = sys.argv[1]
output_dir = "public"
unique_id = str(os.getpid())  # Use process ID to ensure unique filenames
output_file = f"{output_dir}/audio_{unique_id}.mp3"

ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': output_file,
    'noplaylist': True,
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    
    # Return the unique filename
    print(json.dumps({"file_path": output_file}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
