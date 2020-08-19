export interface TimeService {
  now(): number
}

export class BaseTimeService implements TimeService {
  public now(): number {
    return Date.now()
  }
}

export class FixedTimeService implements TimeService {
  constructor(private fixedTime: number) {}

  public now(): number {
    return this.fixedTime
  }
}
