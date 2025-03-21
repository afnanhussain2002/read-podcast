import yt_dlp
import sys
import json

def download_audio(video_url):
    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "outtmpl": "public/audio.mp3"  # Save inside Next.js public folder
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

    # Return the file path in JSON format
    print(json.dumps({"file_path": "/audio.mp3"}))

if __name__ == "__main__":
    video_url = sys.argv[1]  # Get URL from command line argument
    download_audio(video_url)
