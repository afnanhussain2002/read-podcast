import os
import sys
import uuid
import cloudinary
import cloudinary.uploader
from moviepy.editor import VideoFileClip

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def convert_video_to_audio(video_path: str, output_audio_path: str = "output.mp3"):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path, logger=None)  # Disable logs
    except Exception as e:
        print(f"[ERROR] Video to audio conversion failed: {e}", file=sys.stderr)
        raise

def upload_audio_to_cloudinary(audio_path: str):
    try:
        result = cloudinary.uploader.upload(audio_path, resource_type="video")
        return result["secure_url"]
    except Exception as e:
        print(f"[ERROR] Cloudinary upload failed: {e}", file=sys.stderr)
        raise

def process_and_upload_audio(video_path: str):
    unique_filename = str(uuid.uuid4())
    output_audio_path = f"{unique_filename}.mp3"

    convert_video_to_audio(video_path, output_audio_path)
    cloudinary_url = upload_audio_to_cloudinary(output_audio_path)

    try:
        os.remove(output_audio_path)
    except Exception as e:
        print(f"[ERROR] Cleanup failed: {e}", file=sys.stderr)

    return cloudinary_url

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[ERROR] No video path provided.", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        url = process_and_upload_audio(video_path)
        print(url)  # ✅ Only print the final URL to stdout
    except Exception as e:
        print(f"[ERROR] Video processing failed: {e}", file=sys.stderr)
        sys.exit(1)
