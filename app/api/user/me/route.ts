import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";