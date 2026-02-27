interface PointRuleBase {
  required_points: number;
  discount_type: "percent" | "fixed";
  discount_value: number;
}

export interface CreatePointRule extends PointRuleBase {}

export interface UpdatePointRule extends Partial<PointRuleBase> {}

export interface PointRuleType extends PointRuleBase {
  id: number;
}
