
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  targetImageUrl: string; // The physical marker image (e.g. burger on menu)
  arVideoUrl: string;    // The video to overlay
  createdAt: number;
}

export type AppMode = 'ADMIN' | 'VIEWER' | 'LANDING';
