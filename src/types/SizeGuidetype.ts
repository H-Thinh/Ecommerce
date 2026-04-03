interface SizeGuideBase {
  categoryId: number;
  sizeId: number;
  measurementId: number;
  min: number;
  max: number;
}

export interface CreateSizeGuide extends SizeGuideBase {}

export interface UpdateSizeGuide extends Partial<SizeGuideBase> {}
