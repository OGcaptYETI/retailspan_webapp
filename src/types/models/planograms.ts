export interface Planogram {
    id: number;
    created_at: string;
    name: string;
    description?: string;
    fixture_id?: number;
    layout: {
      products: Array<{
        id: number;
        x: number;
        y: number;
        rotation?: number;
        facings?: number;
      }>;
      shelves?: Array<{
        id: number;
        y: number;
        height: number;
      }>;
    };
    active?: boolean;
  }