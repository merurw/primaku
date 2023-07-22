export interface ITherapy {
  id?: number
  cdicId?: number
  therapyDate?: string
  therapyTime?: string
  dailyCalorieCount?: number
  dietNote?: string
  insulinTypeBreakfast?: string
  insulinTypeBreakfastDosis?: string
  insulinTypeLunch?: string
  insulinTypeLunchDosis?: string
  insulinTypeDinner?: string
  insulinTypeDinnerDosis?: string
  insulinTypeBeforeSleep?: string
  insulinTypeBeforeSleepDosis?: string
  regimenInsulinNote?: string
  doctorNote?: string
  nextVisitSchedule?: string
}
