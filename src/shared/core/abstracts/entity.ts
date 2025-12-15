import { randomUUID } from 'crypto'

abstract class Entity<Props> {
  public readonly id: string
  public readonly props: Props

  protected constructor(props: Props, id?: string) {
    this.id = id ?? randomUUID()
    this.props = props
  }
}

export { Entity }
