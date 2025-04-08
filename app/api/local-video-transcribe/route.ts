import { NextResponse } from "next/server";
import multer from "multer";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { promisify } from "util";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Configure Multer
const upload = multer({
    dest: "uploads/",
})
const uploadMiddleware = upload.single("video");

export const config = {
    api: {
        bodyParser: false,
    },
};
