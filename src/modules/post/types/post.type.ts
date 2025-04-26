import { Media } from "@/modules/media/models/MediaModel";
import { Post } from "../models/Post";

export type PostWithMedia = Post & { media: Media |null }