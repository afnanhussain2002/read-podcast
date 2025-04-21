import uuid
import requests
from moviepy.editor import VideoFileClip
import os
import sys
import json

# AssemblyAI API key from environment variable
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

if not ASSEMBLYAI_API_KEY:
    print(json.dumps({"error": "AssemblyAI API key not set"}))
    sys.exit(1)


def get_video_duration_minutes(video_path: str) -> float:
    try:
        video = VideoFileClip(video_path)
        duration_seconds = video.duration
        return duration_seconds / 60  # convert to minutes
    except Exception as e:
        raise Exception(f"Failed to get video duration: {e}")


def convert_video_to_audio(video_path: str, output_audio_path: str = "output.mp3"):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path, logger=None)  # Disable logs
    except Exception as e:
        raise Exception(f"Video to audio conversion failed: {e}")


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
        raise Exception(f"AssemblyAI upload failed: {e}")


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python script.py <video_path> <transcript_minutes>"}))
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        transcript_minutes = float(sys.argv[2])
    except ValueError:
        print(json.dumps({"error": "Invalid transcript_minutes value"}))
        sys.exit(1)

    try:
        # Step 1: Get video duration
        video_minutes = get_video_duration_minutes(video_path)

        # Step 2: Validate duration
        if video_minutes > transcript_minutes:
            print(json.dumps({
                "error": f"Video is {video_minutes:.2f} minutes long, but only {transcript_minutes:.2f} minutes allowed."
            }))
            sys.exit(1)

        # Step 3: Convert and upload
        unique_filename = str(uuid.uuid4())
        output_audio_path = f"{unique_filename}.mp3"

        convert_video_to_audio(video_path, output_audio_path)
        assemblyai_url = upload_audio_to_assemblyai(output_audio_path)

        # Step 4: Cleanup
        os.remove(output_audio_path)

        # Step 5: Final response
        print(json.dumps({
            "status": "success",
            "video_minutes": round(video_minutes, 2),
            "assemblyai_url": assemblyai_url
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
