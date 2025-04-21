import sys
import json
import yt_dlp
import os
import uuid
import requests

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

if not ASSEMBLYAI_API_KEY:
    print(json.dumps({"error": "AssemblyAI API key not set"}))
    sys.exit(1)


def get_video_duration(video_url):
    try:
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(video_url, download=False)
            duration = info.get("duration", 0)  # in seconds
            return duration / 60  # convert to minutes
    except Exception as e:
        raise Exception(f"Failed to get video duration: {str(e)}")


def download_audio(video_url):
    unique_filename = str(uuid.uuid4())
    output_filename = f"{unique_filename}.mp3"

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f"{unique_filename}.%(ext)s",
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

        if not os.path.exists(output_filename):
            raise FileNotFoundError("Audio file not found after conversion.")

        return output_filename

    except Exception as e:
        raise Exception(f"Download/Conversion failed: {str(e)}")


def upload_to_assemblyai(file_path):
    headers = {
        "authorization": ASSEMBLYAI_API_KEY,
    }

    try:
        with open(file_path, 'rb') as f:
            response = requests.post(
                "https://api.assemblyai.com/v2/upload",
                headers=headers,
                data=f
            )

        if response.status_code == 200:
            upload_url = response.json().get("upload_url")
            return upload_url
        else:
            raise Exception(f"AssemblyAI upload failed: {response.text}")

    except Exception as e:
        raise Exception(f"Upload error: {str(e)}")


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python3 script.py <video_url> <user_minutes>"}))
        sys.exit(1)

    video_url = sys.argv[1]

    try:
        user_minutes = float(sys.argv[2])
    except ValueError:
        print(json.dumps({"error": "Invalid user minutes"}))
        sys.exit(1)

    try:
        # Step 1: Get video duration
        video_minutes = get_video_duration(video_url)

        # Step 2: Check if user has enough minutes
        if video_minutes > user_minutes:
            print(json.dumps({
                "error": f"Video is {video_minutes:.2f} minutes long, but user only has {user_minutes:.2f} minutes left."
            }))
            sys.exit(1)

        # Step 3: Download audio
        audio_file = download_audio(video_url)

        # Step 4: Upload to AssemblyAI
        assemblyai_url = upload_to_assemblyai(audio_file)

        # Step 5: Delete temporary audio file
        os.remove(audio_file)

        # Step 6: Respond with video length and upload URL
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
