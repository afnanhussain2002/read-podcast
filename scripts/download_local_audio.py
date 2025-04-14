import uuid
import requests
from moviepy.editor import VideoFileClip
import os
import sys

# AssemblyAI API key
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

def convert_video_to_audio(video_path: str, output_audio_path: str = "output.mp3"):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path, logger=None)  # Disable logs
    except Exception as e:
        print(f"[ERROR] Video to audio conversion failed: {e}", file=sys.stderr)
        raise

def upload_audio_to_assemblyai(audio_path: str) -> str:
    headers = {
        "authorization": ASSEMBLYAI_API_KEY
    }

    try:
        with open(audio_path, "rb") as f:
            response = requests.post(
                "https://api.assemblyai.com/v2/upload",
                headers=headers,
                data=f
            )
        response.raise_for_status()
        return response.json()["upload_url"]
    except Exception as e:
        print(f"[ERROR] AssemblyAI upload failed: {e}", file=sys.stderr)
        raise

def process_and_upload_audio(video_path: str):
    unique_filename = str(uuid.uuid4())
    output_audio_path = f"{unique_filename}.mp3"

    convert_video_to_audio(video_path, output_audio_path)
    assemblyai_url = upload_audio_to_assemblyai(output_audio_path)

    try:
        os.remove(output_audio_path)
    except Exception as e:
        print(f"[ERROR] Cleanup failed: {e}", file=sys.stderr)

    return assemblyai_url

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
