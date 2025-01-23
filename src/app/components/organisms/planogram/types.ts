
// app/components/organisms/planogram/types.ts

export interface Position {
    x: number;
    y: number;
  }
  
  export interface Dimensions {
    width: number;
    height: number;
    depth?: number;
  }
  
  export interface PlanogramProduct {
    id: string;
    productId: string;
    position: Position;
    rotation: number;
    facings: number;
  }
  
  export interface PlanogramShelf {
    id: string;
    position: Position;
    dimensions: Dimensions;
    type: 'shelf' | 'peg' | 'basket';
  }
  
  export interface PlanogramState {
    products: PlanogramProduct[];
    shelves?: PlanogramShelf[];
    dimensions?: Dimensions;
  }
  
  export interface PlanogramFixture {
    id: number;
    name: string;
    type: string;
    dimensions: Dimensions;
    created_at: string;
  }