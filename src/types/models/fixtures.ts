export interface Fixture {
    id: number;
    created_at: string;
    name: string;
    type: string;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    active?: boolean;
  }