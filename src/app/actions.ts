"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function createAccountAction(data: {
  email: string;
  password?: string;
  profession: string;
  uiStyle: string;
  themePreset: string;
}) {
  try {
    // Basic user creation
    const user = await prisma.user.create({
      data: {
        email: data.email || `guest_${Date.now()}@renaboard.local`,
        password: data.password || null,
        profession: data.profession,
        uiStyle: data.uiStyle,
        themePreset: data.themePreset,
      },
    });

    // Create a default board for them
    await prisma.board.create({
      data: {
        name: "My Board",
        userId: user.id,
        tabs: JSON.stringify(["Dashboard", "Projects", "Notes"]),
        widgets: JSON.stringify([
          { id: "clock-1" },
          { id: "weather-1" },
          { id: "notion-1" }
        ]),
      }
    });

    // Set a cookie so we know who is logged in (super simple auth for MVP)
    const cookieStore = await cookies();
    cookieStore.set("renaboard_user_id", user.id);

    return { success: true };
  } catch (error) {
    console.error("Failed to create account", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function saveBoardLayoutAction(widgetsJson: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("renaboard_user_id")?.value;
    if (!userId) return { success: false };

    const board = await prisma.board.findFirst({ where: { userId } });
    if (!board) return { success: false };

    await prisma.board.update({
      where: { id: board.id },
      data: { widgets: widgetsJson }
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getBoardAction() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("renaboard_user_id")?.value;
    if (!userId) return null;

    const board = await prisma.board.findFirst({ where: { userId } });
    if (!board) return null;

    return {
      id: board.id,
      tabs: JSON.parse(board.tabs || "[]"),
      widgets: JSON.parse(board.widgets || "[]")
    };
  } catch (e) {
    return null;
  }
}
