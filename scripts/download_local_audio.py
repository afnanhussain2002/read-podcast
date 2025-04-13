import sys
import uuid
import os
import requests
from moviepy.editor import VideoFileClip

ASSEMBLY_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
UPLOAD_ENDPOINT = "https://api.assemblyai.com/v2/upload"
HEADERS = {"authorization": ASSEMBLY_API_KEY}

def convert_video_to_audio(video_path: str, output_audio_path: str = "output.mp3"):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path, logger=None)
    except Exception as e:
        print(f"[ERROR] Video to audio conversion failed: {e}", file=sys.stderr)
        raise

def upload_audio_to_assemblyai(audio_path: str) -> str:
    try:
        with open(audio_path, 'rb') as f:
            response = requests.post(UPLOAD_ENDPOINT, headers=HEADERS, data=f)
        response.raise_for_status()
        return response.json()["upload_url"]
    except Exception as e:
        print(f"[ERROR] AssemblyAI upload failed: {e}", file=sys.stderr)
        raise

def process_and_upload_audio(video_path: str) -> str:
    unique_filename = f"{uuid.uuid4()}.mp3"
    convert_video_to_audio(video_path, unique_filename)
    
    assembly_url = upload_audio_to_assemblyai(unique_filename)

    try:
        os.remove(unique_filename)
    except Exception as e:
        print(f"[ERROR] Cleanup failed: {e}", file=sys.stderr)

    return assembly_url

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[ERROR] No video path provided.", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        url = process_and_upload_audio(video_path)
        print(url)  # Only print the final upload URL to stdout
    except Exception as e:
        print(f"[ERROR] Video processing failed: {e}", file=sys.stderr)
        sys.exit(1)
