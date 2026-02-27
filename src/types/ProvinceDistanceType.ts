export default interface ProvinceDistanceType {
  id: number;
  fromProvinceId: number;
  toProvinceId: number;
  distance_km: number;
  updatedAt: Date;
}

export interface CreateProvinceDistanceType {
  fromProvinceId: number;
  toProvinceId: number;
  distance_km: number;
}

export interface UpdateProvinceDistanceType {
  fromProvinceId?: number;
  toProvinceId?: number;
  distance_km?: number;
}