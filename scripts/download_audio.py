import sys
import json
import yt_dlp
import os
import cloudinary
import cloudinary.uploader
import uuid

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def download_and_upload_audio(video_url):
    unique_filename = str(uuid.uuid4())  # Generate a unique filename using UUID

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f"{unique_filename}.%(ext)s",  # Use the unique filename for the audio
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
        'noprogress': True,
    }

    try:
        # Download the video and convert it to audio
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        final_filename = f"{unique_filename}.mp3"

        if not os.path.exists(final_filename):
            raise FileNotFoundError("Audio file not found after conversion.")

        # Upload directly to Cloudinary
        result = cloudinary.uploader.upload(final_filename, resource_type="video")  # Audio is treated as "video"

        # Remove the local file after upload
        os.remove(final_filename)

        # Return Cloudinary URL
        print(json.dumps({"cloudinary_url": result["secure_url"]}))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    video_url = sys.argv[1]
    download_and_upload_audio(video_url)
