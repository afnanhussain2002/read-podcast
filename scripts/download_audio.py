import sys
import json
import yt_dlp
import os

def download_audio(video_url):
    output_filename = "public/audio"  # Remove .mp3 from 'outtmpl'
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_filename,  # No .mp3 extension here
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
        'noprogress': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        # Fix filename: Rename `audio.mp3.mp3` to `audio.mp3`
        final_filename = "public/audio.mp3"
        if os.path.exists(final_filename + ".mp3"):  # If double extension exists
            os.rename(final_filename + ".mp3", final_filename)

        print(json.dumps({"file_path": "/audio.mp3"}))  # Return correct filename
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    video_url = sys.argv[1]
    download_audio(video_url)
