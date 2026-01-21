export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Farm {
  id: string;
  name: string;
  totalArea: number;
  location: {
    lat: number;
    lng: number;
  };
  owner: string;
}

export type Status = 'active' | 'inactive' | 'pending';
