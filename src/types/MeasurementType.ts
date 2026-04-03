interface MeasurementBase {
  name: string;
  unit: string;
}

export interface CreateMeasurement extends MeasurementBase {}

export interface UpdateMeasurement extends Partial<MeasurementBase> {}
