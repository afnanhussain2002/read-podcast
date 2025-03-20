import { exec } from "child_process";
import path from "path";

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { videoUrl } = req.body;
    if (!videoUrl) {
        return res.status(400).json({ error: "Missing video URL" });
    }

    const scriptPath = path.join(process.cwd(), "scripts", "download_audio.py");

    exec(`python3 ${scriptPath} "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ error: "Failed to download audio" });
        }

        try {
            const result = JSON.parse(stdout);
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to parse response" });
        }
    });
}
